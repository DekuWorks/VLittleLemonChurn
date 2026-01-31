/**
 * Lemon Churn Recipe - Slide Deck
 * Manages slide state, navigation, hash routing, and accessibility
 */

(function () {
  "use strict";

  let slides;
  let totalSlides;
  let currentIndex = 0;

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const slideCounter = document.getElementById("slide-counter");

  function getIndexFromHash() {
    const hash = window.location.hash;
    const match = hash && hash.match(/^#slide-(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      const max = (slides && slides.length) || 7;
      if (idx >= 0 && idx < max) return idx;
    }
    return 0;
  }

  function setHash(index) {
    const hash = `#slide-${index + 1}`;
    if (window.location.hash !== hash) {
      const url = window.location.pathname + window.location.search + hash;
      history.replaceState(null, "", url);
    }
  }

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentIndex = index;

    slides.forEach((slide, i) => {
      const isActive = i === currentIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", !isActive);
      slide.setAttribute("aria-current", isActive ? "step" : null);
      slide.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    setHash(currentIndex);
    updateCounter();
    updateNavButtons();
    updateNavPills();
    manageFocus();
    document.body.classList.toggle("on-cover", currentIndex === 0);
    document.body.classList.toggle("on-why", currentIndex === 1);
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

  function onHashChange() {
    const idx = getIndexFromHash();
    if (idx !== currentIndex) {
      goToSlide(idx);
    }
  }

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

  function bindEvents() {
    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);

    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("keydown", onKeyDown);

    document.querySelectorAll('a[href^="#slide-"]').forEach((link) => {
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

  function init() {
    slides = document.querySelectorAll(".slide");
    totalSlides = slides.length;
    if (totalSlides === 0) return;
    currentIndex = getIndexFromHash();
    goToSlide(currentIndex);
    bindEvents();
  }

  function runWhenReady() {
    (window.slidesReady || Promise.resolve()).then(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runWhenReady);
  } else {
    runWhenReady();
  }
})();
