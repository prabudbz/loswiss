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

  const target = 'id="mobile-menu-btn"';
  const replacement = 'id="mobile-menu-btn" aria-label="Toggle Navigation Menu"';

  if (content.includes(target) && !content.includes('aria-label="Toggle Navigation Menu"')) {
    content = content.replace(target, replacement);
    changed = true;
    console.log(`✓ Added aria-label to mobile menu button in ${filePath.split('/').pop()}`);
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
