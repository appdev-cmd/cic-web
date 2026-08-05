import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const cmsRoot = path.join(projectRoot, 'src', 'cms');
const sourceExtensions = new Set(['.ts', '.tsx']);
const mockFileNames = new Set(['mockData.ts', 'mockCmsData.ts']);
const forbiddenCopy = [
  'Realtime · Đồng bộ 100%',
  'API Status:',
  'Môi trường: PRODUCTION',
  'Đã tạo file báo cáo XLSX',
  'Đã khởi tạo xuất file XLSX',
];

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(entryPath);
    if (sourceExtensions.has(path.extname(entry.name))) return [entryPath];
    return [];
  }));

  return nested.flat();
}

function relative(filePath) {
  return path.relative(projectRoot, filePath).replaceAll(path.sep, '/');
}

const sourceFiles = await collectSourceFiles(cmsRoot);
const runtimeFiles = sourceFiles.filter((filePath) => !mockFileNames.has(path.basename(filePath)));
const mockImports = [];
const copyViolations = [];

for (const filePath of runtimeFiles) {
  const source = await readFile(filePath, 'utf8');
  const importPattern = /from\s+['"]([^'"]*(?:mockData|mockCmsData|demoCmsDataSource|demoEditorialContentDataSource|demoCatalogDataSource|demoPresentationDataSource))['"]/g;
  const dynamicImportPattern = /import\(\s*['"]([^'"]*(?:mockData|mockCmsData|demoCmsDataSource|demoEditorialContentDataSource|demoCatalogDataSource|demoPresentationDataSource))['"]\s*\)/g;

  for (const pattern of [importPattern, dynamicImportPattern]) {
    for (const match of source.matchAll(pattern)) {
      mockImports.push({ file: relative(filePath), importPath: match[1] });
    }
  }

  for (const text of forbiddenCopy) {
    if (source.includes(text)) copyViolations.push({ file: relative(filePath), text });
  }
}

const mockFiles = sourceFiles.filter((filePath) => mockFileNames.has(path.basename(filePath)));

console.log('CMS production readiness gate');
console.log(`- Mock fixture files: ${mockFiles.length}`);
console.log(`- Runtime mock imports: ${mockImports.length}`);
console.log(`- Forbidden production claims: ${copyViolations.length}`);

if (mockImports.length > 0) {
  console.log('\nRuntime files still coupled to mock data:');
  for (const item of mockImports.sort((a, b) => a.file.localeCompare(b.file))) {
    console.log(`- ${item.file} -> ${item.importPath}`);
  }
}

if (copyViolations.length > 0) {
  console.log('\nForbidden copy:');
  for (const item of copyViolations.sort((a, b) => a.file.localeCompare(b.file))) {
    console.log(`- ${item.file}: ${item.text}`);
  }
}

if (mockImports.length > 0 || copyViolations.length > 0) {
  console.error('\nBLOCKED: CMS chưa sẵn sàng dùng production data.');
  process.exit(1);
}

console.log('\nPASS: CMS runtime không còn mock import hoặc production claim bị cấm.');
