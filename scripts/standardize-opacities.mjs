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
    // Reduce darkness on home page (reduce overlay by 10% more and increase image opacity to 70%)
    if (content.includes('from-brand-dark/75 via-brand-dark/45 to-brand-dark/75')) {
      content = content.replace(
        'from-brand-dark/75 via-brand-dark/45 to-brand-dark/75',
        'from-brand-dark/65 via-brand-dark/35 to-brand-dark/65'
      );
      changed = true;
    }
    if (content.includes('opacity-60')) {
      content = content.replace('opacity-60', 'opacity-70');
      changed = true;
    }
    console.log('✓ Reduced home page image darkness');
  } else {
    // For all other pages, make the opacity level uniform (same). Let's use 30%.
    // Match any mix-blend-luminosity opacity-XX and set to opacity-30
    const regex = /mix-blend-luminosity opacity-\d+/g;
    if (regex.test(content)) {
      content = content.replace(regex, 'mix-blend-luminosity opacity-30');
      changed = true;
      console.log(`✓ Set uniform opacity-30 on ${fileName}`);
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
