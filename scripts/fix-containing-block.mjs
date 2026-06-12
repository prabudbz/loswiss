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

  const fileName = filePath.split('/').pop();

  // Find the mobile-menu div and move it out of the header
  // Structure in files:
  // <!-- Mobile Menu Overlay -->
  // <div class="..." id="mobile-menu">
  //   ...
  // </div>
  // </header>

  // We want to capture the entire mobile-menu block and place it after </header>
  const mobileMenuRegex = /(<!-- Mobile Menu Overlay -->\s*<div[^>]*id="mobile-menu"[\s\S]*?<\/div>)\s*<\/header>/;

  if (mobileMenuRegex.test(content)) {
    content = content.replace(mobileMenuRegex, '</header>\n\n  $1');
    changed = true;
    console.log(`✓ Moved mobile menu outside header in ${fileName}`);
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
