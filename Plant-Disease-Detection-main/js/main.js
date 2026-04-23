/* ══════════════════════════════════════════════
   PlantCure AI — Main JS (Shared Across Pages)
   Handles: Theme, Language, Navbar, Animations
══════════════════════════════════════════════ */

/* ─── Translations ─── */
const TRANSLATIONS = {
  en: {
    nav_home: 'Home',
    nav_detect: 'AI Detector',
    nav_treatment: 'Treatment',
    nav_shop: 'Shop',
    nav_community: 'Community',
    nav_detect_cta: '🔬 Detect Disease',
    footer_copy: '© 2025 PlantCure AI. Made with ❤️ for farmers & gardeners.',
    upload_title: 'Upload Plant Image',
    upload_sub: 'Drag & drop or click to browse',
    upload_hint: 'Supports JPG, PNG, WEBP · Max 10MB',
    btn_detect: '🔬 Analyze Plant',
    btn_try_again: '↺ Try Another Image',
    result_healthy: '✅ Plant is Healthy!',
    result_diseased: '⚠️ Disease Detected',
    msg_healthy: 'Your plant looks healthy! Maintain proper care, adequate sunlight, and regular watering.',
    msg_diseased: 'Possible disease detected. Consider removing affected leaves and avoiding overwatering.',
    confidence: 'Confidence',
    history_title: 'Recent Scans',
    tips_title: '🌿 Care Tips',
    lang_en: 'English',
    lang_hi: 'हिंदी',
  },
  hi: {
    nav_home: 'होम',
    nav_detect: 'AI पहचान',
    nav_treatment: 'उपचार',
    nav_shop: 'दुकान',
    nav_community: 'समुदाय',
    nav_detect_cta: '🔬 रोग पहचानें',
    footer_copy: '© 2025 PlantCure AI. किसानों और बागवानों के लिए ❤️ के साथ बनाया गया।',
    upload_title: 'पौधे की छवि अपलोड करें',
    upload_sub: 'खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें',
    upload_hint: 'JPG, PNG, WEBP समर्थित · अधिकतम 10MB',
    btn_detect: '🔬 पौधा विश्लेषण करें',
    btn_try_again: '↺ दूसरी छवि आज़माएं',
    result_healthy: '✅ पौधा स्वस्थ है!',
    result_diseased: '⚠️ रोग पाया गया',
    msg_healthy: 'आपका पौधा स्वस्थ दिखता है! उचित देखभाल, पर्याप्त धूप और नियमित पानी देते रहें।',
    msg_diseased: 'संभावित रोग पाया गया। प्रभावित पत्तियों को हटाएं और अधिक पानी देने से बचें।',
    confidence: 'विश्वसनीयता',
    history_title: 'हाल की जाँच',
    tips_title: '🌿 देखभाल के सुझाव',
    lang_en: 'English',
    lang_hi: 'हिंदी',
  }
};

/* Current language — always default English unless user explicitly switched */
/* Clear any stale language setting from old sessions */
if (!sessionStorage.getItem('lang_initialized')) {
  localStorage.removeItem('plantcure_lang');
  sessionStorage.setItem('lang_initialized', '1');
}
let currentLang = localStorage.getItem('plantcure_lang') || 'en';

/* ─── Apply Translations ─── */
function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem('plantcure_lang', lang);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Apply to all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Update lang button
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) {
    langBtn.innerHTML = lang === 'en'
      ? '🌐 <span>हिंदी</span>'
      : '🌐 <span>English</span>';
  }

  // Update html lang attribute
  document.documentElement.lang = lang;
}

/* ─── Dark / Light Theme ─── */
function initTheme() {
  const saved = localStorage.getItem('plantcure_theme') || 'dark';
  setTheme(saved);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('plantcure_theme', theme);

  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

/* ─── Navbar Scroll Effect ─── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ─── Mobile Menu ─── */
function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.classList.toggle('active', isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });
}

/* ─── Scroll Reveal Animation ─── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─── Animated Counter ─── */
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const startVal = 0;

  function update(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || el.getAttribute('data-count') || 0);
        const suffix = el.getAttribute('data-suffix') || '';
        if (target > 0) animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target],[data-count]').forEach(el => observer.observe(el));
}

/* ─── Page Loader ─── */
function hidePageLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
}

/* ─── Toast Notifications ─── */
function showToast(message, type = 'success', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || '📢'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeIn .3s ease reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ─── Smooth Scroll for anchor links ─── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ─── Active Nav Link ─── */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === path);
  });
}

/* ─── Floating Particles (hero) ─── */
function createParticles(containerId, count = 12) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 60 + 20;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * -15}s;
      opacity: ${Math.random() * 0.12 + 0.03};
    `;
    container.appendChild(p);
  }
}

/* ─── Typewriter Effect ─── */
function typeWriter(el, text, speed = 60) {
  if (!el) return;
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i++];
    } else {
      clearInterval(timer);
    }
  }, speed);
}

/* ─── Language Switcher Click ─── */
function initLangSwitcher() {
  const btn = document.getElementById('lang-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = currentLang === 'en' ? 'hi' : 'en';
    applyTranslations(next);
    showToast(
      next === 'en' ? 'Switched to English' : 'हिंदी में बदल दिया गया',
      'info', 2500
    );
  });
}

/* ─── Theme Button Click ─── */
function initThemeBtn() {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  btn.addEventListener('click', toggleTheme);
}

/* ─── Search Functionality ─── */
function initSearch(inputId, cardsSelector, nameSelector) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    document.querySelectorAll(cardsSelector).forEach(card => {
      const name = card.querySelector(nameSelector)?.textContent.toLowerCase() || '';
      card.style.display = name.includes(query) ? '' : 'none';
    });
  });
}

/* ─── Initialize Everything ─── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  applyTranslations(currentLang);
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  setActiveNav();
  initLangSwitcher();
  initThemeBtn();
  createParticles('particles');
  hidePageLoader();

  // Hamburger animation
  const hamburger = document.getElementById('nav-hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.querySelectorAll('span').forEach((s, i) => {
        // Visual feedback only — CSS handles the actual menu
      });
    });
  }
});

// Export for use in other modules
window.PlantCure = {
  showToast,
  TRANSLATIONS,
  currentLang: () => currentLang,
  t: (key) => (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || key,
};
