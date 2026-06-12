#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 1. Update src/main.js active link logic
const mainJsPath = join(ROOT, 'src', 'main.js');
let mainJs = readFileSync(mainJsPath, 'utf8');

const oldActiveLogic = `  // Highlight active nav link (robust normalization of extensions and slashes)
  let currentPath = window.location.pathname.replace(/\\.html$/, '').replace(/\\/$/, '');
  if (!currentPath) currentPath = '/index';
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('text-brand-accent');
    let href = link.getAttribute('href').replace(/\\.html$/, '').replace(/\\/$/, '');
    if (!href) href = '/index';
    if (href === currentPath) {
      link.classList.add('text-brand-accent');
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.classList.remove('text-brand-accent');
    let href = link.getAttribute('href').replace(/\\.html$/, '').replace(/\\/$/, '');
    if (!href) href = '/index';
    if (href === currentPath) {
      link.classList.add('text-brand-accent');
    }
  });`;

const newActiveLogic = `  // Highlight active nav link (segment-based matching for subdirectory hosting)
  let currentPath = window.location.pathname.replace(/\\.html$/, '').replace(/\\/$/, '');
  const pathSegment = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index';
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('text-brand-accent');
    let href = link.getAttribute('href') || '';
    href = href.replace(/^\//, '').replace(/\\.html$/, '').replace(/\\/$/, '');
    const hrefSegment = href.substring(href.lastIndexOf('/') + 1) || 'index';
    if (hrefSegment === pathSegment) {
      link.classList.add('text-brand-accent');
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.classList.remove('text-brand-accent');
    let href = link.getAttribute('href') || '';
    href = href.replace(/^\//, '').replace(/\\.html$/, '').replace(/\\/$/, '');
    const hrefSegment = href.substring(href.lastIndexOf('/') + 1) || 'index';
    if (hrefSegment === pathSegment) {
      link.classList.add('text-brand-accent');
    }
  });`;

if (mainJs.includes("Highlight active nav link")) {
  // Try dynamic replace if literal template match is off
  const startIdx = mainJs.indexOf('  // Highlight active nav link');
  const endIdx = mainJs.indexOf('  // Collect hero children');
  if (startIdx !== -1 && endIdx !== -1) {
    mainJs = mainJs.substring(0, startIdx) + newActiveLogic + '\n\n' + mainJs.substring(endIdx);
    writeFileSync(mainJsPath, mainJs, 'utf8');
    console.log('✓ Updated active navigation active classes matching logic in main.js');
  }
}

// 2. Add active styling feedback to src/style.css
const styleCssPath = join(ROOT, 'src', 'style.css');
let styleCss = readFileSync(styleCssPath, 'utf8');

const activeFeedbackCss = `
/* Active click feedback for mobile view */
@media (max-width: 767px) {
  .mobile-nav-link:active {
    color: var(--color-brand-accent) !important;
    opacity: 0.7;
    transition: none;
  }
  .theme-toggle:active {
    transform: scale(0.9) !important;
    background-color: var(--color-brand-accent) !important;
    color: var(--color-brand-dark) !important;
    border-color: var(--color-brand-accent) !important;
    transition: none;
  }
}
`;

if (!styleCss.includes('Active click feedback for mobile view')) {
  styleCss += activeFeedbackCss;
  writeFileSync(styleCssPath, styleCss, 'utf8');
  console.log('✓ Added mobile tap feedback CSS');
}

// 3. Update all HTML files (remove leading slashes from header / footer links)
const htmlFiles = readdirSync(ROOT)
  .filter(f => extname(f) === '.html')
  .map(f => join(ROOT, f));

for (const filePath of htmlFiles) {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;

  const fileName = filePath.split('/').pop();

  // Search and replace all href="/...html" with href="...html"
  const hrefRegex = /href="\/([^"]+\.html)"/g;
  if (hrefRegex.test(content)) {
    content = content.replace(hrefRegex, 'href="$1"');
    changed = true;
  }

  // Also replace home page references
  if (content.includes('href="/index.html"')) {
    content = content.replace(/href="\/index\.html"/g, 'href="index.html"');
    changed = true;
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Converted links to relative in ${fileName}`);
  }
}
