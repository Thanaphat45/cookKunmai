const state = {
  category: 'ทั้งหมด',
  query: '',
  savedOnly: false,
  quick: false,
  scale: 1,
  saved: readSaved(),
  recipe: null,
  step: 0,
  returnFocus: null
};
const grid = document.querySelector('#recipe-grid');
const overlayRoot = document.querySelector('#overlay-root');
const search = document.querySelector('#search');

function readSaved() {
  try {
    const value = JSON.parse(localStorage.getItem('onepot-saved') || '[]');
    return Array.isArray(value) ? value.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}
function writeSaved() {
  try {
    localStorage.setItem('onepot-saved', JSON.stringify(state.saved));
  } catch {
    /* Favorites stay usable for this session if storage is disabled. */
  }
}
function artFor(recipe) {
  const [bg = '#e8e1cf', leaf = '#718457', sauce = '#d9ad55', red = '#b34b35', cream = '#f5e7c8'] = recipe.palette;
  const garnish = {
    oyakodon: `<path d="M68 88q23-22 42 0q-20 18-42 0m26 30q24-23 43-2q-19 20-43 2" fill="${red}"/><path d="M115 67q16-10 25 6q-12 14-25-6" fill="#fff7e4"/><circle cx="128" cy="73" r="5" fill="#e7bc57"/><path d="M148 109q14-22 29-4q-11 19-29 4" fill="${leaf}"/>`,
    gyudon: `<path d="M60 91q19-22 39-5l-8 10q-17-7-29 8Zm49 19q20-24 42-6l-7 11q-19-8-34 8Zm-34 16q18-18 37-3l-9 11q-14-6-25 7Z" fill="${red}"/><path d="M99 70q11-14 22 0m9 49q10-15 21-2" fill="none" stroke="#fff5db" stroke-width="6" stroke-linecap="round"/><path d="M153 82q16-17 29 0q-13 17-29 0" fill="${leaf}"/>`,
    curry: `<rect x="70" y="74" width="34" height="25" rx="8" transform="rotate(-18 70 74)" fill="${red}"/><rect x="111" y="89" width="32" height="26" rx="8" transform="rotate(14 111 89)" fill="#dcae68"/><rect x="82" y="111" width="28" height="23" rx="7" transform="rotate(10 82 111)" fill="#e2ad48"/><circle cx="151" cy="70" r="9" fill="#82905c"/><circle cx="158" cy="124" r="8" fill="#82905c"/>`,
    zosui: `<circle cx="78" cy="82" r="5" fill="#fff9e9"/><circle cx="100" cy="74" r="5" fill="#fff9e9"/><circle cx="125" cy="80" r="5" fill="#fff9e9"/><circle cx="150" cy="79" r="5" fill="#fff9e9"/><circle cx="91" cy="105" r="5" fill="#fff9e9"/><circle cx="132" cy="111" r="5" fill="#fff9e9"/><path d="M67 94q11-10 21 0t21 0t21 0t21 0t21 0" fill="none" stroke="#e6c86f" stroke-width="8" stroke-linecap="round"/><path d="M117 123q17-17 33-1" fill="none" stroke="${leaf}" stroke-width="7" stroke-linecap="round"/>`,
    udon: `<path d="M65 90q16-18 31 0t30 0t30 0t25 0M70 112q17-18 33 0t33 0t33 0M82 131q13-14 26 0t26 0" fill="none" stroke="#f9f0d9" stroke-width="8" stroke-linecap="round"/><rect x="139" y="68" width="29" height="19" rx="5" transform="rotate(-13 139 68)" fill="${red}"/><path d="M76 74q15-15 29-1" fill="none" stroke="${leaf}" stroke-width="6"/>`,
    miso: `<rect x="76" y="73" width="25" height="22" rx="3" fill="#f7edcf"/><rect x="116" y="81" width="25" height="22" rx="3" fill="#fff5dc"/><rect x="95" y="112" width="25" height="22" rx="3" fill="#f7edcf"/><rect x="139" y="117" width="25" height="21" rx="3" fill="#fff5dc"/><path d="M67 103q15-14 30 0t30 0" fill="none" stroke="${leaf}" stroke-width="7" stroke-linecap="round"/><circle cx="158" cy="83" r="4" fill="${red}"/>`,
    nabe: `<path d="M69 91q16-31 38-7q-11 25-38 7Zm48-17q21-22 35 2q-17 20-35-2Zm15 52q12-25 36-10q-9 26-36 10Z" fill="${leaf}"/><ellipse cx="94" cy="118" rx="23" ry="11" transform="rotate(18 94 118)" fill="${red}"/><ellipse cx="145" cy="99" rx="21" ry="10" transform="rotate(-24 145 99)" fill="#f0d9bd"/><circle cx="78" cy="71" r="8" fill="#d3ac6d"/>`,
    nikujaga: `<rect x="70" y="77" width="33" height="27" rx="9" transform="rotate(-16 70 77)" fill="#dfc28e"/><rect x="116" y="73" width="31" height="25" rx="9" transform="rotate(17 116 73)" fill="#d7b67e"/><rect x="88" y="111" width="35" height="26" rx="9" transform="rotate(7 88 111)" fill="#dfc28e"/><path d="M145 112l12-15 12 15-12 15z" fill="#df8c47"/><path d="M73 120q15-17 29-3" fill="none" stroke="${red}" stroke-width="7" stroke-linecap="round"/>`,
    ramen: `<path d="M63 91q14-17 27 0t27 0t27 0t27 0M69 111q14-17 27 0t27 0t27 0t21 0" fill="none" stroke="#f7e8c4" stroke-width="7" stroke-linecap="round"/><circle cx="105" cy="75" r="15" fill="#fff4d7"/><circle cx="105" cy="75" r="7" fill="#e8bd55"/><circle cx="151" cy="125" r="4" fill="#eac456"/><circle cx="163" cy="119" r="4" fill="#eac456"/><circle cx="172" cy="128" r="4" fill="#eac456"/><path d="M74 71q12-13 24-1" fill="none" stroke="${leaf}" stroke-width="6"/>`,
    'potato-salad': `<path d="M69 92q0-19 21-17q17 1 16 19q-3 18-22 16q-17-1-15-18Zm44 24q1-19 21-19q18 1 17 19q-2 17-20 17q-19 0-18-17Z" fill="#f8f0dc"/><circle cx="91" cy="87" r="6" fill="#df9c55"/><circle cx="127" cy="116" r="7" fill="#df9c55"/><path d="M133 75q17-18 32-1q-12 19-32 1Z" fill="${leaf}"/><path d="M72 123q14-15 28-2" fill="none" stroke="#88a166" stroke-width="7" stroke-linecap="round"/>`
  }[recipe.id];
  return `<svg class="food-illustration" viewBox="0 0 240 190" role="img" aria-label="${escapeHTML(recipe.name)} ภาพประกอบอาหาร" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="190" fill="${bg}"/><circle cx="190" cy="27" r="32" fill="#fff9e8" opacity=".44"/><path d="M19 162c48-15 142-12 202 2" fill="none" stroke="#6e6755" opacity=".09" stroke-width="2"/><ellipse cx="120" cy="107" rx="81" ry="62" fill="#b8ac96" opacity=".24"/><ellipse cx="120" cy="99" rx="82" ry="62" fill="#f8f5eb"/><ellipse cx="120" cy="96" rx="69" ry="49" fill="${sauce}"/><ellipse cx="120" cy="91" rx="60" ry="40" fill="${cream}" opacity=".88"/>${garnish || ''}<path d="M44 136q76 35 152 0q-7 31-76 35q-68-3-76-35Z" fill="#eee8d9" opacity=".9"/><path d="M52 139q68 22 136 0" fill="none" stroke="#b8ad98" stroke-width="2"/><path d="M81 33q-9-11 0-20m37 19q-9-11 0-20m37 22q-9-11 0-20" fill="none" stroke="#fff9ec" stroke-width="3" stroke-linecap="round" opacity=".7"/><text x="18" y="174" fill="#574f41" opacity=".55" font-family="Georgia,serif" font-size="11">おいしい</text></svg>`;
}
function recipePicture(recipe, eager = false) {
  if (!recipe.photo && !photoFiles[recipe.id]) return `<div class="photo-fallback">${artFor(recipe)}</div>`;
  return `<img class="food-photo" src="${recipe.photo || 'assets/recipes/' + photoFiles[recipe.id]}" alt="${escapeHTML(recipe.name)}" loading="${eager ? 'eager' : 'lazy'}" /><div class="photo-fallback" hidden>${artFor(recipe)}</div>`;
}
function attachPhotoFallbacks(root) {
  root.querySelectorAll('.food-photo').forEach((image) =>
    image.addEventListener(
      'error',
      () => {
        image.hidden = true;
        image.nextElementSibling.hidden = false;
      },
      { once: true }
    )
  );
}
function recipeCard(recipe, index) {
  const saved = state.saved.includes(recipe.id);
  return `<article class="recipe-card"><button class="card-open" data-open="${recipe.id}" type="button"><div class="card-image" style="--tile:${recipe.palette[0]}">${recipePicture(recipe)}<span class="dish-number">${String(index + 1).padStart(2, '0')}</span></div><div class="card-body"><div class="card-topline"><span class="tag">${escapeHTML(recipe.category)}</span><span class="cook-time">◷ ${recipe.time} นาที</span></div><h3>${escapeHTML(recipe.name)}</h3><p class="jp-name">${escapeHTML(recipe.jp)}</p><p class="card-desc">${escapeHTML(recipe.description)}</p>${window.cardBadges ? cardBadges(recipe) : ''}<div class="card-foot"><span>${escapeHTML(recipe.difficulty)}${typeof budgetLabel === 'function' ? ` · ${budgetLabel(recipe)}` : ''}</span><span>ดูสูตร →</span></div></div></button><button class="card-save ${saved ? 'is-saved' : ''}" data-save="${recipe.id}" type="button" aria-label="${saved ? 'นำออกจาก' : 'บันทึก'}เมนูโปรด" aria-pressed="${saved}">♡</button></article>`;
}
function getVisible() {
  const term = state.query.trim().toLocaleLowerCase('th');
  return recipes.filter((recipe) => {
    const categoryOk = state.category === 'ทั้งหมด' || recipe.category === state.category;
    const savedOk = !state.savedOnly || state.saved.includes(recipe.id);
    const searchable = [recipe.name, recipe.jp, recipe.description, ...recipe.ingredients]
      .join(' ')
      .toLocaleLowerCase('th');
    return (
      !(window.isAvoided && isAvoided(recipe)) &&
      categoryOk &&
      savedOk &&
      (!state.quick || recipe.time <= 20) &&
      (!term || searchable.includes(term))
    );
  });
}
function render() {
  const visible = getVisible();
  grid.innerHTML = visible.map((recipe) => recipeCard(recipe, recipes.indexOf(recipe))).join('');
  attachPhotoFallbacks(grid);
  document.querySelector('#result-count').textContent = String(visible.length);
  document.querySelector('#saved-count').textContent = String(state.saved.length);
  document.querySelector('#saved-toggle').setAttribute('aria-pressed', String(state.savedOnly));
  document.querySelector('#empty-state').hidden = visible.length !== 0;
  grid.hidden = visible.length === 0;
  document
    .querySelectorAll('.filter-chip[data-category]')
    .forEach((button) => button.classList.toggle('is-active', button.dataset.category === state.category));
  const quick = document.querySelector('#quick-toggle');
  quick.classList.toggle('is-active', state.quick);
  quick.setAttribute('aria-pressed', String(state.quick));
  updateShopCount();
  window.afterRender?.();
}
function saveRecipe(id) {
  state.saved = state.saved.includes(id) ? state.saved.filter((savedId) => savedId !== id) : [...state.saved, id];
  writeSaved();
  render();
  if (state.recipe?.id === id) renderDetail(state.recipe);
}
function closeDetail() {
  if (overlayRoot.querySelector('.cooking-screen')) clearSession();
  releaseWakeLock();
  stopSpeaking();
  stopTimer(false);
  state.recipe = null;
  overlayRoot.innerHTML = '';
  state.returnFocus?.focus();
  state.returnFocus = null;
}
function openDetail(recipe, trigger) {
  state.recipe = recipe;
  state.scale = 1;
  state.returnFocus = trigger;
  renderDetail(recipe);
}
function renderDetail(recipe) {
  clearSession();
  releaseWakeLock();
  stopSpeaking();
  stopTimer(false);
  const prevScroll = overlayRoot.querySelector('.detail-panel')?.scrollTop || 0;
  const riceNote = recipe.ingredients.some((item) => item.includes('ข้าวสวย'))
    ? '<p class="rice-note"><strong>มีหม้อใบเดียวก็พอ:</strong> ถ้ายังไม่มีข้าวสวย หุงข้าวในหม้อใบนี้ก่อน พักข้าวไว้ แล้วค่อยทำกับข้าว หรือใช้ข้าวสวยพร้อมทานก็ได้</p>'
    : '';
  overlayRoot.innerHTML = `<div class="overlay" data-close-overlay><section class="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title" tabindex="-1"><div class="detail-head"><button class="back-button" data-close type="button"><span>←</span> กลับไปเลือกเมนู</button><button class="close-button" data-close type="button" aria-label="ปิด">✕</button></div><div class="detail-hero" style="--tile:${recipe.palette[0]}">${recipePicture(recipe, true)}</div><p class="photo-credit"><a href="assets/recipes/credits.html" target="_blank" rel="noreferrer">เครดิตภาพอาหาร ↗</a></p><div class="detail-content"><div class="detail-tags"><span class="tag">${escapeHTML(recipe.category)}</span><span class="cook-time">◷ ${recipe.time} นาที</span>${budgetLabel(recipe)}${recipe.custom ? '<span class="mini-badge mine">สูตรของฉัน</span>' : ''}</div><h2 id="detail-title">${escapeHTML(recipe.name)}</h2><p class="detail-jp">${escapeHTML(recipe.jp)}</p><p class="detail-intro">${escapeHTML(recipe.description)}</p><div class="recipe-meta"><div>เวลา<strong>${recipe.time} นาที</strong></div><div>ปริมาณ<strong>${escapeHTML(scaleText(recipe.servings, state.scale))}</strong></div><div>ระดับ<strong>${escapeHTML(recipe.difficulty)}</strong></div></div>${typeof whenBlock === 'function' ? whenBlock(recipe) : ''}<div class="detail-section-title"><h3>เตรียมวัตถุดิบ</h3><span>แตะเพื่อเช็กของที่มี</span></div><div class="scale-bar" role="group" aria-label="ปรับปริมาณ"><span>ปริมาณ</span>${[0.5, 1, 2, 3].map((f) => `<button type="button" data-scale="${f}" class="${state.scale === f ? 'is-active' : ''}" aria-pressed="${state.scale === f}">${f === 0.5 ? '½' : f}×</button>`).join('')}</div>${riceNote}<div class="ingredient-list">${recipe.ingredients
    .map((item) => scaleText(item, state.scale))
    .map(
      (ingredient, index) =>
        `<label class="ingredient"><input type="checkbox" aria-label="เช็ก ${escapeHTML(ingredient)}" />${escapeHTML(ingredient)}</label>`
    )
    .join(
      ''
    )}</div><button class="ghost-button add-shop" data-add-shop="${recipe.id}" type="button">${icon('cart')}<span>เพิ่มวัตถุดิบลงรายการซื้อของ</span></button>${substitutionBlock(recipe)}<div class="detail-section-title"><h3>วิธีทำ</h3><span>${recipe.steps.length} ขั้นตอน</span></div><ol class="steps-list">${recipe.steps.map((step) => `<li>${gloss(step)}</li>`).join('')}</ol><p class="cook-hint"><strong>ทิปหม้อไฟฟ้า:</strong> ${gloss(recipe.tip)}</p>${detailExtras(recipe)}<div class="detail-section-title"><h3>โน้ตของฉัน</h3><span data-note-status>บันทึกอัตโนมัติ</span></div><textarea class="recipe-note" data-note="${recipe.id}" rows="3" placeholder="เช่น รอบหน้าลดโชยุลงนิดนึง หม้อเราเดือดเร็ว">${escapeHTML(notes[recipe.id] || '')}</textarea><button class="start-cooking" data-start="${recipe.id}" type="button">เริ่มทำทีละขั้น <span aria-hidden="true">→</span></button></div></section></div>`;
  attachPhotoFallbacks(overlayRoot);
  const panel = overlayRoot.querySelector('.detail-panel');
  panel.focus({ preventScroll: true });
  panel.scrollTop = prevScroll;
}
const ICONS = {
  moon: "<path d='M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z'/>",
  sun: "<circle cx='12' cy='12' r='4'/><path d='M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4'/>",
  download:
    "<path d='M12 4v11M7.5 10.5 12 15l4.5-4.5'/><path d='M5 17v1.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V17'/>",
  upload:
    "<path d='M12 15V4M7.5 8.5 12 4l4.5 4.5'/><path d='M5 17v1.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V17'/>",
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  cart: '<path d="M3 4h2.2l2.1 10.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="3.5"/><circle cx="9" cy="9" r=".9" fill="currentColor"/><circle cx="15" cy="15" r=".9" fill="currentColor"/><circle cx="15" cy="9" r=".9" fill="currentColor"/><circle cx="9" cy="15" r=".9" fill="currentColor"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  speaker: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 10 4 4M20 10l-4 4"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  share:
    '<path d="M12 4v11M7.5 8.5 12 4l4.5 4.5"/><path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13"/>',
  swap: '<path d="M5 8h13l-3.5-3.5M19 16H6l3.5 3.5"/>'
};
function icon(name) {
  return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
}
/* ---- Storage helpers ---- */
function readJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* session only */
  }
}

