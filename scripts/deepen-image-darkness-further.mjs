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
    // Increase home page darkness by 10%:
    // 1. Lower image opacity from 45% to 35%
    // 2. Deepen gradient overlay by 10% (from 70/90 to 80/95)
    const target = `<section class="hero-section">
        <div class="absolute inset-0 bg-[url('/images/hero-home.webp')] bg-cover bg-center z-0 opacity-45"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-transparent to-brand-dark/90 z-0"></div>`;

    const replacement = `<section class="hero-section">
        <div class="absolute inset-0 bg-[url('/images/hero-home.webp')] bg-cover bg-center z-0 opacity-35"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-transparent to-brand-dark/95 z-0"></div>`;

    if (content.includes(target)) {
      content = content.replace(target, replacement);
      changed = true;
      console.log('✓ Increased home page image darkness by 10%');
    }
  } else {
    // Decrease subpage opacity from 30% to 20% (making them 10% darker)
    const regex = /mix-blend-luminosity opacity-30/g;
    if (regex.test(content)) {
      content = content.replace(regex, 'mix-blend-luminosity opacity-20');
      changed = true;
      console.log(`✓ Decreased subpage opacity to 20% on ${fileName}`);
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
