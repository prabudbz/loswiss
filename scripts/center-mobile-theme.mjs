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

  const target = 'class="theme-toggle mt-8 w-12 h-12';
  const replacement = 'class="theme-toggle mx-auto mt-8 w-12 h-12';

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    changed = true;
    console.log(`✓ Centered mobile theme button in ${filePath.split('/').pop()}`);
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
