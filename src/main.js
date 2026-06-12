import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Swup from 'swup'
import SwupHeadPlugin from '@swup/head-plugin'
import SwupScriptsPlugin from '@swup/scripts-plugin'
import { createIcons, icons } from 'lucide'

gsap.registerPlugin(ScrollTrigger)

// Shared Layout Components (High-end redesign)
const headerHTML = `
  <header class="fixed top-0 w-full z-50 transition-all duration-500 bg-transparent border-b border-transparent" id="main-header">
     <div class="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
       <a href="/index.html" class="flex flex-col group z-50 relative inline-flex items-center">
         <span class="text-5xl font-['Oswald'] text-white tracking-[0.02em] font-medium leading-none mb-1 group-hover:text-brand-accent transition-colors scale-y-110 origin-bottom">LOSWISS</span>
         <span class="text-[0.74rem] text-white font-serif font-bold uppercase tracking-[0.2em] opacity-95 group-hover:opacity-100 transition-opacity mt-1.5 text-center w-full">Small Finance Bank</span>
       </a>
      
      <!-- Desktop Nav & Theme Toggle -->
      <div class="hidden md:flex items-center space-x-8">
        <nav class="flex space-x-8 items-center">
          <a href="/index.html" class="nav-link text-white text-sm tracking-widest uppercase font-sans font-semibold hover:text-brand-accent transition-colors">Home</a>
          <a href="/about.html" class="nav-link text-white text-sm tracking-widest uppercase font-sans font-semibold hover:text-brand-accent transition-colors">About</a>
          <a href="/services.html" class="nav-link text-white text-sm tracking-widest uppercase font-sans font-semibold hover:text-brand-accent transition-colors">Services</a>
          <a href="/contact.html" class="nav-link text-white text-sm tracking-widest uppercase font-sans font-semibold hover:text-brand-accent transition-colors">Contact</a>
          <a href="/contact.html" class="hidden ml-4 px-6 py-2 border border-white/30 text-white text-sm tracking-widest uppercase font-sans font-semibold hover:bg-white hover:text-brand-dark transition-all duration-300">Client Login</a>
        </nav>
        
        <!-- Theme Switcher -->
        <button id="theme-toggle" class="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:text-brand-accent hover:border-brand-accent transition-colors focus:outline-none" aria-label="Toggle Theme">
          <i data-lucide="palette" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- Mobile Menu Button -->
      <button class="md:hidden text-white z-50 relative w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none" id="mobile-menu-btn">
        <span class="w-6 h-px bg-white transition-transform duration-300 origin-center" id="bar1"></span>
        <span class="w-6 h-px bg-white transition-transform duration-300 origin-center" id="bar2"></span>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div class="fixed inset-0 bg-brand-dark z-40 flex flex-col justify-center items-center" id="mobile-menu">
      <nav class="flex flex-col space-y-8 text-center w-full px-6">
        <a href="/index.html" class="mobile-nav-link text-white text-2xl font-sans font-bold tracking-widest uppercase hover:text-brand-accent transition-colors">Home</a>
        <a href="/about.html" class="mobile-nav-link text-white text-2xl font-sans font-bold tracking-widest uppercase hover:text-brand-accent transition-colors">About</a>
        <a href="/services.html" class="mobile-nav-link text-white text-2xl font-sans font-bold tracking-widest uppercase hover:text-brand-accent transition-colors">Services</a>
        <a href="/contact.html" class="mobile-nav-link text-white text-2xl font-sans font-bold tracking-widest uppercase hover:text-brand-accent transition-colors">Contact</a>
      </nav>
    </div>
  </header>
`;

