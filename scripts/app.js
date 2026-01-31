/**
 * Lemon Churn Recipe - Slide Deck
 * Manages slide state, navigation, and accessibility
 */

(function () {
  "use strict";

  const SLIDE_SELECTOR = ".slide";
  const slides = document.querySelectorAll(SLIDE_SELECTOR);
  const totalSlides = slides.length;
  let currentIndex = 0;

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const slideCounter = document.getElementById("slide-counter");

  /**
   * Parse hash to slide index (e.g., #slide-2 -> 1)
   */
  function getIndexFromHash() {
    const hash = window.location.hash;
    const match = hash && hash.match(/^#slide-(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      if (idx >= 0 && idx < totalSlides) return idx;
    }
    return 0;
  }

  /**
   * Update URL hash without scrolling
   */
  function setHash(index) {
    const hash = `#slide-${index + 1}`;
    if (window.location.hash !== hash) {
      const url = window.location.pathname + window.location.search + hash;
      history.replaceState(null, "", url);
    }
  }

  /**
   * Inject background images from data-bg
   */
  function initSlideBackgrounds() {
    slides.forEach((slide) => {
      const bg = slide.getAttribute("data-bg");
      const bgEl = slide.querySelector(".slide-bg");
      if (bg && bgEl) {
        bgEl.style.backgroundImage = `url(${bg})`;
      }
    });
  }

  /**
   * Show slide at given index
   */
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === currentIndex);
      slide.setAttribute("aria-hidden", i !== currentIndex);
      slide.setAttribute("tabindex", i === currentIndex ? "0" : "-1");
    });

    setHash(currentIndex);
    updateCounter();
    updateNavButtons();
    updateNavPills();
    manageFocus();
  }

  function updateCounter() {
    if (slideCounter) {
      slideCounter.textContent = `Slide ${currentIndex + 1} of ${totalSlides}`;
      slideCounter.setAttribute("aria-live", "polite");
    }
  }

  function updateNavButtons() {
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === totalSlides - 1;
  }

  function updateNavPills() {
    const links = document.querySelectorAll('.nav-pills a[href^="#slide-"]');
    links.forEach((link, i) => {
      link.setAttribute("aria-current", i === currentIndex ? "step" : null);
    });
  }

  /**
   * Move focus to active slide for keyboard users
   */
  function manageFocus() {
    const activeSlide = slides[currentIndex];
    if (activeSlide && document.activeElement) {
      const focusable = activeSlide.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        focusable.focus();
      } else {
        activeSlide.focus({ preventScroll: true });
      }
    }
  }

  function prev() {
    goToSlide(currentIndex - 1);
  }

  function next() {
    goToSlide(currentIndex + 1);
  }

  /**
   * Handle hash change (e.g., browser back/forward)
   */
  function onHashChange() {
    const idx = getIndexFromHash();
    if (idx !== currentIndex) {
      goToSlide(idx);
    }
  }

  /**
   * Handle keyboard navigation
   */
  function onKeyDown(e) {
    if (e.target.closest("input, textarea, select")) return;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        prev();
        break;
      case "ArrowRight":
        e.preventDefault();
        next();
        break;
      case "Home":
        e.preventDefault();
        goToSlide(0);
        break;
      case "End":
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
    }
  }

  /**
   * Bind events
   */
  function bindEvents() {
    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);

    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("keydown", onKeyDown);

    document.querySelectorAll('.nav-pills a[href^="#slide-"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        const match = href && href.match(/^#slide-(\d+)$/);
        if (match) {
          goToSlide(parseInt(match[1], 10) - 1);
        }
      });
    });
  }

  /**
   * Initialize
   */
  function init() {
    initSlideBackgrounds();
    currentIndex = getIndexFromHash();
    goToSlide(currentIndex);
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
