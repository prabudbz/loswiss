import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Swup from 'swup'
import SwupHeadPlugin from '@swup/head-plugin'
import SwupScriptsPlugin from '@swup/scripts-plugin'
import { 
  createIcons,
  ArrowUp, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Lock, 
  TrendingUp, 
  Zap, 
  Globe, 
  Award, 
  Diamond, 
  PiggyBank, 
  Briefcase, 
  Repeat, 
  User, 
  Building, 
  Factory, 
  Tractor, 
  Smartphone, 
  CreditCard, 
  Quote, 
  Check, 
  Shield, 
  HeartHandshake, 
  UserCheck, 
  Lightbulb, 
  Globe2, 
  ShieldAlert, 
  Info, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  Palette
} from 'lucide'

gsap.registerPlugin(ScrollTrigger)

// Shared Layout Components (High-end redesign)

// Initialize App — robust init that works even if DOMContentLoaded already fired
function boot() {
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

  // Theme Switcher Logic (Multiple buttons for desktop & mobile)
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
  });

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
  createIcons({
    icons: {
      Minus, 
      ArrowRight, 
      ShieldCheck, 
      Users, 
      Lock, 
      TrendingUp, 
      Zap, 
      Globe, 
      Award, 
      Diamond, 
      PiggyBank, 
      Briefcase, 
      Repeat, 
      User, 
      Building, 
      Factory, 
      Tractor, 
      Smartphone, 
      CreditCard, 
      Quote, 
      Check, 
      Shield, 
      HeartHandshake, 
      UserCheck, 
      Lightbulb, 
      Globe2, 
      ShieldAlert, 
      Info, 
      PhoneCall, 
      Mail, 
      MapPin, 
      Clock, 
      Send, 
      Palette
    }
  });

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