const footerHTML = `
  <footer class="border-t border-white/10 bg-brand-primary text-white">
    <!-- Top Section: Brand & Tagline + Socials -->
    <div class="max-w-7xl mx-auto px-6 py-16">
      <div class="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
        <div class="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
          <a href="/index.html" class="flex flex-col group inline-flex items-center md:items-start mb-4">
            <span class="text-5xl font-['Oswald'] text-white tracking-[0.02em] font-medium leading-none mb-1 group-hover:text-brand-accent transition-colors scale-y-110 origin-bottom">LOSWISS</span>
            <span class="text-[0.76rem] text-white font-serif font-bold uppercase tracking-[0.18em] opacity-95 mt-1.5">Small Finance Bank</span>
          </a>
          <p class="text-brand-accent font-serif text-lg italic tracking-wide mt-2">Banking Beyond Boundaries</p>
        </div>
        
        <!-- Social Icons -->
        <div class="flex space-x-4">
          <a href="#" aria-label="LinkedIn" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 text-white hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="#" aria-label="X" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 text-white hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
          </a>
          <a href="#" aria-label="Facebook" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 text-white hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
          <a href="#" aria-label="Instagram" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 text-white hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" aria-label="YouTube" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 text-white hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
          </a>
        </div>
      </div>

      <!-- Bank Mission Statement -->
      <div class="border-t border-white/10 pt-8 text-center md:text-left">
        <p class="text-xs text-gray-400 font-sans font-light tracking-wider leading-relaxed">
          Empowering Individuals &bull; Supporting Businesses &bull; Driving Financial Inclusion &bull; Building a Better Tomorrow.
        </p>
      </div>
    </div>

    <!-- Bottom Section: Dual color (bg-brand-dark) -->
    <div class="bg-brand-dark py-8 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[0.7rem] text-gray-400 font-sans tracking-widest gap-4">
        <span>&copy; 2026 LOSWISS. ALL RIGHTS RESERVED.</span>
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 uppercase font-semibold">
          <a href="/legal.html" class="hover:text-brand-accent transition-colors">Legal & Regulatory</a>
          <a href="/privacy.html" class="hover:text-brand-accent transition-colors">Privacy Notice</a>
          <a href="/accessibility.html" class="hover:text-brand-accent transition-colors">Digital Accessibility</a>
          <a href="/fraud.html" class="hover:text-brand-accent transition-colors">Fraud Prevention</a>
        </div>
      </div>
    </div>
  </footer>
`;


// Initialize App — robust init that works even if DOMContentLoaded already fired
function boot() {
  // Inject Header and Footer if they don't exist
  if (!document.getElementById('main-header')) {
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
  }
  if (!document.querySelector('footer')) {
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }

  initGlobalUI();
  initPage();

  // Initialize Swup
  const swup = new Swup({
    plugins: [
      new SwupHeadPlugin({ persistAssets: true }), 
      new SwupScriptsPlugin()
    ]
  });

  // Re-run animations and icon setup on page replace
  swup.hooks.on('page:view', () => {
    initPage();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

function initGlobalUI() {
  const header = document.getElementById('main-header');
  
  // Scroll Effect for Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('bg-brand-dark/95', 'backdrop-blur-md', 'border-white/10');
      header.classList.remove('bg-transparent', 'border-transparent');
    } else {
      header.classList.add('bg-transparent', 'border-transparent');
      header.classList.remove('bg-brand-dark/95', 'backdrop-blur-md', 'border-white/10');
    }
  });
  
  // Initial check
  if (window.scrollY > 50) {
    header.classList.add('bg-brand-dark/95', 'backdrop-blur-md', 'border-white/10');
    header.classList.remove('bg-transparent', 'border-transparent');
  }

  // Theme Switcher Logic
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
  }

  // Mobile Menu Logic
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      mobileMenu.classList.add('is-open');
      bar1.style.transform = 'translateY(3.5px) rotate(45deg)';
      bar2.style.transform = 'translateY(-3.5px) rotate(-45deg)';
      
      // Animate links in
      gsap.fromTo(mobileLinks, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.2, ease: 'power3.out' }
      );
    } else {
      mobileMenu.classList.remove('is-open');
      bar1.style.transform = 'none';
      bar2.style.transform = 'none';
    }
  };

  mobileBtn.addEventListener('click', toggleMenu);
  
  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });
}

