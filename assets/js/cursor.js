/* ============================================================
   FIN ASTRA — CURSOR & MAGNETIC BUTTONS
   cursor.js — custom cursor, magnetic pull, radial fill
   ============================================================ */

'use strict';

(function () {
  const isTouch = window.matchMedia('(hover: none)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReduced) return;

  const cursor = document.querySelector('.custom-cursor');
  const cursorLabel = cursor ? cursor.querySelector('.cursor-label') : null;
  if (!cursor) return;

  document.documentElement.classList.add('has-custom-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let hoverEl = null;

  /* Snappy follow — higher LERP = less lag */
  const LERP = 0.48;

  const INTERACTIVE =
    'a, button, .card-resource, .card-service, .card-team, ' +
    '.useful-link-item, .practice-item__header, .tab-btn, ' +
    '.footer__social, .footer__link, .nav-dropdown__item, ' +
    '.nav-link, .nav-dropdown__trigger';

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

  function getLabel(el) {
    for (const [selector, label] of Object.entries(labelMap)) {
      if (el.matches && el.matches(selector)) return label;
      if (el.closest && el.closest(selector)) return label;
    }
    return null;
  }

  function applyHoverState(el) {
    cursor.classList.remove('expanded', 'on-button');

    if (!el) {
      if (cursorLabel) cursorLabel.textContent = '';
      return;
    }

    const btn = el.matches('.btn') ? el : el.closest('.btn');
    if (btn) {
      cursor.classList.add('on-button');
      if (cursorLabel) cursorLabel.textContent = '';
      return;
    }

    const label = getLabel(el);
    if (cursorLabel) cursorLabel.textContent = label || '';
    cursor.classList.add('expanded');
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));

  function animateCursor() {
    cursorX += (mouseX - cursorX) * LERP;
    cursorY += (mouseY - cursorY) * LERP;

    if (typeof gsap !== 'undefined') {
      gsap.set(cursor, {
        x: cursorX,
        y: cursorY,
        xPercent: -50,
        yPercent: -50,
        force3D: true
      });
    } else {
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    }

    /* Hit-test every frame — avoids broken flicker on nested links/cards */
    const hit = document.elementFromPoint(mouseX, mouseY);
    const interactive = hit?.closest?.(INTERACTIVE) ?? null;

    if (interactive !== hoverEl) {
      hoverEl = interactive;
      applyHoverState(hoverEl);
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // ─── MAGNETIC BUTTONS ─────────────────────────────────────
  function initMagneticButtons() {
    if (typeof gsap === 'undefined') return;

    const MAGNETIC_STRENGTH = 0.28;
    const MAGNETIC_RADIUS = 72;

    document.querySelectorAll('.btn').forEach(btn => {
      const quickX = gsap.quickTo(btn, 'x', { duration: 0.22, ease: 'power2.out' });
      const quickY = gsap.quickTo(btn, 'y', { duration: 0.22, ease: 'power2.out' });

      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS) {
          const strength = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
          quickX(dx * strength * 2.2);
          quickY(dy * strength * 2.2);
        }
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        quickX(0);
        quickY(0);
      });

      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty('--ripple-x', (e.clientX - rect.left) + 'px');
        btn.style.setProperty('--ripple-y', (e.clientY - rect.top) + 'px');
        btn.classList.add('ripple-active');
        setTimeout(() => btn.classList.remove('ripple-active'), 500);
      });
    });
  }

  // ─── FLOATING THUMBNAIL (Resources page) ─────────────────
  function initFloatingThumbs() {
    const floatingThumb = document.querySelector('.floating-thumb');
    if (!floatingThumb || window.matchMedia('(hover: none)').matches) return;

    let thumbX = 0;
    let thumbY = 0;
    let targetX = 0;
    let targetY = 0;
    const THUMB_LERP = 0.32;

    document.addEventListener('mousemove', e => {
      targetX = e.clientX + 24;
      targetY = e.clientY - 80;
    }, { passive: true });

    function animateThumb() {
      thumbX += (targetX - thumbX) * THUMB_LERP;
      thumbY += (targetY - thumbY) * THUMB_LERP;
      floatingThumb.style.left = thumbX + 'px';
      floatingThumb.style.top = thumbY + 'px';
      requestAnimationFrame(animateThumb);
    }
    animateThumb();

    document.querySelectorAll('.card-resource, [data-float-thumb]').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const thumb = card.querySelector('.card-resource__thumb img');
        if (thumb) {
          floatingThumb.innerHTML = `<img src="${thumb.src}" alt="" aria-hidden="true">`;
        } else {
          floatingThumb.innerHTML = getResourcePlaceholderSVG();
        }
        floatingThumb.classList.add('visible');
      });

      card.addEventListener('mouseleave', () => {
        floatingThumb.classList.remove('visible');
      });
    });
  }

  function getResourcePlaceholderSVG() {
    return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#FAF7F0,#FFFFFF);">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="36" height="36" rx="1" stroke="#0F5C47" stroke-width="1.5" fill="none"/>
        <path d="M14 24h20M14 18h12M14 30h16" stroke="#0F5C47" stroke-width="1.5" stroke-linecap="square"/>
      </svg>
    </div>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMagneticButtons();
    initFloatingThumbs();
  });

})();
