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
    // Increase home page darkness by 15%:
    // 1. Lower image opacity from 75% to 60%
    // 2. Increase gradient overlay opacity by 15% (from 40/60 to 55/75)
    const target = `<section class="hero-section">
        <div class="absolute inset-0 bg-[url('/images/hero-home.webp')] bg-cover bg-center z-0 opacity-75"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-transparent to-brand-dark/60 z-0"></div>`;

    const replacement = `<section class="hero-section">
        <div class="absolute inset-0 bg-[url('/images/hero-home.webp')] bg-cover bg-center z-0 opacity-60"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/55 via-transparent to-brand-dark/75 z-0"></div>`;

    if (content.includes(target)) {
      content = content.replace(target, replacement);
      changed = true;
      console.log('✓ Increased home page image darkness by 15%');
    }
  } else {
    // Decrease subpage opacity from 60% to 45% (making them 15% darker)
    const regex = /mix-blend-luminosity opacity-60/g;
    if (regex.test(content)) {
      content = content.replace(regex, 'mix-blend-luminosity opacity-45');
      changed = true;
      console.log(`✓ Decreased subpage opacity to 45% on ${fileName}`);
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