/* ---- Serving scaler ---- */

/* ---- Notes ---- */
const notes = readJSON('onepot-notes', {});
let noteSaveTimer = null;
function saveNote(id, text) {
  if (text.trim()) notes[id] = text;
  else delete notes[id];
  clearTimeout(noteSaveTimer);
  noteSaveTimer = setTimeout(() => {
    writeJSON('onepot-notes', notes);
    const status = overlayRoot.querySelector('[data-note-status]');
    if (status) status.textContent = 'บันทึกแล้ว ✓';
  }, 400);
}

/* ---- Shopping list ---- */
let shopping = readJSON('onepot-shopping', []);
if (!Array.isArray(shopping)) shopping = [];
function saveShopping() {
  writeJSON('onepot-shopping', shopping);
  updateShopCount();
}
function updateShopCount() {
  const el = document.querySelector('#shop-count');
  if (el) el.textContent = String(shopping.filter((i) => !i.done).length);
}
function addRecipeItems(recipe, scale) {
  let added = 0;
  recipe.ingredients
    .map((i) => scaleText(i, scale))
    .forEach((text) => {
      if (!shopping.some((i) => i.text === text && i.recipe === recipe.name)) {
        shopping.push({ text, recipe: recipe.name, done: false });
        added++;
      }
    });
  return added;
}
function addToShopping(recipe) {
  const added = addRecipeItems(recipe, state.scale);
  saveShopping();
  const btn = overlayRoot.querySelector('[data-add-shop]');
  if (btn) {
    btn.classList.add('is-done');
    btn.innerHTML = `<span>${added ? `✓ เพิ่มแล้ว ${added} รายการ` : '✓ มีในรายการอยู่แล้ว'}</span>`;
  }
}
function shoppingText() {
  if (shopMerged)
    return (
      'รายการซื้อของ — หม้อเดียว\n\n' +
      mergedShopping()
        .filter((g) => !g.done)
        .map((g) => `☐ ${g.label}`)
        .join('\n')
    );
  const groups = {};
  shopping.filter((i) => !i.done).forEach((i) => (groups[i.recipe] ??= []).push(i.text));
  return (
    'รายการซื้อของ — หม้อเดียว\n' +
    Object.entries(groups)
      .map(([name, items]) => `\n${name}\n` + items.map((t) => `☐ ${t}`).join('\n'))
      .join('\n')
  );
}
function renderShopping() {
  const prevScroll = overlayRoot.querySelector('.detail-panel')?.scrollTop || 0;
  const groups = {};
  shopping.forEach((item, index) => (groups[item.recipe] ??= []).push({ ...item, index }));
  const modeBar = shopping.length
    ? `<div class="scale-bar" role="group" aria-label="มุมมอง"><span>แสดง</span><button type="button" data-shop-mode="recipe" class="${shopMerged ? '' : 'is-active'}">แยกตามเมนู</button><button type="button" data-shop-mode="merged" class="${shopMerged ? 'is-active' : ''}">รวมของซ้ำ</button></div>`
    : '';
  const mergedBody = `<div class="ingredient-list one-col">${mergedShopping()
    .map(
      (g) =>
        `<label class="ingredient ${g.done ? 'is-done' : ''}"><input type="checkbox" data-shop-merge="${escapeHTML(g.name)}" ${g.done ? 'checked' : ''} /><span>${escapeHTML(g.label)}<small>${escapeHTML(g.recipes.join(', '))}</small></span></label>`
    )
    .join('')}</div>`;
  const body =
    shopping.length && shopMerged
      ? modeBar + mergedBody
      : shopping.length
        ? modeBar +
          Object.entries(groups)
            .map(
              ([name, items]) =>
                `<h3 class="shop-group">${escapeHTML(name)}</h3><div class="ingredient-list">${items.map((i) => `<label class="ingredient ${i.done ? 'is-done' : ''}"><input type="checkbox" data-shop-item="${i.index}" ${i.done ? 'checked' : ''} />${escapeHTML(i.text)}</label>`).join('')}</div>`
            )
            .join('')
        : `<div class="empty-state sheet-empty"><span>${icon('cart')}</span><h3>ยังไม่มีของในรายการ</h3><p>เปิดสูตรที่อยากทำ แล้วกด "เพิ่มวัตถุดิบลงรายการซื้อของ"</p></div>`;
  overlayRoot.innerHTML = `<div class="overlay" data-close-overlay><section class="detail-panel" role="dialog" aria-modal="true" aria-labelledby="shop-title" tabindex="-1"><div class="detail-head"><button class="back-button" data-close type="button"><span>←</span> กลับ</button><button class="close-button" data-close type="button" aria-label="ปิด">✕</button></div><div class="detail-content"><p class="eyebrow">ไปตลาดกัน</p><h2 id="shop-title">รายการซื้อของ</h2><p class="detail-intro">ติ๊กของที่ซื้อแล้ว รายการจะเก็บไว้ในเครื่องนี้</p>${body}${shopping.length ? `<div class="sheet-actions"><p class="small-note" data-shop-status aria-live="polite"></p><div class="sheet-buttons"><button class="ghost-button" data-shop-clear-done type="button">ลบที่ซื้อแล้ว</button><button class="ghost-button danger" data-shop-clear type="button">ล้างทั้งหมด</button><button class="primary-button" data-shop-share type="button">${icon('share')}<span>แชร์ / คัดลอก</span></button></div></div>` : ''}</div></section></div>`;
  const panel = overlayRoot.querySelector('.detail-panel');
  panel.focus({ preventScroll: true });
  panel.scrollTop = prevScroll;
}
async function shareShopping() {
  const text = shoppingText();
  const status = overlayRoot.querySelector('[data-shop-status]');
  try {
    if (navigator.share) {
      await navigator.share({ title: 'รายการซื้อของ', text });
      return;
    }
    await navigator.clipboard.writeText(text);
    if (status) status.textContent = 'คัดลอกแล้ว วางในแชทได้เลย ✓';
  } catch (error) {
    if (error?.name !== 'AbortError' && status) status.textContent = 'คัดลอกไม่ได้ ลองใหม่อีกครั้ง';
  }
}

