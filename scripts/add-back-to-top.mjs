#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 1. Update src/main.js
const mainJsPath = join(ROOT, 'src', 'main.js');
let mainJs = readFileSync(mainJsPath, 'utf8');

// Add ArrowUp import
if (!mainJs.includes('ArrowUp,')) {
  mainJs = mainJs.replace('createIcons,', 'createIcons,\n  ArrowUp,');
}

// Add ArrowUp to createIcons call
if (!mainJs.includes('ArrowUp\n') && !mainJs.includes('ArrowUp,')) {
  mainJs = mainJs.replace('Palette\n', 'Palette,\n      ArrowUp\n');
} else if (mainJs.includes('Palette')) {
  // If Palette is there, replace it
  mainJs = mainJs.replace('Palette', 'Palette, ArrowUp');
}

// Add Back to Top logic in initGlobalUI()
const oldInitGlobalUIEnd = `  if (window.scrollY > 50) {
    header.classList.add('bg-brand-dark/95', 'backdrop-blur-md', 'border-white/10');
    header.classList.remove('bg-transparent', 'border-transparent');
  }
}`;

const newInitGlobalUIEnd = `  if (window.scrollY > 50) {
    header.classList.add('bg-brand-dark/95', 'backdrop-blur-md', 'border-white/10');
    header.classList.remove('bg-transparent', 'border-transparent');
  }

  // Back to Top Logic
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
        backToTop.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
      } else {
        backToTop.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
        backToTop.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}`;

if (mainJs.includes(oldInitGlobalUIEnd)) {
  mainJs = mainJs.replace(oldInitGlobalUIEnd, newInitGlobalUIEnd);
} else {
  // Fallback pattern match
  const searchPattern = `  // Theme Switcher Logic (Multiple buttons for desktop & mobile)`;
  mainJs = mainJs.replace(searchPattern, `  // Back to Top Logic
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
        backToTop.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
      } else {
        backToTop.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
        backToTop.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Theme Switcher Logic (Multiple buttons for desktop & mobile)`);
}

writeFileSync(mainJsPath, mainJs, 'utf8');
console.log('✓ Updated src/main.js with Back to Top imports and event handlers');

// 2. Update HTML files
const htmlFiles = readdirSync(ROOT)
  .filter(f => extname(f) === '.html')
  .map(f => join(ROOT, f));

const backToTopHTML = `
  <!-- Back to Top Button -->
  <button id="back-to-top" class="fixed bottom-6 right-6 z-40 translate-y-10 opacity-0 pointer-events-none w-12 h-12 rounded-full bg-brand-primary border border-brand-accent/30 text-brand-accent hover:bg-brand-accent hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg group focus:outline-none" aria-label="Back to Top">
    <i data-lucide="arrow-up" class="w-5 h-5 transition-transform group-hover:-translate-y-1"></i>
    <!-- Tooltip -->
    <span class="absolute right-14 bg-brand-primary border border-brand-accent/20 text-white text-xs px-3 py-1.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none font-sans font-medium tracking-wide">Back to Top</span>
  </button>
`;

for (const filePath of htmlFiles) {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;

  const fileName = filePath.split('/').pop();

  if (!content.includes('id="back-to-top"')) {
    // Inject right before </body>
    content = content.replace('</body>', `${backToTopHTML}\n  </body>`);
    changed = true;
    console.log(`✓ Injected Back to Top button into ${fileName}`);
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
  }
}
