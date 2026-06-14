#!/usr/bin/env node
/**
 * Updates the inline fonts CSS inside all HTML files
 * with relative URLs from the updated public/fonts.css
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 1. Extract ONLY latin fonts from public/fonts.css and minify it
const fontsCssPath = join(ROOT, 'public', 'fonts.css');
const fullFontsCss = readFileSync(fontsCssPath, 'utf8');

const fontBlocks = fullFontsCss.split(/\/\*.*?\*\//).map(s => s.trim()).filter(Boolean);
const labels = fullFontsCss.match(/\/\*.*?\*\//g) || [];

let latinFontsCss = '';
for (let i = 0; i < fontBlocks.length; i++) {
  if (labels[i] && labels[i].includes('latin ') || labels[i] === '/* latin */') {
    latinFontsCss += fontBlocks[i];
  }
}

// Minify the CSS
latinFontsCss = latinFontsCss.replace(/\s+/g, ' ').replace(/:\s/g, ':').replace(/;\s/g, ';').replace(/\{\s/g, '{').replace(/\s\}/g, '}');

// 2. Process all HTML files
const htmlFiles = readdirSync(ROOT)
  .filter(f => extname(f) === '.html')
  .map(f => join(ROOT, f));

let filesUpdated = 0;

for (const filePath of htmlFiles) {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace <style id="inline-fonts">...</style>
  const styleRegex = /<style id="inline-fonts">([\s\S]*?)<\/style>/;
  
  if (styleRegex.test(content)) {
    content = content.replace(styleRegex, `<style id="inline-fonts">${latinFontsCss}</style>`);
    changed = true;
    filesUpdated++;
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}

console.log(`✅ Updated inline relative fonts CSS in ${filesUpdated} HTML files.`);
