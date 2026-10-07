/**
 * Centralized File Security & Upload Hardening
 *
 * Implements:
 * 1. Extension validation & MIME consistency matching
 * 2. Magic byte / File signature verification
 * 3. Executable / Script / HTML blacklisting (including double-extension defense)
 * 4. Image dimension limits (Decompression bomb / Pixel flood defense)
 * 5. Filename sanitization & path traversal prevention
 */

import { assertSafeSvgFile } from './svg-security';

// Allowed MIME types and their strictly corresponding valid extensions
export const ALLOWED_MIME_EXTENSIONS_MAP: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
  'image/gif': ['.gif'],
  'image/svg+xml': ['.svg'],
  'image/x-icon': ['.ico'],
  'image/vnd.microsoft.icon': ['.ico'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
};

// Editor-only restricted MIME types (images only)
export const EDITOR_ALLOWED_MIME_SET = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
]);

// Media library allowed MIME set
export const MEDIA_ALLOWED_MIME_SET = new Set(Object.keys(ALLOWED_MIME_EXTENSIONS_MAP));

// Blacklisted dangerous extensions (never allowed anywhere in filename)
export const DANGEROUS_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'bash', 'bin', 'dll', 'so', 'dylib',
  'php', 'phtml', 'php3', 'php4', 'php5', 'phps', 'pht',
  'asp', 'aspx', 'jsp', 'jspx', 'cgi', 'pl', 'py', 'rb',
  'html', 'htm', 'xhtml', 'shtml', 'hta', 'svgz',
  'js', 'mjs', 'cjs', 'ts', 'vbs', 'ps1', 'psm1', 'wsf', 'jar',
  'scr', 'reg', 'msi', 'com', 'app', 'vbe', 'jse', 'wsh'
]);

export const MAX_IMAGE_DIMENSION_PX = 8192; // 8192px width or height
export const MAX_IMAGE_PIXELS = 64_000_000; // 64 megapixels
export const EDITOR_MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB for editor images

export interface FileSecurityValidationOptions {
  allowedMimes?: Set<string>;
  maxFileSizeBytes?: number;
  checkDimensions?: boolean;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ValidatedFileResult {
  safeFilename: string;
  mimeType: string;
  extension: string;
  dimensions?: ImageDimensions | null;
}

/**
 * Extracts and sanitizes filename.
 * Prevents double-extension attacks, removes directory traversal, and enforces clean extensions.
 */
export function sanitizeUploadFilename(rawName: string): { base: string; ext: string; fullName: string } {
  const normalized = rawName
    .normalize('NFKD')
    .replace(/\\/g, '/')
    .split('/')
    .pop() || 'upload-file';

  // Split into segments by dot
  const parts = normalized.split('.').filter(Boolean);
  if (parts.length === 0) {
    return { base: 'media-file', ext: '.bin', fullName: 'media-file.bin' };
  }

  const ext = parts.length > 1 ? `.${parts[parts.length - 1].toLowerCase()}` : '';
  const cleanExt = ext.replace(/[^a-z0-9]/g, '');

  // Check all intermediate extension segments for dangerous types (e.g. exploit.php.png)
  for (let i = 0; i < parts.length - 1; i++) {
    const partExt = parts[i].toLowerCase();
    if (DANGEROUS_EXTENSIONS.has(partExt)) {
      throw new Error(`Tên tệp chứa phần mở rộng nguy hiểm bị chặn: .${partExt}`);
    }
  }

  // Base name without extension
  const rawBase = parts.length > 1 ? parts.slice(0, -1).join('-') : parts[0];
  const safeBase = rawBase
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100) || 'media-file';

  const fullExt = cleanExt ? `.${cleanExt}` : '';
  return {
    base: safeBase,
    ext: fullExt,
    fullName: `${safeBase}${fullExt}`,
  };
}

/**
 * Inspects Magic Bytes / Binary Signatures of the uploaded buffer.
 */
