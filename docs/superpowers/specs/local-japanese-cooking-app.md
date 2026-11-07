# Local Japanese Cooking App

## Intent

Create a Thai-language, mobile-friendly local web app that helps a beginner cook Japanese dishes using one basic electric pot.

## Goals

- Show ten Japanese recipes with a locally stored food illustration, ingredients, preparation time, and clear cooking steps.
- Support finding recipes by name and filtering by useful categories.
- Provide a focused step-by-step cooking mode and locally saved favorites.
- Work without an internet connection after the project files are present.

## Non-goals

- Accounts, cloud sync, online APIs, video, nutrition advice, or shopping lists.
- Requiring any appliance beyond one basic electric pot and ordinary kitchen utensils.

## Constraints and assumptions

- Use plain HTML, CSS, JavaScript, and locally stored licensed food photos with inline SVG fallbacks so no package installation or runtime network request is needed.
- Thai is the primary interface language; retain Japanese dish names where useful.
- Recipes are beginner-friendly adaptations. Cook poultry and meat fully; appliance heat and boil behavior vary, so steps should ask the cook to confirm doneness.
- Food photos are downloaded from Wikimedia Commons under their listed free licenses, stored locally, and credited in `assets/recipes/credits.html`; SVG illustrations remain as local fallbacks.

## Approaches

- Local static web app (selected): opens in a browser, works offline, and is simplest to run and edit.
- Installed desktop/mobile app: adds packaging and platform upkeep without improving the core recipe flow enough for this first version.

## Experience

The home screen presents a warm editorial-style recipe collection with search, category filters, and recipe cards. Selecting a card opens a recipe view with an illustration, ingredient checklist, yield/time, and ordered steps. A cooking mode presents one step at a time. Favorites persist in the current browser on this device.

## Builder decisions

Use a small static project with `index.html`, `styles.css`, `app.js`, local recipe photos, an image credits page, a Windows launcher, and a short README. Include ten one-pot Japanese dishes selected for accessible ingredients and electric-pot preparation; display local photos with inline SVG fallbacks.
