#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 1. Update src/style.css
const styleCssPath = join(ROOT, 'src', 'style.css');
let styleCss = readFileSync(styleCssPath, 'utf8');

// Update .hero-content mobile padding-top to pt-36
if (styleCss.includes('pt-28 pb-12')) {
  styleCss = styleCss.replace('pt-28 pb-12', 'pt-36 pb-12');
  console.log('✓ Style.css: Updated .hero-content mobile padding to pt-36');
}

// Add CSS rule to hide subtext in scrolled header
const hideSubtextRule = `
/* Hide header subtext on scroll to save space and prevent overlap */
#main-header.scrolled a.group span.text-\\[0\\.74rem\\] {
  display: none !important;
}
#main-header.scrolled a.group span.text-\\[0\\.76rem\\] {
  display: none !important;
}
`;

if (!styleCss.includes('Hide header subtext on scroll')) {
  styleCss += hideSubtextRule;
  writeFileSync(styleCssPath, styleCss, 'utf8');
  console.log('✓ Style.css: Added scrolled header subtext hiding rules');
}

// 2. Update contact.html card paddings
const contactHtmlPath = join(ROOT, 'contact.html');
let contactHtml = readFileSync(contactHtmlPath, 'utf8');

if (contactHtml.includes('bg-white p-10 border')) {
  contactHtml = contactHtml.replace(/bg-white p-10 border/g, 'bg-white p-6 md:p-10 border');
  console.log('✓ Contact.html: Converted card paddings to p-6 md:p-10');
}
if (contactHtml.includes('bg-white p-12 border')) {
  contactHtml = contactHtml.replace('bg-white p-12 border', 'bg-white p-6 md:p-12 border');
  console.log('✓ Contact.html: Converted form padding to p-6 md:p-12');
}
writeFileSync(contactHtmlPath, contactHtml, 'utf8');

// 3. Update HTML files for scrolled header subtext class mapping
// Note: Some files use text-[0.74rem] and some use text-[0.76rem] for the Small Finance Bank subtitle.
// We target both in our CSS rules above, so they will automatically hide on scroll.