export function verifyMagicBytes(buffer: Buffer, declaredMime: string, extension: string): void {
  if (buffer.length < 4) {
    throw new Error('Dữ liệu tệp không hợp lệ (dung lượng quá nhỏ).');
  }

  // Check for dangerous binary headers regardless of claimed MIME
  // 1. DOS / Windows PE Executable (MZ header)
  if (buffer[0] === 0x4D && buffer[1] === 0x5A) {
    throw new Error('Tệp thực thi Windows (MZ/PE) bị từ chối.');
  }
  // 2. Linux ELF Executable
  if (buffer[0] === 0x7F && buffer[1] === 0x45 && buffer[2] === 0x4C && buffer[3] === 0x46) {
    throw new Error('Tệp thực thi Linux (ELF) bị từ chối.');
  }
  // 3. Shell script shebang (#! / 0x23 0x21)
  if (buffer[0] === 0x23 && buffer[1] === 0x21) {
    throw new Error('Tệp mã lệnh script (Shebang) bị từ chối.');
  }

  // Format-specific signature verification
  switch (declaredMime) {
    case 'image/jpeg': {
      // JPEG must start with FF D8 FF
      if (buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
        throw new Error('Chữ ký tệp JPEG không hợp lệ.');
      }
      break;
    }
    case 'image/png': {
      // PNG must start with 89 50 4E 47 0D 0A 1A 0A
      const pngHeader = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
      for (let i = 0; i < pngHeader.length; i++) {
        if (buffer[i] !== pngHeader[i]) {
          throw new Error('Chữ ký tệp PNG không hợp lệ.');
        }
      }
      break;
    }
    case 'image/gif': {
      // GIF must start with GIF87a or GIF89a
      const head = buffer.subarray(0, 6).toString('ascii');
      if (head !== 'GIF87a' && head !== 'GIF89a') {
        throw new Error('Chữ ký tệp GIF không hợp lệ.');
      }
      break;
    }
    case 'image/webp': {
      // WebP must start with RIFF....WEBP
      const riff = buffer.subarray(0, 4).toString('ascii');
      const webp = buffer.subarray(8, 12).toString('ascii');
      if (riff !== 'RIFF' || webp !== 'WEBP') {
        throw new Error('Chữ ký tệp WebP không hợp lệ.');
      }
      break;
    }
    case 'application/pdf': {
      // PDF must start with %PDF- (0x25 0x50 0x44 0x46 0x2D)
      const pdfHeader = buffer.subarray(0, 5).toString('ascii');
      if (!pdfHeader.startsWith('%PDF')) {
        throw new Error('Chữ ký tệp PDF không hợp lệ.');
      }
      break;
    }
    case 'image/x-icon':
    case 'image/vnd.microsoft.icon': {
      // ICO header: 00 00 01 00
      if (buffer[0] !== 0x00 || buffer[1] !== 0x00 || buffer[2] !== 0x01 || buffer[3] !== 0x00) {
        throw new Error('Chữ ký tệp ICO không hợp lệ.');
      }
      break;
    }
    case 'video/mp4': {
      // MP4 has ftyp box at offset 4..8
      if (buffer.length >= 8) {
        const ftyp = buffer.subarray(4, 8).toString('ascii');
        if (ftyp !== 'ftyp') {
          throw new Error('Chữ ký tệp MP4 không hợp lệ.');
        }
      }
      break;
    }
    case 'video/webm': {
      // WebM starts with EBML ID: 1A 45 DF A3
      if (buffer[0] !== 0x1A || buffer[1] !== 0x45 || buffer[2] !== 0xDF || buffer[3] !== 0xA3) {
        throw new Error('Chữ ký tệp WebM không hợp lệ.');
      }
      break;
    }
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      // DOCX & XLSX are ZIP archives starting with 50 4B 03 04 (PK..)
      if (buffer[0] !== 0x50 || buffer[1] !== 0x4B || buffer[2] !== 0x03 || buffer[3] !== 0x04) {
        throw new Error('Chữ ký tệp tài liệu Office không hợp lệ.');
      }
      break;
    }
    case 'application/msword':
    case 'application/vnd.ms-excel': {
      // Legacy OLE2 CFB files start with D0 CF 11 E0 A1 B1 1A E1
      if (buffer[0] !== 0xD0 || buffer[1] !== 0xCF || buffer[2] !== 0x11 || buffer[3] !== 0xE0) {
        throw new Error('Chữ ký tệp tài liệu Office không hợp lệ.');
      }
      break;
    }
    case 'image/svg+xml': {
      // SVG handled separately via assertSafeSvgFile
      break;
    }
  }

  // Detect HTML or Script injection disguised as other formats
  if (declaredMime !== 'image/svg+xml') {
    const textSample = buffer.subarray(0, 1024).toString('utf8').toLowerCase();
    if (
      textSample.includes('<!doctype html') ||
      textSample.includes('<html') ||
      textSample.includes('<script') ||
      textSample.includes('<body')
    ) {
      throw new Error('Phát hiện nội dung HTML/Script trong tệp tải lên.');
    }
  }
}

/**
 * Extracts width and height from image buffer headers without full decompression.
 * Protects against Pixel Flood and Decompression Bomb attacks.
 */
export function parseImageDimensions(buffer: Buffer, mime: string): ImageDimensions | null {
  try {
    if (mime === 'image/png') {
      // PNG IHDR chunk is located at offset 12..24. Width at 16..20, Height at 20..24
      if (buffer.length >= 24) {
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        return { width, height };
      }
    } else if (mime === 'image/gif') {
      // GIF width at 6..8, height at 8..10 (Little Endian)
      if (buffer.length >= 10) {
        const width = buffer.readUInt16LE(6);
        const height = buffer.readUInt16LE(8);
        return { width, height };
      }
    } else if (mime === 'image/jpeg') {
      // Scan JPEG markers for SOF0 (0xFFC0) or SOF2 (0xFFC2)
      let offset = 2;
      while (offset < buffer.length - 8) {
        if (buffer[offset] !== 0xFF) {
          offset++;
          continue;
        }
        const marker = buffer[offset + 1];
        if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2) {
          // SOF marker found: height at offset + 5, width at offset + 7
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        // Move to next marker
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    } else if (mime === 'image/webp') {
      // WebP dimensions
      if (buffer.length >= 30) {
        const chunkType = buffer.subarray(12, 16).toString('ascii');
        if (chunkType === 'VP8 ') {
          // Simple lossy VP8
          const width = buffer.readUInt16LE(26) & 0x3FFF;
          const height = buffer.readUInt16LE(28) & 0x3FFF;
          return { width, height };
        } else if (chunkType === 'VP8L') {
          // Lossless VP8L
          const b1 = buffer[21];
          const b2 = buffer[22];
          const b3 = buffer[23];
          const b4 = buffer[24];
          const width = 1 + (((b2 & 0x3F) << 8) | b1);
          const height = 1 + (((b4 & 0xF) << 10) | (b3 << 2) | ((b2 & 0xC0) >> 6));
          return { width, height };
        } else if (chunkType === 'VP8X') {
          // Extended VP8X
          const width = 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16));
          const height = 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16));
          return { width, height };
        }
      }
    }
  } catch {
    // If parsing fails gracefully, return null and let validation proceed
    return null;
  }
  return null;
}

