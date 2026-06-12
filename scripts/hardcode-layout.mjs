#!/usr/bin/env node
/**
 * Hardcodes the Header, Footer, and Fonts CSS into all HTML files
 * to completely eliminate layout shifts from JS injection and 
 * render-blocking requests from fonts.css
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 1. Extract Header and Footer from main.js
const mainJsPath = join(ROOT, 'src', 'main.js');
let mainJs = readFileSync(mainJsPath, 'utf8');

const headerMatch = mainJs.match(/const headerHTML = `([\s\S]*?)`;/);
const footerMatch = mainJs.match(/const footerHTML = `([\s\S]*?)`;/);

if (!headerMatch || !footerMatch) {
  console.error("Could not find header or footer in main.js");
  process.exit(1);
}

const headerHTML = headerMatch[1].trim();
const footerHTML = footerMatch[1].trim();

// 2. Extract ONLY latin fonts from fonts.css and minify it
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

// 3. Process all HTML files
const htmlFiles = readdirSync(ROOT)
  .filter(f => extname(f) === '.html')
  .map(f => join(ROOT, f));

let filesUpdated = 0;

for (const filePath of htmlFiles) {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;

  // Remove existing fonts.css link
  if (content.includes('<link rel="stylesheet" href="/fonts.css">')) {
    content = content.replace(/\s*<link rel="stylesheet" href="\/fonts\.css">/g, '');
    changed = true;
  }

  // Inject inline fonts CSS
  if (!content.includes('id="inline-fonts"')) {
    content = content.replace('</head>', `  <style id="inline-fonts">${latinFontsCss}</style>\n  </head>`);
    changed = true;
  }

  // Inject Header if not present
  if (!content.includes('id="main-header"')) {
    // Put header inside body, before Swup Container or main
    content = content.replace('<body>', `<body>\n    ${headerHTML}\n`);
    changed = true;
  }

  // Inject Footer if not present
  if (!content.includes('<footer')) {
    // Put footer inside body, before script
    content = content.replace('    <script type="module" src="/src/main.js"></script>', `    ${footerHTML}\n    <script type="module" src="/src/main.js"></script>`);
    changed = true;
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
  }
}

console.log(`✅ Hardcoded header, footer, and fonts into ${filesUpdated} HTML files.`);

// 4. Clean up main.js (remove header/footer strings and injection logic)
let newMainJs = mainJs;
newMainJs = newMainJs.replace(/const headerHTML = `[\s\S]*?`;\n\n/, '');
newMainJs = newMainJs.replace(/const footerHTML = `[\s\S]*?`;\n\n/, '');
newMainJs = newMainJs.replace(/  \/\/ Inject Header and Footer if they don't exist\n  if \(\!document\.getElementById\('main-header'\)\) \{\n    document\.body\.insertAdjacentHTML\('afterbegin', headerHTML\);\n  \}\n  if \(\!document\.querySelector\('footer'\)\) \{\n    document\.body\.insertAdjacentHTML\('beforeend', footerHTML\);\n  \}\n\n/, '');

if (newMainJs !== mainJs) {
  writeFileSync(mainJsPath, newMainJs, 'utf8');
  console.log(`✅ Cleaned up src/main.js (removed dynamic injection)`);
}
