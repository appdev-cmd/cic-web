import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  globalIgnores([
    '.next/**',
    'dist/**',
    'build/**',
    'node_modules/**',
    // Legacy React/Vite remains the visual baseline until each module migrates.
    'src/App.tsx',
    'src/main.tsx',
    'src/web/**',
    'src/cms/**',
    'src/data/**',
    'vite.config.ts',
  ]),
]);
