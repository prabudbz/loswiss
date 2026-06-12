#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const htmlFiles = readdirSync(ROOT)
  .filter(f => extname(f) === '.html')
  .map(f => join(ROOT, f));

for (const filePath of htmlFiles) {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;

  const oldPreload = '/fonts/font-5-co3bmX5slCNuHLi8bLeY9MK7whWMhyjYpHtKgS4.woff2';
  const newPreload = '/fonts/font-9-co3bmX5slCNuHLi8bLeY9MK7whWMhyjYqXtK.woff2';

  if (content.includes(oldPreload)) {
    content = content.replace(oldPreload, newPreload);
    changed = true;
    console.log(`✓ Updated font preload in ${filePath.split('/').pop()}`);
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