function initPage() {
  // Kill all previous ScrollTrigger instances to avoid stale animation conflicts
  ScrollTrigger.getAll().forEach(t => t.kill());

  // Initialize Lucide Icons
  createIcons({ icons });

  // Highlight active nav link (robust normalization of extensions and slashes)
  let currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
  if (!currentPath) currentPath = '/index';
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('text-brand-accent');
    let href = link.getAttribute('href').replace(/\.html$/, '').replace(/\/$/, '');
    if (!href) href = '/index';
    if (href === currentPath) {
      link.classList.add('text-brand-accent');
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.classList.remove('text-brand-accent');
    let href = link.getAttribute('href').replace(/\.html$/, '').replace(/\/$/, '');
    if (!href) href = '/index';
    if (href === currentPath) {
      link.classList.add('text-brand-accent');
    }
  });

  // Collect hero children so we can exclude them from scroll-reveals
  const heroChildren = new Set();
  const heroContent = document.querySelector('.hero-content');

  // Hero Animations — immediately lock opacity:0 then animate in
  if (heroContent) {
    const children = heroContent.children;
    for (let i = 0; i < children.length; i++) {
      heroChildren.add(children[i]);
    }
    // Immediately force hidden (prevents any flash before the tween starts)
    gsap.set(children, { opacity: 0, y: 15 });
    // Animate in
    gsap.to(children, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.05,
      overwrite: true
    });
  }

  // General Scroll Reveals — skip elements already handled by hero animation
  const revealElements = document.querySelectorAll('.reveal-text');
  revealElements.forEach(el => {
    if (heroChildren.has(el)) return; // skip hero children
    gsap.fromTo(el,
      { y: 15, opacity: 0 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
        },
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      }
    );
  });

  // Staggered Card Reveals
  const cards = document.querySelectorAll('.reveal-card');
  cards.forEach((card, index) => {
    gsap.fromTo(card,
      { y: 20, opacity: 0 },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 92%',
        },
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: (index % 3) * 0.05,
        ease: 'power3.out'
      }
    );
  });

  // Refresh ScrollTrigger after everything is set up
  ScrollTrigger.refresh();

  // Contact Form — validation + mailto
  initContactForm();
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = form.querySelectorAll('input, textarea');

  // Real-time validation on blur
  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      // Clear error as user types if it was previously invalid
      if (field.classList.contains('border-red-400')) {
        validateField(field);
      }
    });
  });

  // Strict input restriction for mobile number field (only digits and +)
  const mobileField = form.querySelector('#mobile');
  if (mobileField) {
    mobileField.addEventListener('input', (e) => {
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const originalVal = e.target.value;
      const newVal = originalVal.replace(/[^0-9+]/g, '');
      if (originalVal !== newVal) {
        e.target.value = newVal;
        const diff = originalVal.length - newVal.length;
        e.target.setSelectionRange(start - diff, end - diff);
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    fields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      // Focus the first invalid field
      const firstInvalid = form.querySelector('.border-red-400');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Gather values
    const name = form.querySelector('#name').value.trim();
    const mobile = form.querySelector('#mobile').value.trim();
    const email = form.querySelector('#email').value.trim();
    const subject = form.querySelector('#subject').value.trim();
    const message = form.querySelector('#message').value.trim();

    // Build mailto link
    const body = `Name: ${name}%0DMobile: ${mobile}%0DEmail: ${email}%0D%0D${message}`;
    const mailto = `mailto:support@loswiss.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    window.location.href = mailto;
  });
}

function validateField(field) {
  const errorEl = field.parentElement.querySelector(`[data-error="${field.name}"]`);
  let valid = field.checkValidity();

  if (!valid) {
    field.classList.remove('border-gray-200', 'focus:border-brand-accent');
    field.classList.add('border-red-400');
    if (errorEl) errorEl.classList.remove('hidden');
  } else {
    field.classList.remove('border-red-400');
    field.classList.add('border-gray-200', 'focus:border-brand-accent');
    if (errorEl) errorEl.classList.add('hidden');
  }

  return valid;
}
