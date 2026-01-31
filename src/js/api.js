/**
 * Fetches recipe and nutrition from the API.
 * Falls back to defaults matching the recipe slides if API is unavailable.
 */
(function () {
  "use strict";

  const DEFAULTS = {
    ingredients: [
      "2 LARGE EGG WHITES",
      "¼ TEASPOON CREAM OF TARTAR",
      "¼ CUP CRYSTALLIZED GINGER",
      "¾ CUP OF GRANULATED SUGAR",
      "¾ LEMON ZEST, FINELY CHOPPED",
      "6 TABLESPOONS OF FRESHEST SQUEEZED AND STRAINED LEMON JUICE (ABOUT 2 LEMONS)",
      "½ CUP OF HEAVY CREAM",
      "¼ CUP PLAIN FULL FAT GREEK YOGURT",
    ],
    instructions: [
      { heading: "PREP (30-60 MIN AHEAD)", text: "MEASURE THE EGG WHITES AND CREAM OF TARTAR INTO A STAND MIXER BOWL. COVER AND LET SIT. FINELY CHOP THE GINGER, THEN MIX THE GINGER WITH THE SUGAR." },
      { heading: "MAKE THE SYRUP", text: "IN A MEDIUM SAUCEPAN, STIR TOGETHER THE GINGER SUGAR, LEMON ZEST, AND LEMON JUICE. BRING TO A BOIL OVER MEDIUM HEAT, THEN LET SIMMER FOR 5 MINUTES." },
      { heading: "WHIP EGG WHITES", text: "WHILE THE SYRUP COOKS, BEAT THE EGG WHITES AND CREAM OF TARTAR UNTIL STIFF PEAKS FORM." },
      { heading: "MAKE THE MERINGUE", text: "WITH THE MIXER ON LOW, SLOWLY POUR THE HOT SYRUP INTO THE EGG WHITES. THEN INCREASE SPEED TO HIGH AND BEAT UNTIL THICK 7-10 MINUTES, THEN SET IT ASIDE." },
      { heading: "WHIP CREAM AND FOLD", text: "IN THE SAME MIXER BOWL, WHIP THE CREAM TO SOFT PEAKS, GENTLY FOLD IN THE YOGURT AND THEN FOLD THE MIXTURE INTO THE MERINGUE UNTIL SMOOTH." },
      { heading: "TRANSFER TO A CONTAINER", text: "PRESS PLASTIC WRAP DIRECTLY ON SURFACE, COVER, AND FREEZE. FREEZE 6 HOURS FOR FIRM ICE CREAM OR ABOUT 3 HOURS FOR SOFT-SERVE TEXTURE. KEEPS IN THE FREEZER FOR 1 WEEK." },
    ],
    nutrition: {
      calories: 185,
      protein: "3G",
      carbohydrates: "24G",
      cholesterol: "24MG",
      sodium: "35MG",
      servingLabel: "PER SERVING",
    },
  };

  function getApiBase() {
    return (window.LEMON_CHURN_CONFIG && window.LEMON_CHURN_CONFIG.apiBase) || "";
  }

  async function fetchJson(path) {
    const base = getApiBase();
    if (!base) return null;
    try {
      const res = await fetch(`${base}${path}`, {
        headers: { Accept: "application/json" },
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  }

  async function loadRecipe() {
    const data = await fetchJson("/api/recipe");
    return data || { ingredients: DEFAULTS.ingredients, instructions: DEFAULTS.instructions };
  }

  async function loadNutrition() {
    const data = await fetchJson("/api/nutrition");
    return data || DEFAULTS.nutrition;
  }

  function showLoading(container) {
    if (!container) return;
    const loading = container.querySelector(".api-loading");
    const content = container.querySelector(".api-content");
    const error = container.querySelector(".api-error");
    if (loading) loading.hidden = false;
    if (content) content.hidden = true;
    if (error) error.hidden = true;
  }

  function showContent(container) {
    if (!container) return;
    const loading = container.querySelector(".api-loading");
    const content = container.querySelector(".api-content");
    const error = container.querySelector(".api-error");
    if (loading) loading.hidden = true;
    if (content) content.hidden = false;
    if (error) error.hidden = true;
  }

  function showError(container) {
    if (!container) return;
    const loading = container.querySelector(".api-loading");
    const content = container.querySelector(".api-content");
    const error = container.querySelector(".api-error");
    if (loading) loading.hidden = true;
    if (content) content.hidden = true;
    if (error) error.hidden = false;
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function renderInstructions(container, instructions) {
    const content = container.querySelector(".api-content");
    if (!content) return;

    const list = Array.isArray(instructions) ? instructions : DEFAULTS.instructions;
    content.innerHTML = list
      .map(
        (item) => `
      <div class="instruction-section">
        <p class="instruction-heading">${escapeHtml(item.heading || item.section)}:</p>
        <p class="instruction-text">${escapeHtml(item.text || item.body || "")}</p>
      </div>
    `
      )
      .join("");
  }

  function renderIngredients(container, ingredients) {
    const content = container.querySelector(".api-content");
    if (!content) return;

    const list = Array.isArray(ingredients) ? ingredients : DEFAULTS.ingredients;
    content.innerHTML = list.map((i) => `<li>${escapeHtml(i)}</li>`).join("");
  }

  function renderNutrition(container, nutrition) {
    const content = container.querySelector(".api-content");
    if (!content) return;

    const n = nutrition || DEFAULTS.nutrition;
    const format = (label, value) =>
      value != null ? `${escapeHtml(String(label).toUpperCase())}: ${escapeHtml(String(value))}` : "";

    const lines = [
      format("Calories", n.calories ? `${n.calories} CAL` : n.caloriesRaw),
      format("Protein", n.protein),
      format("Carbohydrates", n.carbohydrates),
      format("Cholesterol", n.cholesterol),
      format("Sodium", n.sodium),
    ].filter(Boolean);

    content.innerHTML = lines.map((line) => `<p>${line}</p>`).join("");
  }

  async function init() {
    const recipeContainer = document.getElementById("api-recipe-container");
    const nutritionContainer = document.getElementById("api-nutrition-container");
    const ingredientsContainer = document.getElementById("api-ingredients-container");

    if (recipeContainer) {
      showLoading(recipeContainer);
      try {
        const recipe = await loadRecipe();
        renderInstructions(recipeContainer, recipe.instructions);
        showContent(recipeContainer);

        if (ingredientsContainer) {
          renderIngredients(ingredientsContainer, recipe.ingredients);
          showContent(ingredientsContainer);
        }
      } catch {
        showError(recipeContainer);
        if (ingredientsContainer) showError(ingredientsContainer);
      }
    }

    if (nutritionContainer) {
      showLoading(nutritionContainer);
      try {
        const nutrition = await loadNutrition();
        renderNutrition(nutritionContainer, nutrition);
        showContent(nutritionContainer);
      } catch {
        showError(nutritionContainer);
      }
    }
  }

  window.LemonChurnApi = { loadRecipe, loadNutrition, init };

  function runWhenReady() {
    (window.slidesReady || Promise.resolve()).then(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runWhenReady);
  } else {
    runWhenReady();
  }
})();