/* ---- Ingredient parsing (merge + step matching) ---- */
let shopMerged = readJSON('onepot-shop-merged', false) === true;
function mergedShopping() {
  return mergeItems(shopping);
}

function stepIngredientsBlock(recipe, stepIndex) {
  const items = stepIngredients(recipe, stepIndex, state.scale);
  if (!items.length) return '';
  return `<div class="step-ingredients"><span>ใช้ในขั้นนี้</span>${items.map((p) => `<em>${escapeHTML(p.text)}</em>`).join('')}</div>`;
}

/* ---- Substitutions ---- */
const SUBSTITUTES = [
  ['มิริน', 'น้ำตาล 1 ช้อนชา + น้ำ 1 ช้อนโต๊ะ แทนมิริน 1 ช้อนโต๊ะ'],
  ['ดาชิ', 'ซุปก้อนไก่หรือผักละลายน้ำ (เค็มกว่า ลดโชยุลงนิด) หรือต้มน้ำกับปลาแห้ง/สาหร่ายคอมบุ 5 นาที'],
  ['โชยุ', 'ซีอิ๊วขาว ใส่ทีละน้อยแล้วชิม เพราะเค็มกว่าเล็กน้อย'],
  ['มิโสะ', 'เต้าเจี้ยวบดละเอียด ใช้ครึ่งเดียวก่อนแล้วชิม'],
  ['ก้อนแกงกะหรี่', 'ผงกะหรี่ 1 ช้อนโต๊ะ + แป้งข้าวโพด 1 ช้อนโต๊ะละลายน้ำ + น้ำตาลและโชยุนิดหน่อย ต่อ 1 ก้อน'],
  ['เต้าหู้ทอดปรุงรส', 'เต้าหู้ทอดธรรมดา ต้มกับโชยุ มิริน และน้ำตาลอย่างละ 1 ช้อนชา 3 นาที'],
  ['มายองเนส', 'มายองเนสทั่วไป + น้ำส้มสายชูเล็กน้อย ให้เปรี้ยวแบบญี่ปุ่น'],
  ['เส้นอุด้ง', 'อุด้งสดหรือแห้ง ต้มตามเวลาบนซอง'],
  ['บะหมี่ราเมง', 'บะหมี่กึ่งสำเร็จรูป (ไม่ใช้ผงปรุงในซอง)'],
  ['วากาเมะ', 'สาหร่ายห่อข้าวฉีกชิ้นเล็ก ใส่ตอนท้ายสุด'],
  ['นมจืด', 'นมถั่วเหลืองจืด'],
  ['เนื้อวัวสไลซ์', 'หมูสไลซ์ ต้มจนสุกทั่ว'],
  ['หมูสไลซ์', 'ไก่หั่นบาง ต้มนานขึ้นจนสุกทั่ว'],
  ['สะโพกไก่', 'อกไก่หั่นชิ้นเล็ก ระวังอย่าต้มนานจนแข็ง'],
  ['ข้าวสวย', 'ข้าวสวยพร้อมทานแบบถ้วย อุ่นตามฉลาก']
];
function substitutionBlock(recipe) {
  const rows = SUBSTITUTES.filter(([key]) => recipe.ingredients.some((i) => i.includes(key)));
  if (!rows.length) return '';
  return `<details class="subs"><summary>${icon('swap')}<span>ไม่มีของ? ใช้อะไรแทนได้</span><b>${rows.length}</b></summary><ul>${rows.map(([key, tip]) => `<li><strong>${escapeHTML(key)}</strong> → ${escapeHTML(tip)}</li>`).join('')}</ul></details>`;
}

