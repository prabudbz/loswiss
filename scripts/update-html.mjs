#!/usr/bin/env node
/**
 * Updates all HTML files to:
 * 1. Replace Google Fonts CDN with local /fonts.css
 * 2. Replace Unsplash CDN image URLs with local /images/*.webp
 * 3. Add font preloads for key fonts
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Map of Unsplash photo partial IDs → local WebP paths
const IMAGE_REPLACEMENTS = [
  // Order matters: more specific patterns first
  ['photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', '/images/hero-home.webp'],
  ['photo-1577412647305-991150c7d163?q=80&w=2070&auto=format&fit=crop', '/images/hero-about.webp'],
  ['photo-1622151834677-70f982c9adef?q=80&w=2070&auto=format&fit=crop', '/images/hero-services.webp'],
  ['photo-1578574577315-3fbeb0cecdc2?q=80&w=2072&auto=format&fit=crop', '/images/hero-contact.webp'],
  ['photo-1589829085413-56de8ae18c73?q=80&w=2070&auto=format&fit=crop', '/images/hero-legal.webp'],
  ['photo-1557597774-9d273605dfa9?q=80&w=2070&auto=format&fit=crop', '/images/hero-privacy.webp'],
  ['photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop', '/images/hero-accessibility.webp'],
  // Old 404 fraud image URL → new working image
  ['photo-1614064641913-6b71a2ecab2c?q=80&w=2070&auto=format&fit=crop', '/images/hero-fraud.webp'],
  ['photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop', '/images/section-index.webp'],
];

// Old Google Fonts block to replace in HTML head (all variants)
const GOOGLE_FONTS_PRECONNECT_1 = `    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700;800;900&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet">`;

// Critical font preloads for above-the-fold text (Oswald for logo, Cormorant for headings)
// We preload the key latin subset woff2 files to eliminate invisible text flash
const LOCAL_FONT_LINK = `    <link rel="stylesheet" href="/fonts.css">`;

const htmlFiles = readdirSync(ROOT)
  .filter(f => extname(f) === '.html')
  .map(f => join(ROOT, f));

let totalChanged = 0;

for (const filePath of htmlFiles) {
  let content = readFileSync(filePath, 'utf8');
  const original = content;

  // 1. Replace Google Fonts CDN block with local fonts.css
  if (content.includes('fonts.googleapis.com')) {
    // Remove preconnect lines and the font stylesheet link
    content = content
      .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\n/g, '\n')
      .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\n/g, '\n')
      .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^"]*" rel="stylesheet">\n/g, '\n');

    // Insert local fonts.css link before </head>
    if (!content.includes('/fonts.css')) {
      content = content.replace('  </head>', `    ${LOCAL_FONT_LINK}\n  </head>`);
    }
  }

  // 2. Replace Unsplash URLs with local WebP
  for (const [unsplashPartial, localPath] of IMAGE_REPLACEMENTS) {
    const fullUnsplashUrl = `https://images.unsplash.com/${unsplashPartial}`;
    // Replace in preload link
    content = content.replaceAll(fullUnsplashUrl, localPath);
  }

  // 3. Update preload to indicate WebP format
  content = content.replace(
    /<link rel="preload" as="image" href="\/images\/([^"]+\.webp)"([^>]*)>/g,
    `<link rel="preload" as="image" href="/images/$1" type="image/webp"$2>`
  );

  if (content !== original) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ Updated: ${filePath.split('/').pop()}`);
    totalChanged++;
  } else {
    console.log(`  - No change: ${filePath.split('/').pop()}`);
  }
}

console.log(`\n✅ Updated ${totalChanged} HTML files.`);
