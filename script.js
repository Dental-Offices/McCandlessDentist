/* global document, window, IntersectionObserver */

'use strict';

// ── Footer year ──────────────────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Header scroll state ───────────────────────────────────────────────────────
const header = document.getElementById('header');

function updateHeader() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ── Hero background parallax-start ───────────────────────────────────────────
const heroBg = document.querySelector('.hero__bg');
if (heroBg) {
  // Trigger the subtle zoom-out on load
  window.addEventListener('load', () => heroBg.classList.add('loaded'));
}

// ── Mobile hamburger ─────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

function closeMobileNav() {
  hamburger.classList.remove('open');
  nav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function isMobileNav() {
  return window.innerWidth <= 900;
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav when a link is clicked (mobile)
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    // Keep the Services dropdown trigger from immediately closing the mobile menu.
    if (isMobileNav() && link.matches('.nav__item--dropdown > .nav__link')) {
      return;
    }

    closeMobileNav();
  });
});

document.querySelectorAll('.nav__item--dropdown > .nav__link').forEach((toggle) => {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('click', (e) => {
    if (!isMobileNav()) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const parentItem = toggle.closest('.nav__item--dropdown');
    const isOpen = parentItem.classList.toggle('open');

    toggle.setAttribute('aria-expanded', String(isOpen));

    // Close any other open dropdowns to keep the menu predictable on small screens.
    document.querySelectorAll('.nav__item--dropdown').forEach((item) => {
      if (item !== parentItem) {
        item.classList.remove('open');
        const itemToggle = item.querySelector('.nav__link');
        if (itemToggle) {
          itemToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
});

// Close nav on resize
window.addEventListener('resize', () => {
  if (!isMobileNav()) {
    closeMobileNav();

    document.querySelectorAll('.nav__item--dropdown').forEach((item) => {
      item.classList.remove('open');
      const toggle = item.querySelector('.nav__link');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// ── Active nav link on scroll ─────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

function setActiveLink() {
  let current = '';
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });

// ── Scroll reveal ─────────────────────────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

// Reveal elements that are already in view on initial load
function revealInitialElements() {
  revealElements.forEach((el) => {
    if (!el.classList.contains('visible')) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => {
          el.classList.add('visible');
        }, Math.min(delay, 200)); // Cap delay to 200ms for initial load
      }
    }
  });
}

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', revealInitialElements, false);
} else {
  // If page already loaded, run immediately
  revealInitialElements();
}

// Also run on window load as backup
window.addEventListener('load', revealInitialElements, false);

// ── Smooth scroll for anchor links ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');

    // Let the mobile Services trigger be handled by the dropdown logic above.
    if (isMobileNav() && anchor.matches('.nav__item--dropdown > .nav__link')) {
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