/* ---- Read steps aloud ---- */
const speech = { on: false, lastSpoken: '', voice: null };
function thaiVoice() {
  if (!('speechSynthesis' in window)) return null;
  const prefix = document.documentElement.lang === 'en' ? 'en' : 'th';
  return speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith(prefix)) || null;
}
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = document.documentElement.lang === 'en' ? 'en-US' : 'th-TH';
  u.rate = 0.95;
  const v = thaiVoice();
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  speech.lastSpoken = '';
}
function toggleSpeech() {
  if (!('speechSynthesis' in window)) {
    alert('เบราว์เซอร์นี้อ่านออกเสียงไม่ได้');
    return;
  }
  speech.on = !speech.on;
  speech.lastSpoken = '';
  if (!speech.on) stopSpeaking();
  else if (!thaiVoice())
    setTimeout(() => {
      if (!thaiVoice())
        alert(
          'เครื่องนี้อาจยังไม่มีเสียงภาษาไทย ติดตั้งได้ที่ การตั้งค่า > เวลาและภาษา > เสียงพูด (Windows) หรือ การตั้งค่าแปลงข้อความเป็นเสียง (Android)'
        );
    }, 400);
  renderCooking();
}
if ('speechSynthesis' in window) speechSynthesis.getVoices();

