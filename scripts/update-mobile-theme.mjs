#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 1. Update src/main.js to support class .theme-toggle instead of id theme-toggle
const mainJsPath = join(ROOT, 'src', 'main.js');
let mainJs = readFileSync(mainJsPath, 'utf8');

const oldThemeLogic = `  // Theme Switcher Logic
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Check local storage (defaulting to gold)
    if (localStorage.getItem('theme') === 'blue') {
      document.documentElement.classList.add('theme-blue');
    }

    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('theme-blue');
      if (document.documentElement.classList.contains('theme-blue')) {
        localStorage.setItem('theme', 'blue');
      } else {
        localStorage.setItem('theme', 'gold');
      }
    });
  }`;

const newThemeLogic = `  // Theme Switcher Logic (Multiple buttons for desktop & mobile)
  const themeToggles = document.querySelectorAll('.theme-toggle');
  if (localStorage.getItem('theme') === 'blue') {
    document.documentElement.classList.add('theme-blue');
  }
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('theme-blue');
      if (document.documentElement.classList.contains('theme-blue')) {
        localStorage.setItem('theme', 'blue');
      } else {
        localStorage.setItem('theme', 'gold');
      }
    });
  });`;

if (mainJs.includes("document.getElementById('theme-toggle')")) {
  mainJs = mainJs.replace(oldThemeLogic, newThemeLogic);
  writeFileSync(mainJsPath, mainJs, 'utf8');
  console.log('✓ Updated src/main.js with multi-toggle class support');
} else {
  console.log('- main.js already updated or modified');
}

// 2. Process HTML files
const htmlFiles = readdirSync(ROOT)
  .filter(f => extname(f) === '.html')
  .map(f => join(ROOT, f));

for (const filePath of htmlFiles) {
  let content = readFileSync(filePath, 'utf8');
  let changed = false;

  // Change desktop theme toggle to include the theme-toggle class
  if (content.includes('id="theme-toggle"')) {
    content = content.replace(
      'id="theme-toggle" class="',
      'id="theme-toggle" class="theme-toggle '
    );
    changed = true;
  }

  // Inject Mobile Theme Switcher inside the Mobile Menu Overlay
  if (!content.includes('id="theme-toggle-mobile"')) {
    // Add mobile theme button inside mobile-menu nav
    const mobileMenuTarget = '</nav>\n    </div>';
    const mobileThemeToggleHTML = `  <button id="theme-toggle-mobile" class="theme-toggle mt-8 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:text-brand-accent hover:border-brand-accent transition-colors focus:outline-none" aria-label="Toggle Theme">
          <i data-lucide="palette" class="w-6 h-6"></i>
        </button>\n      </nav>\n    </div>`;
    
    content = content.replace(mobileMenuTarget, mobileThemeToggleHTML);
    changed = true;
  }

  // 3. For index.html: Reduce background darkness by 10%
  if (filePath.endsWith('index.html')) {
    if (content.includes('from-brand-dark/85 via-brand-dark/55 to-brand-dark/85')) {
      content = content.replace(
        'from-brand-dark/85 via-brand-dark/55 to-brand-dark/85',
        'from-brand-dark/75 via-brand-dark/45 to-brand-dark/75'
      );
      console.log('✓ Reduced background overlay darkness in index.html by 10%');
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated mobile menu & theme settings in ${filePath.split('/').pop()}`);
  }
}
