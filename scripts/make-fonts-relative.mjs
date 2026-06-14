#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 1. Update public/fonts.css to use relative URLs
const fontsCssPath = join(ROOT, 'public', 'fonts.css');
let fontsCss = readFileSync(fontsCssPath, 'utf8');

if (fontsCss.includes('url(/fonts/')) {
  fontsCss = fontsCss.replace(/url\(\/fonts\//g, 'url(fonts/');
  writeFileSync(fontsCssPath, fontsCss, 'utf8');
  console.log('✓ Updated public/fonts.css to use relative font URLs');
} else {
  console.log('- public/fonts.css already uses relative paths');
}

// 2. Update all HTML files in the root to use relative preload paths
import { readdirSync } from 'fs';
import { extname } from 'path';

const htmlFiles = readdirSync(ROOT)
  .filter(f => extname(f) === '.html')
  .map(f => join(ROOT, f));

let htmlUpdatedCount = 0;
for (const filePath of htmlFiles) {
  let content = readFileSync(filePath, 'utf8');
  if (content.includes('href="/fonts/')) {
    content = content.replace(/href="\/fonts\//g, 'href="fonts/');
    writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated preloads to relative paths in ${filePath.split('/').pop()}`);
    htmlUpdatedCount++;
  }
}
if (htmlUpdatedCount > 0) {
  console.log(`✅ Updated preloads in ${htmlUpdatedCount} HTML files.`);
} else {
  console.log('- HTML files already use relative preload paths');
}