/* ---- Week plan ---- */
const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสฯ', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
let plan = readJSON('onepot-plan', {});
if (typeof plan !== 'object' || Array.isArray(plan) || !plan) plan = {};
function savePlan() {
  writeJSON('onepot-plan', plan);
}
function renderPlan() {
  const count = DAYS.filter((d) => plan[d]).length;
  overlayRoot.innerHTML = `<div class="overlay" data-close-overlay><section class="detail-panel" role="dialog" aria-modal="true" aria-labelledby="plan-title" tabindex="-1"><div class="detail-head"><button class="back-button" data-close type="button"><span>←</span> กลับ</button><button class="close-button" data-close type="button" aria-label="ปิด">✕</button></div><div class="detail-content"><p class="eyebrow">วางแผนล่วงหน้า</p><h2 id="plan-title">เมนูประจำสัปดาห์</h2><p class="detail-intro">เลือกเมนูให้แต่ละวัน แล้วส่งวัตถุดิบทั้งหมดไปที่รายการซื้อของได้ในครั้งเดียว</p><div class="plan-list">${DAYS.map(
    (day) => {
      const r = recipes.find((x) => x.id === plan[day]);
      const today = DAYS[(new Date().getDay() + 6) % 7] === day;
      return `<div class="plan-row ${today ? 'is-today' : ''}"><span class="plan-day">${day}${today ? '<small>วันนี้</small>' : ''}</span><select data-plan-day="${day}" aria-label="เมนูวัน${day}"><option value="">— ยังไม่เลือก —</option>${recipes.map((x) => `<option value="${x.id}" ${plan[day] === x.id ? 'selected' : ''}>${escapeHTML(x.name)} • ${x.time} นาที</option>`).join('')}</select>${r ? `<button class="ghost-button small" data-plan-open="${r.id}" type="button">ดูสูตร</button>` : '<span></span>'}</div>`;
    }
  ).join(
    ''
  )}</div><div class="sheet-actions"><p class="small-note" data-plan-status aria-live="polite">${count ? `วางแผนแล้ว ${count}/7 วัน • รวม ${DAYS.reduce((t, d) => t + (recipes.find((x) => x.id === plan[d])?.time || 0), 0)} นาที` : ''}</p><div class="sheet-buttons"><button class="ghost-button" data-plan-clear type="button">ล้างแผน</button><button class="ghost-button" data-plan-random type="button">${icon('dice')}<span>สุ่มทั้งสัปดาห์</span></button><button class="primary-button" data-plan-shop type="button" ${count ? '' : 'disabled'}>${icon('cart')}<span>ส่งไปรายการซื้อของ</span></button></div></div></div></section></div>`;
  overlayRoot.querySelector('.detail-panel').focus();
}
function randomPlan() {
  const pool = [...recipes].sort(() => Math.random() - 0.5);
  DAYS.forEach((d, i) => (plan[d] = pool[i % pool.length].id));
  savePlan();
  renderPlan();
}
function planToShopping() {
  let added = 0;
  DAYS.forEach((d) => {
    const r = recipes.find((x) => x.id === plan[d]);
    if (r) added += addRecipeItems(r, 1);
  });
  saveShopping();
  const status = overlayRoot.querySelector('[data-plan-status]');
  if (status)
    status.textContent = added
      ? `✓ เพิ่มแล้ว ${added} รายการ ดูได้ที่ปุ่ม “ซื้อของ” ด้านบน`
      : '✓ ทุกอย่างอยู่ในรายการซื้อของแล้ว';
}

/* ---- Random pick ---- */
function randomRecipe(trigger) {
  const pool = getVisible().length ? getVisible() : recipes;
  const choices = pool.length > 1 && state.lastRandom ? pool.filter((r) => r.id !== state.lastRandom) : pool;
  const pick = choices[Math.floor(Math.random() * choices.length)];
  state.lastRandom = pick.id;
  openDetail(pick, trigger);
}

function startCooking(recipe) {
  state.recipe = recipe;
  state.step = 0;
  state.cookStarted = Date.now();
  requestWakeLock();
  renderCooking();
}

