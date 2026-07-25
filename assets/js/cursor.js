/* ============================================================
   FIN ASTRA — CURSOR & MAGNETIC BUTTONS
   cursor.js — custom cursor, magnetic pull, radial fill
   ============================================================ */

'use strict';

(function () {
  // Skip on touch/reduced-motion devices
  const isTouch = window.matchMedia('(hover: none)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReduced) return;

  // ─── CUSTOM CURSOR SETUP ──────────────────────────────────
  const cursor = document.querySelector('.custom-cursor');
  const cursorLabel = cursor ? cursor.querySelector('.cursor-label') : null;
  if (!cursor) return;

  // Signal that the custom cursor is active. CSS only hides the native cursor
  // when this class is present, so if this script ever fails the normal
  // pointer stays visible (prevents the "cursor disappears" bug).
  document.documentElement.classList.add('has-custom-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  const LERP = 0.12;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));

  // Animate cursor with lerp
  function animateCursor() {
    cursorX += (mouseX - cursorX) * LERP;
    cursorY += (mouseY - cursorY) * LERP;

    if (typeof gsap !== 'undefined') {
      gsap.set(cursor, { x: cursorX, y: cursorY });
    } else {
      cursor.style.transform = `translate(calc(-50% + ${cursorX}px), calc(-50% + ${cursorY}px))`;
      cursor.style.left = '0';
      cursor.style.top = '0';
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ─── CURSOR LABEL MAPPING ────────────────────────────────
  const labelMap = {
    'a': 'VIEW',
    'button': 'OPEN',
    '.btn-terracotta': 'OPEN',
    '.btn-outline': 'OPEN',
    '.btn-whatsapp': 'CALL',
    '.card-resource': 'READ',
    '.card-service': 'VIEW',
    '.footer__link': 'VIEW',
    '.nav-link': 'VIEW',
    '.nav-dropdown__item': 'VIEW',
    '.card-team': 'VIEW',
    '.useful-link-item': 'OPEN',
    '.practice-item__header': 'OPEN',
    '.tab-btn': 'OPEN',
    '.footer__social': 'VIEW',
  };

  // Track whether cursor is over a magnetic button
  let overMagneticBtn = false;

  function getLabel(el) {
    // Check specific classes first
    for (const [selector, label] of Object.entries(labelMap)) {
      if (el.matches && el.matches(selector)) return label;
      if (el.closest && el.closest(selector)) return label;
    }
    return null;
  }

  // Interactive elements
  function setupCursorHovers() {
    const interactiveSelectors = [
      'a', 'button', '.card-resource', '.card-service',
      '.card-team', '.useful-link-item', '.practice-item__header',
      '.tab-btn', '.footer__social', '.footer__link', '.nav-dropdown__item'
    ].join(', ');

    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (overMagneticBtn) return;
        const label = getLabel(el);
        if (label && cursorLabel) cursorLabel.textContent = label;
        cursor.classList.add('expanded');
        cursor.classList.remove('hidden');
      });

      el.addEventListener('mouseleave', () => {
        if (!overMagneticBtn) {
          cursor.classList.remove('expanded');
        }
      });
    });

    // Buttons: keep a small solid dot visible (never hide the cursor entirely,
    // otherwise the pointer disappears while the magnetic effect takes over).
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        overMagneticBtn = true;
        cursor.classList.remove('hidden');
        cursor.classList.remove('expanded');
        cursor.classList.add('on-button');
      });

      btn.addEventListener('mouseleave', () => {
        overMagneticBtn = false;
        cursor.classList.remove('on-button');
      });
    });
  }

  // ─── MAGNETIC BUTTONS ─────────────────────────────────────
  function initMagneticButtons() {
    if (typeof gsap === 'undefined') return;

    const MAGNETIC_STRENGTH = 0.35;
    const MAGNETIC_RADIUS = 80;

    document.querySelectorAll('.btn').forEach(btn => {
      const quickX = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const quickY = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });

      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS) {
          const strength = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
          quickX(dx * strength * 2.5);
          quickY(dy * strength * 2.5);
        }
      });

      btn.addEventListener('mouseleave', () => {
        quickX(0);
        quickY(0);
      });

      // Radial fill click
      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        btn.style.setProperty('--ripple-x', x + 'px');
        btn.style.setProperty('--ripple-y', y + 'px');
        btn.classList.add('ripple-active');

        setTimeout(() => btn.classList.remove('ripple-active'), 600);
      });
    });
  }

  // ─── FLOATING THUMBNAIL (Resources page) ─────────────────
  function initFloatingThumbs() {
    const floatingThumb = document.querySelector('.floating-thumb');
    if (!floatingThumb) return;

    const thumbImg = floatingThumb.querySelector('img, svg, .floating-thumb-inner');
    let currentCard = null;
    let thumbX = 0, thumbY = 0;
    let targetX = 0, targetY = 0;

    function updateThumbPos(e) {
      targetX = e.clientX + 24;
      targetY = e.clientY - 80;
    }

    document.addEventListener('mousemove', e => {
      updateThumbPos(e);
      thumbX += (targetX - thumbX) * 0.1;
      thumbY += (targetY - thumbY) * 0.1;
    });

    function animateThumb() {
      thumbX += (targetX - thumbX) * 0.1;
      thumbY += (targetY - thumbY) * 0.1;
      floatingThumb.style.left = thumbX + 'px';
      floatingThumb.style.top = thumbY + 'px';
      requestAnimationFrame(animateThumb);
    }
    animateThumb();

    document.querySelectorAll('.card-resource, [data-float-thumb]').forEach(card => {
      card.addEventListener('mouseenter', () => {
        // Get thumbnail src if exists
        const thumb = card.querySelector('.card-resource__thumb img');
        const placeholder = card.querySelector('.card-resource__thumb-placeholder');

        if (thumbImg) {
          if (thumb) {
            floatingThumb.innerHTML = `<img src="${thumb.src}" alt="" aria-hidden="true">`;
          } else {
            floatingThumb.innerHTML = getResourcePlaceholderSVG();
          }
        }

        floatingThumb.classList.add('visible');
        currentCard = card;
      });

      card.addEventListener('mouseleave', () => {
        floatingThumb.classList.remove('visible');
        currentCard = null;
      });
    });
  }

  function getResourcePlaceholderSVG() {
    return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#F4EEE0,#FCFAF4);">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="36" height="36" rx="1" stroke="#B8912E" stroke-width="1.5" fill="none"/>
        <path d="M14 24h20M14 18h12M14 30h16" stroke="#B8912E" stroke-width="1.5" stroke-linecap="square"/>
      </svg>
    </div>`;
  }

  // ─── INIT ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    setupCursorHovers();
    initMagneticButtons();
    initFloatingThumbs();
  });

})();
