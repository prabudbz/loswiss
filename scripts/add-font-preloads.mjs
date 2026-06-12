#!/usr/bin/env node
/**
 * Adds preload links for critical fonts to all HTML files
 * This ensures the key latin fonts load without blocking or causing CLS
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Critical font preloads (latin subsets only - the ones actually rendered on screen)
// Oswald 400 (logo "LOSWISS"), Cormorant Garamond 400 normal (headings), Montserrat 400 (body)
const FONT_PRELOADS = `    <link rel="preload" href="/fonts/font-19-TK3IWkUHHAIjg75cFRf3bXL8LICs1_Fv40pKlN4NNSeSASz7FmlWHYg.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/font-5-co3bmX5slCNuHLi8bLeY9MK7whWMhyjYpHtKgS4.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/font-14-JTUSjIg1_i6t8kCHKm459Wlhyw.woff2" as="font" type="font/woff2" crossorigin>`;

const htmlFiles = readdirSync(ROOT)
  .filter(f => extname(f) === '.html')
  .map(f => join(ROOT, f));

let totalChanged = 0;

for (const filePath of htmlFiles) {
  let content = readFileSync(filePath, 'utf8');
  const original = content;

  // Only add if not already present
  if (!content.includes('font-19-TK3IWkUHHAIjg75cFRf3bXL8LICs1_Fv40pKlN4NNSeSASz7FmlWHYg')) {
    // Insert before the fonts.css link
    content = content.replace(
      '    <link rel="stylesheet" href="/fonts.css">',
      `${FONT_PRELOADS}\n    <link rel="stylesheet" href="/fonts.css">`
    );
  }

  if (content !== original) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Added font preloads: ${filePath.split('/').pop()}`);
    totalChanged++;
  } else {
    console.log(`  - No change: ${filePath.split('/').pop()}`);
  }
}

console.log(`\n✅ Updated ${totalChanged} HTML files with font preloads.`);