/* ---- Step timer ---- */
const timer = { end: 0, label: '', interval: null, done: false, total: 0, warned: false };
const baseTitle = document.title;
function timerBlock(stepText) {
  const minutes = stepMinutes(stepText);
  const running = timer.end > 0;
  if (!minutes && !running && !timer.done) return '';
  let inner;
  if (timer.done)
    inner = `<span class="timer-display is-done" aria-live="assertive">ครบเวลาแล้ว!</span><span class="timer-label">${escapeHTML(timer.label)}<br/>ยังไม่สุก? ต่อเวลาได้เลย</span><span class="timer-actions"><button class="timer-btn" data-timer-add="1" type="button">+1 นาที</button><button class="timer-btn" data-timer-add="3" type="button">+3 นาที</button><button class="timer-btn is-primary" data-timer-stop type="button">เสร็จแล้ว</button></span>`;
  else if (running)
    inner = `<span class="timer-display" data-timer-display>${formatTime(timer.end - Date.now())}</span><span class="timer-label" data-timer-label>${escapeHTML(timer.label)}</span><span class="timer-actions"><button class="timer-btn" data-timer-add="1" type="button">+1 นาที</button><button class="timer-btn" data-timer-stop type="button">ยกเลิก</button></span>`;
  else
    inner = `<span class="timer-display">${formatTime(minutes * 60000)}</span><span class="timer-label">ตั้งเวลาขั้นนี้</span><button class="timer-btn is-primary" data-timer-start="${minutes}" type="button">${icon('play')}<span>เริ่มจับเวลา ${minutes} นาที</span></button>`;
  return `<div class="step-timer ${timer.done ? 'done' : ''}" role="timer">${inner}</div>`;
}
function startTimer(minutes) {
  askNotificationPermission();
  stopTimer(false);
  timer.total = minutes * 60000;
  timer.warned = false;
  timer.end = Date.now() + minutes * 60000;
  timer.label = `STEP ${String(state.step + 1).padStart(2, '0')} • ${minutes} นาที`;
  timer.interval = setInterval(tickTimer, 250);
  unlockAudio();
  renderCooking();
}
function addTimer(minutes) {
  unlockAudio();
  if (timer.done || !timer.end) {
    stopAlarm();
    timer.done = false;
    timer.end = Date.now() + minutes * 60000;
    timer.total = minutes * 60000;
    timer.label = `ต่อเวลา +${minutes} นาที`;
    clearInterval(timer.interval);
    timer.interval = setInterval(tickTimer, 250);
  } else {
    timer.end += minutes * 60000;
    timer.total += minutes * 60000;
  }
  timer.warned = timer.end - Date.now() <= 60000;
  renderCooking();
}
function tickTimer() {
  const left = timer.end - Date.now();
  const el = overlayRoot.querySelector('[data-timer-display]');
  if (el) el.textContent = formatTime(left);
  if (!timer.warned && left <= 60000 && left > 0 && timer.total > 120000) {
    timer.warned = true;
    beep(1);
    const lb = overlayRoot.querySelector('[data-timer-label]');
    if (lb) lb.innerHTML = '<span class="timer-warn">อีก 1 นาที เตรียมตัวได้เลย</span>';
  }
  document.title = `⏱ ${formatTime(left)} — หม้อเดียว`;
  if (left <= 0) finishTimer();
}
function finishTimer() {
  clearInterval(timer.interval);
  timer.interval = null;
  timer.end = 0;
  timer.done = true;
  document.title = '⏰ ครบเวลา — หม้อเดียว';
  alarm();
  notifyTimerDone();
  if (overlayRoot.querySelector('.cooking-screen')) renderCooking();
}
function stopTimer(rerender = true) {
  clearInterval(timer.interval);
  timer.interval = null;
  timer.end = 0;
  timer.done = false;
  stopAlarm();
  document.title = baseTitle;
  if (rerender && overlayRoot.querySelector('.cooking-screen')) renderCooking();
}
let audioCtx = null,
  alarmLoop = null;
function unlockAudio() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.resume();
  } catch {
    audioCtx = null;
  }
}
function beep(times = 3) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  [0, 0.25, 0.5].slice(0, times).forEach((offset) => {
    const osc = audioCtx.createOscillator(),
      gain = audioCtx.createGain();
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, t + offset);
    gain.gain.exponentialRampToValueAtTime(0.3, t + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.2);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t + offset);
    osc.stop(t + offset + 0.22);
  });
}
function alarm() {
  stopAlarm();
  beep();
  navigator.vibrate?.([300, 150, 300, 150, 300]);
  let count = 0;
  alarmLoop = setInterval(() => {
    beep();
    navigator.vibrate?.([300, 150, 300]);
    if (++count >= 20) stopAlarm();
  }, 1500);
}
function stopAlarm() {
  if (!alarmLoop) return;
  clearInterval(alarmLoop);
  alarmLoop = null;
  try {
    navigator.vibrate?.(0);
  } catch {}
}

/* ---- Keep screen awake while cooking ---- */
let wakeLock = null,
  wantWake = false;
async function requestWakeLock() {
  wantWake = true;
  if (!('wakeLock' in navigator) || wakeLock) return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      wakeLock = null;
    });
  } catch {
    wakeLock = null;
  }
}
function releaseWakeLock() {
  wantWake = false;
  wakeLock?.release().catch(() => {});
  wakeLock = null;
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && wantWake) requestWakeLock();
});
function renderCooking() {
  const recipe = state.recipe;
  if (!recipe) return;
  const finished = state.step >= recipe.steps.length;
  overlayRoot.innerHTML = `<section class="cooking-screen" role="dialog" aria-modal="true" aria-label="โหมดทำอาหาร" tabindex="-1"><header class="cook-top"><button class="back-button" data-stop-cooking type="button"><span>×</span> ออกจากโหมดทำอาหาร</button>${fontButtons()}<button class="speak-toggle ${speech.on ? 'is-active' : ''}" data-speak-toggle type="button" aria-pressed="${speech.on}">${speech.on ? `${icon('speaker')}<span>กำลังอ่านออกเสียง</span>` : `${icon('mute')}<span>อ่านออกเสียง</span>`}</button></header><div class="cook-main ${finished ? 'finish-screen' : ''}">${finished ? finishScreen(recipe) : `<p class="cook-recipe-name">${escapeHTML(recipe.jp)} <span>• ${escapeHTML(recipe.name)}</span></p><div class="progress-track" aria-label="ความคืบหน้า"><span style="width:${Math.round(((state.step + 1) / recipe.steps.length) * 100)}%"></span></div><p class="step-count" aria-live="polite">STEP ${String(state.step + 1).padStart(2, '0')} <span style="color:#aaa">/ ${String(recipe.steps.length).padStart(2, '0')}</span></p><h1 class="cook-step-text" tabindex="-1">${gloss(recipe.steps[state.step])}</h1>${stepIngredientsBlock(recipe, state.step)}${timerBlock(recipe.steps[state.step])}<p class="cook-hint"><strong>ทิปหม้อไฟฟ้า:</strong> ${escapeHTML(recipe.tip)}</p><div class="cook-controls"><button data-prev-step type="button" ${state.step === 0 ? 'disabled' : ''}>← ก่อนหน้า</button><button class="next-step" data-next-step type="button">${state.step === recipe.steps.length - 1 ? 'เสร็จแล้ว ✓' : 'ขั้นต่อไป →'}</button></div>`}</div></section>`;
  overlayRoot.querySelector(finished ? '.finish-screen h2' : '.cook-step-text').focus();
  if (finished) clearSession();
  else saveSession();
  if (speech.on && speech.lastSpoken !== `${recipe.id}:${state.step}`) {
    speech.lastSpoken = `${recipe.id}:${state.step}`;
    speak(finished ? 'เสร็จแล้ว อร่อยได้เลย' : `ขั้นที่ ${state.step + 1}. ${recipe.steps[state.step]}`);
  }
}

