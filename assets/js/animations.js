/* ============================================================
   FIN ASTRA — ANIMATIONS JS
   animations.js — GSAP ScrollTrigger setups, reveals
   ============================================================ */

'use strict';

function initAnimations() {
  if (typeof gsap === 'undefined') return;

  // Register plugins
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // ─── HERO WORD STAGGER ───────────────────────────────────
  const heroWords = document.querySelectorAll('.hero-word-inner');
  if (heroWords.length) {
    gsap.to(heroWords, {
      y: 0,
      opacity: 1,
      duration: 1.0,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.3
    });
  }

  // Hero subhead + CTA fade
  gsap.utils.toArray('.hero-fade').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.7 + (i * 0.15)
    });
  });

  // ─── SECTION EYEBROW LINE DRAW ───────────────────────────
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.section-eyebrow').forEach(eyebrow => {
      ScrollTrigger.create({
        trigger: eyebrow,
        start: 'top 85%',
        once: true,
        onEnter: () => eyebrow.classList.add('line-drawn')
      });
    });

    // Rule motifs
    gsap.utils.toArray('.rule-motif').forEach(rule => {
      const line = rule.querySelector('.rule-motif__line');
      const diamond = rule.querySelector('.rule-motif__diamond');
      ScrollTrigger.create({
        trigger: rule,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (line) line.classList.add('drawn');
          if (diamond) diamond.classList.add('drawn');
        }
      });
    });

    // ─── TEXT REVEAL (fade up + opacity) ─────────────────
    gsap.utils.toArray('.reveal-up').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    // Staggered siblings
    gsap.utils.toArray('.stagger-group').forEach(group => {
      const children = group.children;
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          once: true
        }
      });
    });

    // ─── IMAGE CURTAIN WIPE ───────────────────────────────
    gsap.utils.toArray('.reveal-clip').forEach(el => {
      gsap.to(el, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      });
    });

    // Bottom-up image reveal
    gsap.utils.toArray('.reveal-img').forEach(el => {
      gsap.to(el, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true
        }
      });
    });

    // ─── PROCESS STEPS ───────────────────────────────────
    const processSteps = gsap.utils.toArray('.process-step');
    if (processSteps.length) {
      gsap.from(processSteps, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process-grid',
          start: 'top 80%',
          once: true
        }
      });
    }

    // ─── PULL QUOTE ───────────────────────────────────────
    const pullQuote = document.querySelector('.pull-quote__text');
    if (pullQuote) {
      gsap.from(pullQuote, {
        opacity: 0,
        y: 20,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: pullQuote,
          start: 'top 80%',
          once: true
        }
      });
    }

    // ─── TERRACOTTA LINE — CTA BAND DECOR ─────────────────
    const ctaBands = document.querySelectorAll('.cta-band');
    ctaBands.forEach(band => {
      const inner = band.querySelector('.container');
      if (!inner) return;
      gsap.from(inner.children, {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: band,
          start: 'top 80%',
          once: true
        }
      });
    });
  }
}

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initAnimations);
