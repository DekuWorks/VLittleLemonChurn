/**
 * Environment-based API configuration
 * - Local: http://localhost:5000
 * - Production: set via data-api-base on <html> or window.__API_BASE__
 */
(function () {
  "use strict";

  function getApiBase() {
    const meta = document.documentElement.getAttribute("data-api-base");
    if (meta) return meta.replace(/\/$/, "");
    if (typeof window.__API_BASE__ === "string" && window.__API_BASE__) {
      return window.__API_BASE__.replace(/\/$/, "");
    }
    if (
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:5000";
    }
    return "";
  }

  window.LEMON_CHURN_CONFIG = {
    apiBase: getApiBase(),
  };
})();
