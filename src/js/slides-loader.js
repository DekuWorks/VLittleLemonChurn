/**
 * Loads slide HTML from separate files and injects into the page.
 */
(function () {
  "use strict";

  const SLIDES = ["cover.html", "why.html", "recipe.html"];
  const SLIDES_DIR = "src/slides/";

  function loadSlide(filename) {
    const url = SLIDES_DIR + filename;
    return fetch(url).then((r) => {
      if (!r.ok) throw new Error("Failed to load " + filename);
      return r.text();
    });
  }

  function injectSlides(htmlParts) {
    const container = document.querySelector(".slides");
    if (!container) return;

    container.innerHTML = htmlParts.join("");
  }

  function showLoadError() {
    const container = document.querySelector(".slides");
    if (container) {
      container.innerHTML =
        '<p class="slides-error">Unable to load slides. Please serve this site from a web server (e.g. <code>python3 -m http.server</code>).</p>';
    }
  }

  window.slidesReady = Promise.all(SLIDES.map(loadSlide))
    .then((htmlParts) => {
      injectSlides(htmlParts);
      document.dispatchEvent(new CustomEvent("slidesReady"));
    })
    .catch((err) => {
      console.error("Failed to load slides:", err);
      showLoadError();
      document.dispatchEvent(new CustomEvent("slidesReady"));
    });
})();