/**
 * Validates image dimensions against limits to prevent decompression bombs.
 */
export function assertSafeImageDimensions(dimensions: ImageDimensions | null): void {
  if (!dimensions) return;
  const { width, height } = dimensions;

  if (width <= 0 || height <= 0) {
    throw new Error('Kích thước ảnh không hợp lệ (chiều rộng hoặc chiều cao bằng 0).');
  }

  if (width > MAX_IMAGE_DIMENSION_PX || height > MAX_IMAGE_DIMENSION_PX) {
    throw new Error(
      `Kích thước ảnh vượt quá giới hạn tối đa cho phép (${MAX_IMAGE_DIMENSION_PX}x${MAX_IMAGE_DIMENSION_PX} px). Kích thước tệp: ${width}x${height} px.`
    );
  }

  const totalPixels = width * height;
  if (totalPixels > MAX_IMAGE_PIXELS) {
    throw new Error(
      `Tổng số điểm ảnh (pixels) vượt quá ngưỡng an toàn (${Math.round(MAX_IMAGE_PIXELS / 1_000_000)} MP).`
    );
  }
}

/**
 * Complete verification pipeline for an uploaded file.
 */
export async function validateUploadedFileSecurity(
  file: File,
  options: FileSecurityValidationOptions = {}
): Promise<ValidatedFileResult> {
  const allowedMimes = options.allowedMimes || MEDIA_ALLOWED_MIME_SET;
  const maxBytes = options.maxFileSizeBytes || 100 * 1024 * 1024;

  // 1. File size check
  if (file.size <= 0) {
    throw new Error('Tệp tải lên rỗng (0 bytes).');
  }
  if (file.size > maxBytes) {
    const maxMb = Math.round(maxBytes / (1024 * 1024));
    throw new Error(`Dung lượng tệp vượt quá giới hạn tối đa cho phép (${maxMb} MB).`);
  }

  // 2. Sanitize filename and extract extension
  const { base, ext, fullName } = sanitizeUploadFilename(file.name);
  if (!ext) {
    throw new Error('Tệp tải lên thiếu phần mở rộng (extension).');
  }

  const cleanExt = ext.toLowerCase();
  if (DANGEROUS_EXTENSIONS.has(cleanExt.slice(1))) {
    throw new Error(`Định dạng phần mở rộng ${cleanExt} không được phép tải lên hệ thống.`);
  }

  // 3. Resolve and validate MIME type
  let resolvedMime = file.type;
  if (cleanExt === '.ico' && (!resolvedMime || resolvedMime === 'application/octet-stream')) {
    resolvedMime = 'image/x-icon';
  }

  if (!allowedMimes.has(resolvedMime)) {
    throw new Error(`Định dạng tệp MIME (${resolvedMime || 'không xác định'}) không được hỗ trợ.`);
  }

  // 4. Validate extension matches the declared MIME
  const validExtensions = ALLOWED_MIME_EXTENSIONS_MAP[resolvedMime] || [];
  if (!validExtensions.includes(cleanExt)) {
    throw new Error(
      `Phần mở rộng '${cleanExt}' không tương thích với định dạng tệp '${resolvedMime}'. Chấp nhận: ${validExtensions.join(', ')}`
    );
  }

  // 5. Read arrayBuffer for magic bytes and deep inspection
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 6. SVG specific deep inspection
  if (resolvedMime === 'image/svg+xml' || cleanExt === '.svg') {
    await assertSafeSvgFile(file);
  } else {
    // 7. Magic bytes verification for binary formats
    verifyMagicBytes(buffer, resolvedMime, cleanExt);
  }

  // 8. Image dimension inspection & Decompression bomb protection
  let dimensions: ImageDimensions | null = null;
  if (options.checkDimensions !== false && resolvedMime.startsWith('image/') && resolvedMime !== 'image/svg+xml') {
    dimensions = parseImageDimensions(buffer, resolvedMime);
    assertSafeImageDimensions(dimensions);
  }

  return {
    safeFilename: fullName,
    mimeType: resolvedMime,
    extension: cleanExt,
    dimensions,
  };
}
