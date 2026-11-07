# Local Japanese Cooking App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an offline-friendly Thai recipe app for ten Japanese meals made with one electric pot.

**Architecture:** A static browser app uses local recipe data, local SVG artwork, and localStorage for favorites. A single responsive view switches between the recipe library, recipe details, and guided cooking steps.

**Tech Stack:** HTML, CSS, vanilla JavaScript, SVG.

**Spec:** `docs/superpowers/specs/local-japanese-cooking-app.md`

## Global Constraints

- Keep all application assets local; no remote calls, fonts, or runtime dependencies.
- Thai is the primary interface language.
- Support one basic electric pot and ordinary kitchen utensils.
- Include ten Japanese recipes and original local SVG illustrations.

## Review Focus

- Empty search/filter results should explain that no dishes matched and allow clearing the filter.
- A corrupted or unavailable localStorage value should not prevent the recipe library from opening.
- Cooking-step navigation should stay within the selected recipe and handle first/last step boundaries.
- Narrow mobile widths should keep cards and controls usable without horizontal overflow.
- SVG artwork should remain local and have accessible text alternatives.

---

### Task 1: Build the recipe library and local art

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`
- Create: `start-app.cmd`
- Create: `assets/recipes/*.jpg`
- Create: `assets/recipes/credits.html`
- Create: `README.md`

**Interfaces:**
- `app.js` owns recipe data, view state, filtering, favorites, detail rendering, and cooking mode.
- Each recipe contains `id`, `name`, `japaneseName`, `category`, `time`, `servings`, `difficulty`, `description`, `image`, `ingredients`, and `steps`.

- [x] Create a responsive library/detail/cooking experience in the static HTML/CSS/JS files.
- [x] Add ten electric-pot-friendly Japanese recipes, locally stored Commons photos, attribution, and inline SVG fallbacks rendered by `artFor(recipe)` in `app.js`.
- [x] Add setup instructions for opening the app locally; the HTML, CSS, and JavaScript use local files only.
- [x] Add a Windows launcher that starts the local server and opens the browser; direct `index.html` opening is the fallback.