render();
document.querySelector('#filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (button) {
    state.category = button.dataset.category;
    render();
  }
});
search.addEventListener('input', () => {
  state.query = search.value;
  render();
});
document.querySelector('#saved-toggle').addEventListener('click', (event) => {
  state.savedOnly = !state.savedOnly;
  event.currentTarget.setAttribute('aria-pressed', String(state.savedOnly));
  render();
});
document.querySelector('#clear-search').addEventListener('click', () => {
  state.query = '';
  state.category = 'ทั้งหมด';
  state.savedOnly = false;
  state.quick = false;
  search.value = '';
  render();
});
grid.addEventListener('click', (event) => {
  const save = event.target.closest('[data-save]');
  if (save) {
    event.stopPropagation();
    saveRecipe(save.dataset.save);
    return;
  }
  const card = event.target.closest('[data-open]');
  if (card) {
    const recipe = recipes.find((item) => item.id === card.dataset.open);
    if (recipe) openDetail(recipe, card);
  }
});
overlayRoot.addEventListener('click', (event) => {
  if (event.target.matches('[data-close-overlay]') || event.target.closest('[data-close]')) {
    closeDetail();
    return;
  }
  const start = event.target.closest('[data-start]');
  if (start) {
    const recipe = recipes.find((item) => item.id === start.dataset.start);
    if (recipe) startCooking(recipe);
    return;
  }
  if (event.target.closest('[data-stop-cooking]')) {
    renderDetail(state.recipe);
    return;
  }
  if (event.target.closest('[data-speak-toggle]')) {
    toggleSpeech();
    return;
  }
  const sm = event.target.closest('[data-shop-mode]');
  if (sm) {
    shopMerged = sm.dataset.shopMode === 'merged';
    writeJSON('onepot-shop-merged', shopMerged);
    renderShopping();
    return;
  }
  if (event.target.closest('[data-plan-shop]')) {
    planToShopping();
    return;
  }
  if (event.target.closest('[data-plan-random]')) {
    randomPlan();
    return;
  }
  if (event.target.closest('[data-plan-clear]')) {
    plan = {};
    savePlan();
    renderPlan();
    return;
  }
  const po = event.target.closest('[data-plan-open]');
  if (po) {
    const r = recipes.find((x) => x.id === po.dataset.planOpen);
    if (r) openDetail(r, document.querySelector('#plan-toggle'));
    return;
  }
  const sc = event.target.closest('[data-scale]');
  if (sc) {
    state.scale = Number(sc.dataset.scale);
    renderDetail(state.recipe);
    return;
  }
  const as = event.target.closest('[data-add-shop]');
  if (as) {
    addToShopping(state.recipe);
    return;
  }
  if (event.target.closest('[data-shop-share]')) {
    shareShopping();
    return;
  }
  if (event.target.closest('[data-shop-clear-done]')) {
    shopping = shopping.filter((i) => !i.done);
    saveShopping();
    renderShopping();
    return;
  }
  if (event.target.closest('[data-shop-clear]')) {
    if (confirm('ล้างรายการซื้อของทั้งหมด?')) {
      shopping = [];
      saveShopping();
      renderShopping();
    }
    return;
  }
  const ts = event.target.closest('[data-timer-start]');
  if (ts) {
    startTimer(Number(ts.dataset.timerStart));
    return;
  }
  if (event.target.closest('[data-timer-stop]')) {
    stopTimer();
    return;
  }
  const ta = event.target.closest('[data-timer-add]');
  if (ta) {
    addTimer(Number(ta.dataset.timerAdd));
    return;
  }
  if (event.target.closest('[data-prev-step]')) {
    state.step = Math.max(0, state.step - 1);
    renderCooking();
    return;
  }
  if (event.target.closest('[data-next-step]')) {
    state.step = Math.min(state.recipe.steps.length, state.step + 1);
    renderCooking();
  }
});
document.addEventListener('keydown', (event) => {
  if (overlayRoot.querySelector('.cooking-screen') && !event.target.closest?.('input,textarea,select')) {
    if (event.key === 'ArrowRight') {
      overlayRoot.querySelector('[data-next-step]')?.click();
      return;
    }
    if (event.key === 'ArrowLeft') {
      overlayRoot.querySelector('[data-prev-step]:not(:disabled)')?.click();
      return;
    }
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    search.focus();
  }
  if (event.key === 'Escape' && !state.recipe && overlayRoot.innerHTML) {
    closeDetail();
    return;
  }
  if (event.key === 'Escape' && state.recipe) {
    if (overlayRoot.querySelector('.cooking-screen')) renderDetail(state.recipe);
    else closeDetail();
    return;
  }
  if (event.key === 'Tab') {
    const dialog = overlayRoot.querySelector('.detail-panel,.cooking-screen');
    if (!dialog) return;
    const focusable = [
      ...dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),[href],[tabindex]:not([tabindex="-1"])')
    ];
    if (!focusable.length) return;
    const first = focusable[0],
      last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

/* ---- PWA: offline + installable ---- */
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', async () => {
    const hadController = !!navigator.serviceWorker.controller;
    try {
      const reg = await navigator.serviceWorker.register('sw.js');
      // A new version took over while the app was open → offer a reload (not on the very first install)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hadController) showUpdateBar();
      });
      // Check for a new version whenever the app comes back to the front
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(() => {});
      });
    } catch {
      /* offline support is optional */
    }
  });
}
function showUpdateBar() {
  if (document.querySelector('.update-bar')) return;
  const bar = document.createElement('div');
  bar.className = 'update-bar';
  bar.setAttribute('role', 'status');
  bar.innerHTML = `<p>มีเวอร์ชันใหม่<small>แตะเพื่อโหลดของใหม่ ข้อมูลของคุณไม่หาย</small></p><button class="primary-button" type="button" data-update-now>โหลดเลย</button><button class="resume-dismiss" type="button" aria-label="ไว้ทีหลัง">✕</button>`;
  bar.querySelector('[data-update-now]').addEventListener('click', () => location.reload());
  bar.querySelector('.resume-dismiss').addEventListener('click', () => bar.remove());
  document.body.appendChild(bar);
}

