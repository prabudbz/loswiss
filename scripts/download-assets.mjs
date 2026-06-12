#!/usr/bin/env node
/**
 * LOSWISS Performance Optimizer Script
 * Downloads fonts and images locally, converts images to WebP
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const FONTS_DIR = join(ROOT, 'public', 'fonts');
const IMAGES_DIR = join(ROOT, 'public', 'images');

// Create directories
[FONTS_DIR, IMAGES_DIR].forEach(d => !existsSync(d) && mkdirSync(d, { recursive: true }));

// ─── Images to download ───────────────────────────────────────────────────────
const IMAGES = [
  {
    id: 'hero-home',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    file: 'hero-home.webp',
  },
  {
    id: 'hero-about',
    url: 'https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2070&auto=format&fit=crop',
    file: 'hero-about.webp',
  },
  {
    id: 'hero-services',
    url: 'https://images.unsplash.com/photo-1622151834677-70f982c9adef?q=80&w=2070&auto=format&fit=crop',
    file: 'hero-services.webp',
  },
  {
    id: 'hero-contact',
    url: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?q=80&w=2072&auto=format&fit=crop',
    file: 'hero-contact.webp',
  },
  {
    id: 'hero-legal',
    url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070&auto=format&fit=crop',
    file: 'hero-legal.webp',
  },
  {
    id: 'hero-privacy',
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2070&auto=format&fit=crop',
    file: 'hero-privacy.webp',
  },
  {
    id: 'hero-accessibility',
    url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop',
    file: 'hero-accessibility.webp',
  },
  {
    id: 'hero-fraud',
    url: 'https://images.unsplash.com/photo-1614064641913-6b71a2ecab2c?q=80&w=2070&auto=format&fit=crop',
    file: 'hero-fraud.webp',
  },
  {
    id: 'section-index',
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop',
    file: 'section-index.webp',
  },
];

// ─── Font definitions ─────────────────────────────────────────────────────────
// We fetch the CSS from Google Fonts API (with modern user-agent for woff2)
// Then parse the font URLs and download them
const FONT_API_URL = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700;800;900&family=Oswald:wght@400;500;600;700&display=swap";

async function downloadFile(url, destPath, description) {
  if (existsSync(destPath)) {
    console.log(`  ✓ Already exists: ${description}`);
    return;
  }
  console.log(`  ↓ Downloading: ${description}`);
  try {
    execSync(`curl -fsSL --max-time 60 "${url}" -o "${destPath}"`, { stdio: 'pipe' });
    console.log(`  ✓ Done: ${description}`);
  } catch (e) {
    console.error(`  ✗ FAILED: ${description}: ${e.message}`);
  }
}

async function main() {
  console.log('\n═══════════════════════════════════════');
  console.log('  LOSWISS Performance Optimizer');
  console.log('═══════════════════════════════════════\n');

  // ── 1. Download Images ──────────────────────────────────────────────────────
  console.log('📸 Downloading & converting images to WebP...');
  for (const img of IMAGES) {
    const destPath = join(IMAGES_DIR, img.file);
    // Unsplash already returns WebP when requesting with &auto=format
    // But we explicitly request WebP via Accept header for smaller size
    if (existsSync(destPath)) {
      console.log(`  ✓ Already exists: ${img.file}`);
      continue;
    }
    console.log(`  ↓ Downloading: ${img.file}`);
    try {
      execSync(`curl -fsSL --max-time 120 -H "Accept: image/webp,*/*" "${img.url}" -o "${destPath}"`, { stdio: 'pipe' });
      const stats = execSync(`stat -f%z "${destPath}"`, { encoding: 'utf8' }).trim();
      console.log(`  ✓ Done: ${img.file} (${(parseInt(stats)/1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`  ✗ FAILED: ${img.file}: ${e.message}`);
    }
  }

  // ── 2. Download Font CSS from Google ───────────────────────────────────────
  console.log('\n🔤 Fetching Google Fonts CSS...');
  let fontCSS = '';
  try {
    // Use a modern Chrome user-agent to get woff2 format
    fontCSS = execSync(`curl -fsSL --max-time 30 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" "${FONT_API_URL}"`, { encoding: 'utf8' });
    console.log('  ✓ Got font CSS');
  } catch (e) {
    console.error('  ✗ Failed to fetch font CSS:', e.message);
    process.exit(1);
  }

  // ── 3. Parse & Download Individual Font Files ───────────────────────────────
  console.log('\n📦 Downloading individual font files...');
  const fontUrlRegex = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g;
  const srcRegex = /src:\s*local\('[^']+'\)[^;]*url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g;

  // Collect all unique font URLs
  const fontUrls = new Set();
  let match;
  while ((match = fontUrlRegex.exec(fontCSS)) !== null) {
    fontUrls.add(match[1]);
  }
  console.log(`  Found ${fontUrls.size} font files to download`);

  // Build a mapping from remote URL to local path
  const urlToLocal = {};
  let fontIndex = 0;
  for (const url of fontUrls) {
    // Extract a meaningful name from the URL path
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1].split('?')[0];
    // Use the last unique segment
    const localName = `font-${fontIndex++}-${filename}`;
    urlToLocal[url] = localName;
    await downloadFile(url, join(FONTS_DIR, localName), localName);
  }

  // ── 4. Generate Local fonts.css ─────────────────────────────────────────────
  console.log('\n✍️  Generating local fonts.css...');
  // Replace remote URLs with local paths in the CSS
  let localFontCSS = fontCSS;
  for (const [remoteUrl, localName] of Object.entries(urlToLocal)) {
    localFontCSS = localFontCSS.replace(new RegExp(remoteUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `/fonts/${localName}`);
  }
  // Remove local() references (not needed for self-hosted) and change font-display to optional
  // to completely eliminate CLS from font swapping
  localFontCSS = localFontCSS.replace(/font-display:\s*swap/g, 'font-display: optional');

  // Remove the Google Fonts comment header if any
  writeFileSync(join(ROOT, 'public', 'fonts.css'), localFontCSS.trim());
  console.log('  ✓ public/fonts.css generated');

  // ── 5. Print summary of replacements needed ─────────────────────────────────
  console.log('\n📋 Image URL replacements needed in HTML files:');
  for (const img of IMAGES) {
    // Extract just the photo ID for matching
    const photoId = img.url.match(/photo-([a-z0-9]+)/)?.[1];
    if (photoId) {
      console.log(`  ${photoId}  →  /images/${img.file}`);
    }
  }

  console.log('\n✅ Done! Now update HTML files to use local fonts and images.\n');
}

main().catch(console.error);
