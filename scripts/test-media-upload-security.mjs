import assert from 'node:assert/strict';
import {
  validateUploadedFileSecurity,
  sanitizeUploadFilename,
  verifyMagicBytes,
  parseImageDimensions,
  assertSafeImageDimensions,
  ALLOWED_MIME_EXTENSIONS_MAP,
  EDITOR_ALLOWED_MIME_SET,
  EDITOR_MAX_FILE_BYTES,
} from '../src/shared/lib/file-security.js';

console.log('🧪 Starting Media & Upload Security Hardening Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

// 1. Filename sanitization and path traversal prevention
runTest('Filename Sanitization: Strips path traversal characters', () => {
  const result = sanitizeUploadFilename('../../../etc/passwd.png');
  assert.equal(result.fullName, 'passwd.png');
  assert.equal(result.ext, '.png');
});

runTest('Filename Sanitization: Blocks double-extension with dangerous types', () => {
  assert.throws(
    () => sanitizeUploadFilename('exploit.php.png'),
    /nguy hiểm bị chặn: .php/
  );
  assert.throws(
    () => sanitizeUploadFilename('shell.exe.jpeg'),
    /nguy hiểm bị chặn: .exe/
  );
});

// 2. Magic bytes verification for valid formats
runTest('Magic Bytes: Validates legitimate PNG header', () => {
  // 89 50 4E 47 0D 0A 1A 0A
  const validPng = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00]);
  verifyMagicBytes(validPng, 'image/png', '.png');
});

runTest('Magic Bytes: Validates legitimate JPEG header', () => {
  // FF D8 FF
  const validJpeg = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
  verifyMagicBytes(validJpeg, 'image/jpeg', '.jpg');
});

runTest('Magic Bytes: Validates legitimate PDF header', () => {
  const validPdf = Buffer.from('%PDF-1.7\n%abc', 'utf8');
  verifyMagicBytes(validPdf, 'application/pdf', '.pdf');
});

// 3. Executable blocking via magic bytes
runTest('Executable Blocking: Rejects Windows PE/MZ header disguised as image', () => {
  // 4D 5A = MZ
  const fakeImage = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00]);
  assert.throws(
    () => verifyMagicBytes(fakeImage, 'image/png', '.png'),
    /Tệp thực thi Windows \(MZ\/PE\) bị từ chối/
  );
});

runTest('Executable Blocking: Rejects Linux ELF header disguised as image', () => {
  // 7F 45 4C 46 = .ELF
  const fakeElf = Buffer.from([0x7F, 0x45, 0x4C, 0x46, 0x02, 0x01]);
  assert.throws(
    () => verifyMagicBytes(fakeElf, 'image/jpeg', '.jpeg'),
    /Tệp thực thi Linux \(ELF\) bị từ chối/
  );
});

runTest('HTML/Script Blocking: Rejects HTML content disguised as image or document', () => {
  const fakeDoc = Buffer.from('<!DOCTYPE html><html><script>alert(1)</script></html>', 'utf8');
  assert.throws(
    () => verifyMagicBytes(fakeDoc, 'application/pdf', '.pdf'),
    /Chữ ký tệp PDF không hợp lệ|Phát hiện nội dung HTML/
  );
});

// 4. Image dimension & Decompression Bomb defense
runTest('Image Dimension: Extracts PNG dimensions from IHDR chunk', () => {
  // Construct minimal PNG header with IHDR: 800x600 px
  const pngHeader = Buffer.alloc(32);
  pngHeader.set([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], 0);
  pngHeader.write('IHDR', 12);
  pngHeader.writeUInt32BE(800, 16); // width
  pngHeader.writeUInt32BE(600, 20); // height
  const dims = parseImageDimensions(pngHeader, 'image/png');
  assert.deepEqual(dims, { width: 800, height: 600 });
  assertSafeImageDimensions(dims);
});

runTest('Image Dimension: Rejects Decompression Bomb / Pixel Flood image', () => {
  const hugeDims = { width: 12000, height: 12000 };
  assert.throws(
    () => assertSafeImageDimensions(hugeDims),
    /vượt quá giới hạn tối đa cho phép/
  );
});

// 5. Full async pipeline validation with Web File object
await runAsyncTest('Async Pipeline: Accepts valid JPEG file', async () => {
  // Build a small valid JPEG buffer: FF D8 FF E0 00 10 4A 46 49 46 00 01
  const validJpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0xFF, 0xD9]);
  const file = new File([validJpegBuffer], 'photo.jpg', { type: 'image/jpeg' });
  const result = await validateUploadedFileSecurity(file);
  assert.equal(result.safeFilename, 'photo.jpg');
  assert.equal(result.mimeType, 'image/jpeg');
  assert.equal(result.extension, '.jpg');
});

await runAsyncTest('Async Pipeline: Rejects extension and MIME mismatch', async () => {
  const validJpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0xFF, 0xD9]);
  // Claiming to be JPEG mime but named .png
  const file = new File([validJpegBuffer], 'photo.png', { type: 'image/jpeg' });
  await assert.rejects(
    () => validateUploadedFileSecurity(file),
    /không tương thích với định dạng/
  );
});

await runAsyncTest('Async Pipeline: Rejects malicious executable disguised with JPEG mime', async () => {
  // MZ header with .exe extension
  const exeBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00]);
  const file = new File([exeBuffer], 'virus.exe', { type: 'image/jpeg' });
  await assert.rejects(
    () => validateUploadedFileSecurity(file),
    /không được phép tải lên/
  );
});

await runAsyncTest('Async Pipeline: Rejects malicious executable with forged .jpg extension', async () => {
  // MZ header named .jpg with JPEG mime
  const exeBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00]);
  const file = new File([exeBuffer], 'trojan.jpg', { type: 'image/jpeg' });
  await assert.rejects(
    () => validateUploadedFileSecurity(file),
    /Tệp thực thi Windows \(MZ\/PE\) bị từ chối/
  );
});

await runAsyncTest('Async Pipeline: Rejects file exceeding size limit', async () => {
  const hugeBuffer = Buffer.alloc(20 * 1024 * 1024); // 20 MB
  const file = new File([hugeBuffer], 'large.jpg', { type: 'image/jpeg' });
  await assert.rejects(
    () => validateUploadedFileSecurity(file, { maxFileSizeBytes: 15 * 1024 * 1024 }),
    /vượt quá giới hạn tối đa cho phép/
  );
});

await runAsyncTest('Async Pipeline: Rejects dangerous SVG with embedded script', async () => {
  const dangerousSvg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
  const file = new File([dangerousSvg], 'xss.svg', { type: 'image/svg+xml' });
  await assert.rejects(
    () => validateUploadedFileSecurity(file),
    /chứa mã lệnh hoặc nội dung không an toàn/
  );
});

await runAsyncTest('Async Pipeline: Accepts clean SVG file', async () => {
  const cleanSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red"/></svg>';
  const file = new File([cleanSvg], 'circle.svg', { type: 'image/svg+xml' });
  const result = await validateUploadedFileSecurity(file);
  assert.equal(result.safeFilename, 'circle.svg');
  assert.equal(result.mimeType, 'image/svg+xml');
});

console.log(`\n🎉 All ${passedTests}/${totalTests} tests passed successfully!`);
