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

  if (fileName === 'index.html') {
    // Reduce overlay darkness further by 10% (from 65/35/65 to 55/25/55)
    if (content.includes('from-brand-dark/65 via-brand-dark/35 to-brand-dark/65')) {
      content = content.replace(
        'from-brand-dark/65 via-brand-dark/35 to-brand-dark/65',
        'from-brand-dark/55 via-brand-dark/25 to-brand-dark/55'
      );
      changed = true;
    }
    // Increase image opacity to 80% to make it even more visible
    if (content.includes('opacity-70')) {
      content = content.replace('opacity-70', 'opacity-80');
      changed = true;
    }
    console.log('✓ Further reduced home page image darkness');
  } else {
    // Increase the opacity of other pages from 30% to 45% to make them more visible
    const regex = /mix-blend-luminosity opacity-30/g;
    if (regex.test(content)) {
      content = content.replace(regex, 'mix-blend-luminosity opacity-45');
      changed = true;
      console.log(`✓ Set visibility to opacity-45 on ${fileName}`);
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