/* ---- System notification when a timer ends while the app is in the background ---- */
function askNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default')
    Notification.requestPermission().catch?.(() => {});
}
function notifyTimerDone() {
  if (!('Notification' in window) || Notification.permission !== 'granted' || document.visibilityState === 'visible')
    return;
  const t = (s) => (typeof tr === 'function' ? tr(s) : s);
  const body = [state.recipe?.name, timer.label].filter(Boolean).join(' • ');
  const options = {
    body: t(body),
    tag: 'onepot-timer',
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 150, 300, 150, 300],
    icon: 'assets/icons/icon-192.png',
    badge: 'assets/icons/icon-192.png'
  };
  navigator.serviceWorker?.ready
    .then((reg) => reg.showNotification(t('ครบเวลาแล้ว!'), options))
    .catch(() => {
      try {
        new Notification(t('ครบเวลาแล้ว!'), options);
      } catch {}
    });
}
overlayRoot.addEventListener('input', (event) => {
  const note = event.target.closest('[data-note]');
  if (note) saveNote(note.dataset.note, note.value);
});
overlayRoot.addEventListener('change', (event) => {
  const pd = event.target.closest('[data-plan-day]');
  if (pd) {
    if (pd.value) plan[pd.dataset.planDay] = pd.value;
    else delete plan[pd.dataset.planDay];
    savePlan();
    renderPlan();
    overlayRoot.querySelector(`[data-plan-day="${pd.dataset.planDay}"]`)?.focus();
    return;
  }
  const mg = event.target.closest('[data-shop-merge]');
  if (mg) {
    shopping.forEach((i) => {
      if (parseIngredient(i.text).name === mg.dataset.shopMerge) i.done = mg.checked;
    });
    saveShopping();
    renderShopping();
    return;
  }
  const item = event.target.closest('[data-shop-item]');
  if (item) {
    const entry = shopping[Number(item.dataset.shopItem)];
    if (entry) {
      entry.done = item.checked;
      saveShopping();
      item.closest('.ingredient').classList.toggle('is-done', item.checked);
    }
  }
});
document.querySelector('#shop-toggle').addEventListener('click', (event) => {
  state.recipe = null;
  state.returnFocus = event.currentTarget;
  renderShopping();
});
document.querySelector('#quick-toggle').addEventListener('click', () => {
  state.quick = !state.quick;
  render();
});
document.querySelector('#random-pick').addEventListener('click', (event) => randomRecipe(event.currentTarget));
updateShopCount();
document.querySelector('#plan-toggle').addEventListener('click', (event) => {
  state.recipe = null;
  state.returnFocus = event.currentTarget;
  renderPlan();
});

/* ---- Resume an unfinished cooking session ---- */
function saveSession() {
  if (!state.recipe) return;
  writeJSON('onepot-session', {
    id: state.recipe.id,
    step: state.step,
    scale: state.scale,
    timerEnd: timer.end,
    timerTotal: timer.total,
    timerLabel: timer.label,
    at: Date.now()
  });
}
function clearSession() {
  try {
    localStorage.removeItem('onepot-session');
  } catch {}
  document.querySelector('.resume-bar')?.remove();
}
function resumeSession(session) {
  const recipe = recipes.find((r) => r.id === session.id);
  if (!recipe) return clearSession();
  document.querySelector('.resume-bar')?.remove();
  state.recipe = recipe;
  state.step = Math.min(session.step | 0, recipe.steps.length - 1);
  state.scale = [0.5, 1, 2, 3].includes(session.scale) ? session.scale : 1;
  state.returnFocus = null;
  if (session.timerEnd) {
    timer.label = session.timerLabel || '';
    timer.total = session.timerTotal || 0;
    if (session.timerEnd > Date.now()) {
      timer.end = session.timerEnd;
      timer.warned = session.timerEnd - Date.now() <= 60000;
      clearInterval(timer.interval);
      timer.interval = setInterval(tickTimer, 250);
    } else {
      timer.done = true;
      timer.label = (session.timerLabel || '') + ' (หมดเวลาระหว่างที่ปิดแอป)';
    }
  }
  unlockAudio();
  requestWakeLock();
  renderCooking();
}
(function offerResume() {
  const session = readJSON('onepot-session', null);
  if (!session || typeof session !== 'object') return;
  const recipe = recipes.find((r) => r.id === session.id);
  if (!recipe || Date.now() - session.at > 12 * 3600000) return clearSession();
  const left = session.timerEnd ? session.timerEnd - Date.now() : 0;
  const note = session.timerEnd ? (left > 0 ? ` • ตัวจับเวลาเหลือ ${formatTime(left)}` : ' • ตัวจับเวลาหมดแล้ว') : '';
  const bar = document.createElement('div');
  bar.className = 'resume-bar';
  bar.setAttribute('role', 'status');
  bar.innerHTML = `<p>ทำ${escapeHTML(recipe.name)}ค้างไว้<small>ขั้นที่ ${(session.step | 0) + 1} จาก ${recipe.steps.length}${note}</small></p><button class="primary-button" type="button" data-resume>ทำต่อ</button><button class="resume-dismiss" type="button" aria-label="ไม่ทำต่อ" data-resume-dismiss>✕</button>`;
  bar.addEventListener('click', (event) => {
    if (event.target.closest('[data-resume]')) resumeSession(session);
    else if (event.target.closest('[data-resume-dismiss]')) clearSession();
  });
  document.body.appendChild(bar);
})();

/* ---- Backup / restore ---- */
const BACKUP_KEYS = [
  'onepot-saved',
  'onepot-notes',
  'onepot-shopping',
  'onepot-shop-merged',
  'onepot-plan',
  'onepot-theme'
];
function exportData() {
  const data = {};
  BACKUP_KEYS.forEach((k) => {
    try {
      const v = localStorage.getItem(k);
      if (v != null) data[k] = JSON.parse(v);
    } catch {}
  });
  const blob = new Blob(
    [JSON.stringify({ app: 'onepot', version: 1, exportedAt: new Date().toISOString(), data }, null, 2)],
    { type: 'application/json' }
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `moh-diao-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
async function importData(file) {
  try {
    const parsed = JSON.parse(await file.text());
    if (parsed?.app !== 'onepot' || typeof parsed.data !== 'object') throw new Error('bad');
    const keys = Object.keys(parsed.data).filter((k) => BACKUP_KEYS.includes(k));
    if (!keys.length) throw new Error('empty');
    if (!confirm(`นำเข้าข้อมูลจากไฟล์นี้? ข้อมูลเดิมในเครื่องนี้ (${keys.length} หมวด) จะถูกแทนที่`)) return;
    keys.forEach((k) => writeJSON(k, parsed.data[k]));
    alert('นำเข้าเรียบร้อย ✓');
    location.reload();
  } catch {
    alert('ไฟล์นี้ไม่ใช่ไฟล์สำรองของหม้อเดียว');
  }
}
document.querySelector('#export-data').addEventListener('click', exportData);
document.querySelector('#import-data').addEventListener('click', () => document.querySelector('#import-file').click());
document.querySelector('#import-file').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) importData(file);
  event.target.value = '';
});

/* ---- Theme ---- */
const themeQuery = matchMedia('(prefers-color-scheme: dark)');
function currentTheme() {
  return document.documentElement.dataset.theme || (themeQuery.matches ? 'dark' : 'light');
}
function paintThemeButton() {
  const btn = document.querySelector('#theme-toggle');
  const dark = currentTheme() === 'dark';
  btn.innerHTML = icon(dark ? 'sun' : 'moon');
  btn.setAttribute('aria-label', dark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด');
  document.querySelector('meta[name="theme-color"]').setAttribute('content', dark ? '#1b1a17' : '#f7f4ed');
}
document.querySelector('#theme-toggle').addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  writeJSON('onepot-theme', next);
  paintThemeButton();
});
themeQuery.addEventListener?.('change', paintThemeButton);
paintThemeButton();
