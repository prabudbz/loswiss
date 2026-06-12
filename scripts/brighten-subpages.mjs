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

  // ONLY for pages other than index.html
  if (fileName !== 'index.html') {
    // Increase subpage image visibility from opacity-20 to opacity-30 (making them 10% more visible / less dark)
    const regex = /mix-blend-luminosity opacity-20/g;
    if (regex.test(content)) {
      content = content.replace(regex, 'mix-blend-luminosity opacity-30');
      changed = true;
      console.log(`✓ Boosted subpage opacity to 30% on ${fileName}`);
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
