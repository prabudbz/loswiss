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
    // Replace the home page hero section layers to:
    // 1. Image first, normal blend mode, opacity 75%
    // 2. Gradient overlay on top, softer opacity (40% to 60%)
    const target = `<section class="hero-section">
        <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/55 via-brand-dark/25 to-brand-dark/55 z-0"></div>
        <div class="absolute inset-0 bg-[url('/images/hero-home.webp')] bg-cover bg-center mix-blend-overlay z-0 opacity-80"></div>`;

    const replacement = `<section class="hero-section">
        <div class="absolute inset-0 bg-[url('/images/hero-home.webp')] bg-cover bg-center z-0 opacity-75"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-transparent to-brand-dark/60 z-0"></div>`;

    if (content.includes(target)) {
      content = content.replace(target, replacement);
      changed = true;
      console.log('✓ Re-ordered and brightened home page hero layers');
    }
  } else {
    // Increase visibility on other pages to opacity-60
    const regex = /mix-blend-luminosity opacity-45/g;
    if (regex.test(content)) {
      content = content.replace(regex, 'mix-blend-luminosity opacity-60');
      changed = true;
      console.log(`✓ Boosted subpage opacity to 60% on ${fileName}`);
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
