import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { extname } from 'node:path';

const root = new URL('../src/shared/visual-editing/', import.meta.url);
const files = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isFile() && ['.ts', '.tsx'].includes(extname(entry.name)))
  .map((entry) => entry.name);

for (const file of files) {
  const source = readFileSync(new URL(file, root), 'utf8');
  assert.doesNotMatch(source, /home\.stats|about\.capacity/, `${file} contains a section-key branch`);
  assert.doesNotMatch(source, /HomeView|AboutView|static_pages[\\/]pageBuilder/, `${file} depends on a production view or PageBuilder implementation`);
}

console.log(`visual-editing boundary verified across ${files.length} shared runtime files`);
