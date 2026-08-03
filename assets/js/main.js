/* ============================================================
   FIN ASTRA — MAIN JS
   main.js — Lenis init, nav scroll state, mobile menu, utils
   ============================================================ */

'use strict';

// ─── LENIS SMOOTH SCROLL ──────────────────────────────────
let lenis;

function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    lerp: 0.08,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Sync with GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

// ─── NAV SCROLL STATE ────────────────────────────────────
function initNav() {
  const nav = document.querySelector('.nav-bar');
  if (!nav) return;

  const scrollThreshold = 60;

  // If nav already has 'scrolled' class (set inline on non-hero pages), keep it
  const alreadyScrolled = nav.classList.contains('scrolled');

  function updateNav() {
    if (alreadyScrolled || window.scrollY > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Active link highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ─── MOBILE MENU ─────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (!hamburger || !mobileNav) return;

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileNav.classList.toggle('open', isOpen);
    mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen && lenis) lenis.stop();
    if (!isOpen && lenis) lenis.start();
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on mobile link click
  mobileNav.querySelectorAll('a, .nav-mobile__link').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggleMenu();
    });
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) toggleMenu();
  });
}

// ─── RESOURCES DROPDOWN ──────────────────────────────────
function initDropdowns() {
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-dropdown__trigger');
    const menu = dropdown.querySelector('.nav-dropdown__menu');
    if (!trigger || !menu) return;

    // Toggle on click (keyboard-accessible)
    trigger.addEventListener('click', () => {
      const isOpen = dropdown.classList.contains('open');
      // Close all
      document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) dropdown.classList.add('open');
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    // Keyboard: close on Escape
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Escape') dropdown.classList.remove('open');
    });
  });
}

// ─── STAT COUNTERS ───────────────────────────────────────
function initStatCounters() {
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(update);
}

// ─── SMOOTH ANCHOR SCROLL ────────────────────────────────
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -72, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ─── PRACTICE AREA ACCORDION ─────────────────────────────
function setPracticeItemState(item, open) {
  const header = item.querySelector('.practice-item__header');
  const body = item.querySelector('.practice-item__body');
  item.classList.toggle('open', open);
  if (header) header.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (body) body.setAttribute('aria-hidden', open ? 'false' : 'true');
}

function initAccordion() {
  document.querySelectorAll('.practice-item__header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.practice-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.practice-item.open').forEach(i => setPracticeItemState(i, false));

      if (!isOpen) setPracticeItemState(item, true);
    });

    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
}

// ─── TOUCH REVEAL (tap to open / close on mobile) ─────────
function isTouchUI() {
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

function closeTouchReveals(except) {
  document.querySelectorAll('.card-service.is-expanded, .card-team.is-expanded').forEach(el => {
    if (el !== except) el.classList.remove('is-expanded');
  });
}

function initTouchReveals() {
  if (!isTouchUI()) return;

  document.querySelectorAll('a.card-service, .card-service').forEach(card => {
    card.addEventListener('click', e => {
      e.stopPropagation();
      const expanded = card.classList.contains('is-expanded');
      const inReveal = e.target.closest('.card-service__reveal');

      if (!expanded) {
        e.preventDefault();
        closeTouchReveals(card);
        card.classList.add('is-expanded');
        return;
      }

      if (inReveal) return;

      e.preventDefault();
      card.classList.remove('is-expanded');
    });
  });

  document.querySelectorAll('.card-team').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('a, button')) return;
      e.stopPropagation();

      const expanded = card.classList.contains('is-expanded');
      closeTouchReveals();
      if (!expanded) card.classList.add('is-expanded');
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.card-service, .card-team')) {
      closeTouchReveals();
    }
  });
}

// ─── RESPONSIVE INLINE GRIDS ───────────────────────────────
function initResponsiveLayouts() {
  function apply() {
    const narrow = window.innerWidth <= 768;
    const formNarrow = window.innerWidth <= 640;

    document.querySelectorAll('.responsive-two-col').forEach(el => {
      const wideGap = el.dataset.gapWide || '64px';
      el.style.gridTemplateColumns = narrow ? '1fr' : '1fr 1fr';
      el.style.gap = narrow ? '32px' : wideGap;
    });

    document.querySelectorAll('.form-two-col').forEach(el => {
      el.style.gridTemplateColumns = formNarrow ? '1fr' : '1fr 1fr';
    });
  }

  window.addEventListener('resize', apply, { passive: true });
  apply();
}

// ─── RESOURCE TABS ───────────────────────────────────────
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });
}

// ─── CONTACT FORM ────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.textContent = 'Thank you. We\'ve received your message and will respond within one business day.';
        }
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'There was an issue sending your message. Please try again or contact us directly.';
      }
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ─── INIT ALL ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initNav();
  initMobileMenu();
  initDropdowns();
  initStatCounters();
  initSmoothAnchors();
  initAccordion();
  initTouchReveals();
  initResponsiveLayouts();
  initTabs();
  initContactForm();
  document.querySelectorAll('.footer-year, #footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

// --- BACK TO TOP BUTTON ------------------------------------
function initBackToTop() {
  const btn = document.createElement('a');
  btn.href = '#';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 15l7-7 7 7"/></svg>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof lenis !== 'undefined') {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBackToTop();
});
