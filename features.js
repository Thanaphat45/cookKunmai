/* หม้อเดียว — extra features, loaded after app.js (shares its globals). */

/* =============== Custom recipes (1) =============== */
const CUSTOM_PALETTE = ['#e8e1cf', '#718457', '#d9ad55', '#b34b35', '#f5e7c8'];
const CATEGORIES = ['ข้าว', 'ซุป', 'หม้อไฟ', 'ของเคียง', 'ของหวาน'];
let customRecipes = readJSON('onepot-custom', []);
if (!Array.isArray(customRecipes)) customRecipes = [];
customRecipes.forEach((r) => {
  r.custom = true;
  r.palette = CUSTOM_PALETTE;
  recipes.push(r);
});

function saveCustom() {
  try {
    localStorage.setItem('onepot-custom', JSON.stringify(customRecipes.map(({ custom, palette, ...rest }) => rest)));
    return true;
  } catch {
    alert('พื้นที่เก็บข้อมูลในเบราว์เซอร์เต็ม ลองใช้รูปที่เล็กลงหรือไม่ใส่รูป');
    return false;
  }
}

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const max = 720,
        scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

let formPhoto = null;
function renderRecipeForm(existing) {
  const r = existing || {
    name: '',
    jp: '',
    category: 'ข้าว',
    time: 20,
    servings: '1–2 ที่',
    difficulty: 'เริ่มง่าย',
    description: '',
    ingredients: [],
    steps: [],
    tip: '',
    budget: 1
  };
  formPhoto = r.photo || null;
  const opt = (list, value) =>
    list.map((v) => `<option ${String(v) === String(value) ? 'selected' : ''}>${escapeHTML(v)}</option>`).join('');
  state.recipe = null;
  overlayRoot.innerHTML = `<div class="overlay" data-close-overlay><section class="detail-panel" role="dialog" aria-modal="true" aria-labelledby="form-title" tabindex="-1"><div class="detail-head"><button class="back-button" data-close type="button"><span>←</span> ยกเลิก</button><button class="close-button" data-close type="button" aria-label="ปิด">✕</button></div>
  <form class="detail-content recipe-form" data-recipe-form="${existing ? escapeHTML(existing.id) : ''}" novalidate>
    <p class="eyebrow">สูตรของฉัน</p><h2 id="form-title">${existing ? 'แก้ไขสูตร' : 'เพิ่มสูตรใหม่'}</h2>
    <div class="import-box"><button type="button" class="ghost-button small" data-import-toggle aria-expanded="false">วางสูตรจากข้อความ</button>
      <div class="import-body" hidden><p class="field-hint">วางสูตรที่ก๊อปมาจากเว็บหรือแชท บรรทัดแรกคือชื่อเมนู แล้วมีหัวข้อ “วัตถุดิบ” กับ “วิธีทำ”</p><textarea data-import-text rows="7" aria-label="ข้อความสูตร" placeholder="ข้าวผัดไข่&#10;&#10;วัตถุดิบ&#10;- ข้าวสวย 1 ถ้วย&#10;- ไข่ไก่ 1 ฟอง&#10;&#10;วิธีทำ&#10;1. ตีไข่&#10;2. ผัดกับข้าว 3 นาที"></textarea><button type="button" class="primary-button" data-import-run>แยกใส่ฟอร์มให้</button><p class="field-hint" data-import-status aria-live="polite"></p></div></div>
    <label class="field photo-field"><span>รูปอาหาร (ไม่ใส่ก็ได้)</span><div class="photo-drop" data-photo-preview>${formPhoto ? `<img src="${formPhoto}" alt="" />` : '<em>แตะเพื่อเลือกรูป</em>'}</div><input type="file" accept="image/*" data-photo-input hidden /></label>
    <label class="field"><span>ชื่อเมนู *</span><input name="name" required maxlength="60" value="${escapeHTML(r.name)}" placeholder="เช่น ข้าวผัดไข่หม้อไฟฟ้า" /></label>
    <label class="field"><span>ชื่อญี่ปุ่น / ชื่อรอง</span><input name="jp" maxlength="60" value="${escapeHTML(r.jp || '')}" /></label>
    <div class="field-row">
      <label class="field"><span>หมวด</span><select name="category">${opt(CATEGORIES, r.category)}</select></label>
      <label class="field"><span>เวลา (นาที)</span><input name="time" type="number" min="1" max="600" value="${r.time}" /></label>
    </div>
    <div class="field-row">
      <label class="field"><span>ปริมาณ</span><input name="servings" maxlength="20" value="${escapeHTML(r.servings)}" /></label>
      <label class="field"><span>ระดับ</span><select name="difficulty">${opt(['เริ่มง่าย', 'สบาย ๆ', 'ปานกลาง'], r.difficulty)}</select></label>
      <label class="field"><span>งบ</span><select name="budget">${[1, 2, 3].map((b) => `<option value="${b}" ${r.budget == b ? 'selected' : ''}>${'฿'.repeat(b)}</option>`).join('')}</select></label>
    </div>
    <label class="field"><span>คำอธิบายสั้น ๆ</span><input name="description" maxlength="140" value="${escapeHTML(r.description)}" /></label>
    <label class="field"><span>วัตถุดิบ * <small>บรรทัดละ 1 อย่าง ใส่ตัวเลขไว้ด้วยจะปรับปริมาณได้ เช่น “ไข่ไก่ 2 ฟอง”</small></span><textarea name="ingredients" rows="5">${escapeHTML(r.ingredients.join('\n'))}</textarea></label>
    <label class="field"><span>วิธีทำ * <small>บรรทัดละ 1 ขั้น ใส่ “… 10 นาที” จะมีปุ่มจับเวลาให้</small></span><textarea name="steps" rows="6">${escapeHTML(r.steps.join('\n'))}</textarea></label>
    <label class="field"><span>ทิปหม้อไฟฟ้า</span><input name="tip" maxlength="160" value="${escapeHTML(r.tip)}" /></label>
    <p class="form-error" data-form-error aria-live="assertive"></p>
    <div class="sheet-actions"><div class="sheet-buttons"><button class="ghost-button" data-close type="button">ยกเลิก</button><button class="primary-button" type="submit">บันทึกสูตร</button></div></div>
  </form></section></div>`;
  overlayRoot.querySelector('.detail-panel').focus();
}

async function submitRecipeForm(form) {
  const f = new FormData(form);
  const lines = (key) =>
    String(f.get(key) || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  const data = {
    name: String(f.get('name')).trim(),
    jp: String(f.get('jp')).trim(),
    category: f.get('category'),
    time: Math.max(1, Math.min(600, Number(f.get('time')) || 20)),
    servings: String(f.get('servings')).trim() || '1 ที่',
    difficulty: f.get('difficulty'),
    budget: Number(f.get('budget')) || 1,
    description: String(f.get('description')).trim(),
    ingredients: lines('ingredients'),
    steps: lines('steps'),
    tip: String(f.get('tip')).trim() || 'ปรับไฟตามหม้อของคุณ ปรุงเนื้อสัตว์ให้สุกทั่ว',
    photo: formPhoto || undefined
  };
  const err = form.querySelector('[data-form-error]');
  if (!data.name) {
    err.textContent = 'ใส่ชื่อเมนูก่อนนะ';
    form.name.focus();
    return;
  }
  if (!data.ingredients.length) {
    err.textContent = 'ใส่วัตถุดิบอย่างน้อย 1 อย่าง';
    form.ingredients.focus();
    return;
  }
  if (!data.steps.length) {
    err.textContent = 'ใส่วิธีทำอย่างน้อย 1 ขั้น';
    form.steps.focus();
    return;
  }
  const editId = form.dataset.recipeForm;
  let recipe;
  if (editId) {
    recipe = recipes.find((x) => x.id === editId);
    const backup = { ...recipe };
    Object.assign(recipe, data);
    if (!saveCustom()) {
      Object.assign(recipe, backup);
      return;
    }
  } else {
    recipe = { id: 'c-' + Date.now().toString(36), ...data, custom: true, palette: CUSTOM_PALETTE };
    customRecipes.push(recipe);
    recipes.push(recipe);
    if (!saveCustom()) {
      customRecipes.pop();
      recipes.pop();
      return;
    }
  }
  render();
  openDetail(recipe, null);
}

function deleteCustom(id) {
  const recipe = recipes.find((x) => x.id === id);
  if (!recipe || !confirm(`ลบสูตร “${recipe.name}” ใช่ไหม? ลบแล้วกู้คืนไม่ได้`)) return;
  recipes.splice(recipes.indexOf(recipe), 1);
  customRecipes = customRecipes.filter((x) => x.id !== id);
  saveCustom();
  closeDetail();
  render();
}

/* =============== Import a recipe from pasted text =============== */
const HEAD_ING = /^(?:วัตถุดิบ|ส่วนผสม|เครื่องปรุง|ingredients?)\s*[:：]?\s*$/i;
const HEAD_STEP = /^(?:วิธีทำ|วิธีการทำ|ขั้นตอน(?:การทำ)?|method|directions|instructions|steps)\s*[:：]?\s*$/i;
const HEAD_TIP = /^(?:ทิป|เคล็ดลับ|หมายเหตุ|tips?|notes?)\s*[:：]?\s*(.*)$/i;
const BULLET = /^\s*(?:[-–•*·▪︎✓]|\(?\d{1,2}[.)]|[๐-๙]{1,2}[.)]|step\s*\d+[:.)]?)\s*/i;
function parseRecipeText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const out = { name: '', ingredients: [], steps: [], tip: '', time: 0 };
  let section = 'head';
  for (const line of lines) {
    if (HEAD_ING.test(line)) {
      section = 'ing';
      continue;
    }
    if (HEAD_STEP.test(line)) {
      section = 'step';
      continue;
    }
    const tip = line.match(HEAD_TIP);
    if (tip) {
      section = 'tip';
      if (tip[1]) out.tip = tip[1];
      continue;
    }
    const clean = line.replace(BULLET, '').trim();
    if (!clean) continue;
    if (section === 'head') {
      const t = clean.match(/(?:ใช้เวลา|เวลา|time)\D{0,6}(\d+)\s*(?:นาที|min)/i);
      if (t) out.time = Number(t[1]);
      else if (!out.name) out.name = clean.slice(0, 60);
    } else if (section === 'ing') out.ingredients.push(clean);
    else if (section === 'step') out.steps.push(clean);
    else out.tip = (out.tip ? out.tip + ' ' : '') + clean;
  }
  // No headings at all: name = first line, short lines with numbers = ingredients, the rest = steps
  if (!out.ingredients.length && !out.steps.length) {
    const rest = lines
      .slice(1)
      .map((l) => l.replace(BULLET, '').trim())
      .filter(Boolean);
    rest.forEach((l) =>
      (l.length <= 40 && /\d|เล็กน้อย/.test(l) && !/นาที/.test(l) ? out.ingredients : out.steps).push(l)
    );
  }
  if (!out.time) out.time = out.steps.reduce((sum, s) => sum + stepMinutes(s), 0) || 0;
  return out;
}
function runImport(form) {
  const text = form.querySelector('[data-import-text]').value;
  const status = form.querySelector('[data-import-status]');
  const r = parseRecipeText(text);
  if (!r.ingredients.length && !r.steps.length) {
    status.textContent = 'ยังแยกไม่ได้ ลองใส่หัวข้อ “วัตถุดิบ” และ “วิธีทำ”';
    return;
  }
  if (r.name) form.name.value = r.name;
  form.ingredients.value = r.ingredients.join('\n');
  form.steps.value = r.steps.join('\n');
  if (r.tip) form.tip.value = r.tip.slice(0, 160);
  if (r.time) form.time.value = Math.min(600, r.time);
  status.textContent = `✓ ได้วัตถุดิบ ${r.ingredients.length} อย่าง วิธีทำ ${r.steps.length} ขั้น ตรวจก่อนกดบันทึกนะ`;
}

/* =============== “Want to eat at…” start-time calculator =============== */
const pad2 = (n) => String(n).padStart(2, '0');
function defaultEatTime(minutes) {
  const d = new Date(Date.now() + (minutes + 10) * 60000);
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function startTimeText(recipe, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return '';
  const now = new Date();
  const eat = new Date(now);
  eat.setHours(h, m, 0, 0);
  if (eat < now) eat.setDate(eat.getDate() + 1);
  const start = new Date(eat - recipe.time * 60000);
  const lead = Math.round((start - now) / 60000);
  if (lead < 0)
    return `ต้องเริ่มเลยตอนนี้ จะได้กินประมาณ ${pad2(new Date(now.getTime() + recipe.time * 60000).getHours())}:${pad2(new Date(now.getTime() + recipe.time * 60000).getMinutes())}`;
  const inText = lead < 60 ? `อีก ${lead} นาที` : `อีก ${Math.floor(lead / 60)} ชม. ${lead % 60} นาที`;
  return `เริ่มทำตอน <strong>${pad2(start.getHours())}:${pad2(start.getMinutes())}</strong> (${inText})`;
}
function whenBlock(recipe) {
  const value = defaultEatTime(recipe.time);
  return `<div class="when-box"><label for="when-input">อยากกินกี่โมง?</label><input id="when-input" type="time" value="${value}" data-when="${escapeHTML(recipe.id)}" /><span data-when-out>${startTimeText(recipe, value)}</span></div>`;
}

/* =============== History + rating (2) and safety checklist (7) =============== */
let history_ = readJSON('onepot-history', {});
if (typeof history_ !== 'object' || !history_ || Array.isArray(history_)) history_ = {};
const saveHistory = () => writeJSON('onepot-history', history_);
let loggedFinish = '';

function finishScreen(recipe) {
  const key = recipe.id + ':' + (state.cookStarted || '');
  if (loggedFinish !== key) {
    loggedFinish = key;
    const h = history_[recipe.id] || { count: 0, rating: 0 };
    h.count += 1;
    h.last = Date.now();
    history_[recipe.id] = h;
    saveHistory();
  }
  const h = history_[recipe.id];
  const stars = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<button type="button" class="star ${h.rating >= n ? 'is-on' : ''}" data-rate="${n}" aria-label="ให้ ${n} ดาว" aria-pressed="${h.rating >= n}">★</button>`
    )
    .join('');
  const checks = [
    'ปิดสวิตช์และถอดปลั๊กหม้อแล้ว',
    'วางหม้อบนที่ทนร้อน ห่างมือเด็ก',
    'รอให้หม้อเย็นก่อนล้าง และอย่าให้น้ำโดนปลั๊ก'
  ];
  return `<div class="finish-icon">🍚</div><h2 tabindex="-1">เสร็จแล้ว อร่อยได้เลย!</h2><p>${escapeHTML(recipe.name)} พร้อมเสิร์ฟแล้ว • ทำไปแล้ว ${h.count} ครั้ง</p>
  <div class="rate-box"><span>อร่อยแค่ไหน?</span><div class="stars" role="group" aria-label="ให้คะแนน">${stars}</div></div>
  <div class="safety-box"><h3>ก่อนไปกิน เช็กหม้อหน่อย</h3>${checks.map((c) => `<label class="ingredient"><input type="checkbox" data-safety />${c}</label>`).join('')}</div>
  <button class="start-cooking" data-stop-cooking type="button">กลับไปดูสูตร</button>`;
}

/* =============== Budget (9), badges, avoid filter (6) =============== */
const BUDGET = {
  oyakodon: 1,
  gyudon: 2,
  curry: 2,
  zosui: 1,
  udon: 2,
  miso: 1,
  nabe: 2,
  nikujaga: 2,
  ramen: 1,
  'potato-salad': 1
};
const budgetOf = (r) => r.budget || BUDGET[r.id] || 1;
const budgetLabel = (r) =>
  // unused levels are drawn by CSS (::after) so they stay decorative, not low-contrast text
  `<span class="budget" title="งบประมาณ" data-rest="${'฿'.repeat(3 - budgetOf(r))}">${'฿'.repeat(budgetOf(r))}</span>`;

function cardBadges(recipe) {
  const h = history_[recipe.id];
  const bits = [];
  if (recipe.custom) bits.push('<span class="mini-badge mine">สูตรของฉัน</span>');
  if (h?.count)
    bits.push(`<span class="mini-badge">ทำแล้ว ${h.count} ครั้ง${h.rating ? ` • ★${h.rating}` : ''}</span>`);
  return bits.length ? `<div class="card-badges">${bits.join('')}</div>` : '';
}

const AVOID_RULES = {
  beef: { label: 'เนื้อวัว', re: /เนื้อวัว/ },
  pork: { label: 'หมู', re: /หมู/ },
  chicken: { label: 'ไก่', re: /(?<!ไข่)ไก่/ }
};
let avoid = readJSON('onepot-avoid', []);
if (!Array.isArray(avoid)) avoid = [];
function isAvoided(recipe) {
  if (!avoid.length) return false;
  return (recipe._th?.ingredients || recipe.ingredients).some((item) => {
    const options = item.split('หรือ');
    return options.every((part) => avoid.some((k) => AVOID_RULES[k]?.re.test(part)));
  });
}
function renderAvoidRow() {
  const row = document.querySelector('#avoid-row');
  const hidden = recipes.filter(isAvoided).length;
  row.innerHTML = `<span>ไม่กิน:</span>${Object.entries(AVOID_RULES)
    .map(
      ([k, v]) =>
        `<label class="avoid-chip ${avoid.includes(k) ? 'is-active' : ''}"><input type="checkbox" data-avoid="${k}" ${avoid.includes(k) ? 'checked' : ''} />${v.label}</label>`
    )
    .join(
      ''
    )}<label class="avoid-chip ${Object.keys(AVOID_RULES).every((k) => avoid.includes(k)) ? 'is-active' : ''}"><input type="checkbox" data-avoid="all" ${Object.keys(AVOID_RULES).every((k) => avoid.includes(k)) ? 'checked' : ''} />ไม่กินเนื้อสัตว์</label><small>${hidden ? `ซ่อนอยู่ ${hidden} เมนู` : 'ตั้งไว้ครั้งเดียว จำให้ตลอด'}</small>`;
  document.querySelector('#avoid-toggle').classList.toggle('has-value', avoid.length > 0);
}

/* =============== Glossary (4) =============== */
const GLOSSARY = {
  มิริน: 'เหล้าหวานสำหรับปรุงอาหารญี่ปุ่น ให้ความหวานและเงา หาได้ในโซนอาหารญี่ปุ่นของซูเปอร์ฯ',
  ดาชิ: 'น้ำซุปพื้นฐานญี่ปุ่น ต้มจากสาหร่ายคอมบุและปลาโอแห้ง มีแบบผงสำเร็จรูปขายเป็นซอง',
  โชยุ: 'ซอสถั่วเหลืองญี่ปุ่น รสกลมกล่อมกว่าซีอิ๊วขาวไทยเล็กน้อย',
  มิโสะ: 'เต้าเจี้ยวญี่ปุ่นเนื้อเนียน ใส่ตอนท้ายและอย่าต้มเดือดนาน กลิ่นจะหาย',
  วากาเมะ: 'สาหร่ายทะเลแห้ง แช่น้ำแล้วพองขึ้นหลายเท่า ใส่น้อย ๆ ก็พอ',
  อุด้ง: 'เส้นแป้งสาลีเส้นใหญ่ นุ่มหนึบ แบบแช่แข็งสะดวกที่สุด',
  ราเมง: 'บะหมี่สไตล์ญี่ปุ่น ใช้เส้นบะหมี่เหลืองหรือบะหมี่กึ่งฯ แทนได้',
  ก้อนแกงกะหรี่: 'ก้อนเครื่องแกงกะหรี่ญี่ปุ่น ละลายแล้วข้นเอง มีหลายระดับความเผ็ด',
  เต้าหู้ทอดปรุงรส: 'อาบูราอาเกะ เต้าหู้ทอดแผ่นที่ต้มกับซอสหวาน เป็นหัวใจของคิทสึเนะอุด้ง'
};
const glossRe = new RegExp(
  Object.keys(GLOSSARY)
    .sort((a, b) => b.length - a.length)
    .join('|'),
  'g'
);
function gloss(text) {
  const seen = new Set();
  return escapeHTML(text).replace(glossRe, (term) => {
    if (seen.has(term)) return term;
    seen.add(term);
    return `<button type="button" class="term" data-term="${term}">${term}</button>`;
  });
}
function showTerm(term) {
  document.querySelector('.term-pop')?.remove();
  const pop = document.createElement('div');
  pop.className = 'term-pop';
  pop.setAttribute('role', 'status');
  pop.innerHTML = `<strong>${escapeHTML(term)}</strong><p>${escapeHTML(GLOSSARY[term])}</p><button type="button" aria-label="ปิด">✕</button>`;
  pop.querySelector('button').addEventListener('click', () => pop.remove());
  document.body.appendChild(pop);
  clearTimeout(showTerm.t);
  showTerm.t = setTimeout(() => pop.remove(), 9000);
}

/* =============== Cooking font size (3) =============== */
let cookScale = Number(readJSON('onepot-cook-scale', 1)) || 1;
const applyCookScale = () => document.documentElement.style.setProperty('--cook-scale', cookScale);
function fontButtons() {
  return `<span class="font-btns" role="group" aria-label="ขนาดตัวอักษร"><button type="button" data-font="-1" aria-label="ตัวอักษรเล็กลง" ${cookScale <= 0.8 ? 'disabled' : ''}>A−</button><button type="button" data-font="1" aria-label="ตัวอักษรใหญ่ขึ้น" ${cookScale >= 1.6 ? 'disabled' : ''}>A+</button></span>`;
}

/* =============== Detail extras: print (5), share link (11), edit/delete (1) =============== */
function detailExtras(recipe) {
  const btns = [`<button class="ghost-button small" data-print type="button">พิมพ์สูตร</button>`];
  if (!recipe.custom)
    btns.push(
      `<button class="ghost-button small" data-share-recipe="${recipe.id}" type="button">${icon('share')}<span>แชร์ลิงก์</span></button>`
    );
  if (recipe.custom)
    btns.push(
      `<button class="ghost-button small" data-edit-recipe="${recipe.id}" type="button">แก้ไข</button><button class="ghost-button small danger" data-delete-recipe="${recipe.id}" type="button">ลบสูตร</button>`
    );
  return `<div class="detail-extras">${btns.join('')}<span class="small-note" data-extras-status aria-live="polite"></span></div>`;
}
function printRecipe() {
  const prev = document.documentElement.dataset.theme;
  document.documentElement.dataset.theme = 'light';
  overlayRoot.querySelectorAll('details').forEach((d) => (d.open = true));
  const restore = () => {
    if (prev) document.documentElement.dataset.theme = prev;
    else delete document.documentElement.dataset.theme;
    window.removeEventListener('afterprint', restore);
  };
  window.addEventListener('afterprint', restore);
  setTimeout(() => window.print(), 50);
}
async function shareRecipeLink(id) {
  const recipe = recipes.find((r) => r.id === id);
  const url = `${location.origin}${location.pathname}#recipe=${id}`;
  const status = overlayRoot.querySelector('[data-extras-status]');
  try {
    if (navigator.share) {
      await navigator.share({ title: recipe.name, text: `${recipe.name} — สูตรทำด้วยหม้อไฟฟ้า`, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    if (status) status.textContent = 'คัดลอกลิงก์แล้ว ✓';
  } catch (e) {
    if (e?.name !== 'AbortError' && status) status.textContent = url;
  }
}

/* =============== Fridge search (8) =============== */
const PANTRY =
  document.documentElement.lang === 'en'
    ? ['Water', 'Sugar', 'Salt', 'Soy sauce', 'Salt and pepper']
    : ['น้ำ', 'น้ำตาล', 'เกลือเล็กน้อย', 'เกลือและพริกไทยเล็กน้อย', 'โชยุ'];
let fridge = readJSON('onepot-fridge', null);
if (!Array.isArray(fridge)) fridge = [...PANTRY];
const ingName = (text) => coreName(parseIngredient(text).name) || parseIngredient(text).name;
const isOptional = (text) => text.includes('ถ้ามี');
function fridgeResults() {
  return recipes
    .filter((r) => !isAvoided(r))
    .map((r) => {
      const items = r.ingredients.filter((i) => !isOptional(i));
      const needed = items.map(ingName);
      const has = (text) =>
        parseIngredient(text)
          .name.split('หรือ')
          .some((part) => fridge.includes(coreName(part.trim()) || part.trim()));
      const missing = [...new Set(items.filter((i) => !has(i)).map(ingName))];
      return { r, missing, have: needed.length - missing.length, total: needed.length };
    })
    .sort((a, b) => a.missing.length - b.missing.length || b.have - a.have);
}
function renderFridge() {
  const prevScroll = overlayRoot.querySelector('.detail-panel')?.scrollTop || 0;
  const all = [...new Set(recipes.flatMap((r) => r.ingredients.map(ingName)))].sort((a, b) => a.localeCompare(b, 'th'));
  const results = fridgeResults();
  state.recipe = null;
  overlayRoot.innerHTML = `<div class="overlay" data-close-overlay><section class="detail-panel" role="dialog" aria-modal="true" aria-labelledby="fridge-title" tabindex="-1"><div class="detail-head"><button class="back-button" data-close type="button"><span>←</span> กลับ</button><button class="close-button" data-close type="button" aria-label="ปิด">✕</button></div><div class="detail-content">
  <p class="eyebrow">ใช้ของที่มีให้คุ้ม</p><h2 id="fridge-title">ในตู้เย็นมีอะไรบ้าง?</h2><p class="detail-intro">แตะเลือกของที่มีอยู่ แล้วดูว่าทำเมนูไหนได้บ้าง</p>
  <div class="fridge-chips">${all.map((n) => `<button type="button" class="fridge-chip ${fridge.includes(n) ? 'is-active' : ''}" data-fridge="${escapeHTML(n)}" aria-pressed="${fridge.includes(n)}">${escapeHTML(n)}</button>`).join('')}</div>
  <div class="detail-section-title"><h3>ทำได้เลย / ขาดอีกนิด</h3><span>เลือกไว้ ${fridge.length} อย่าง</span></div>
  <div class="fridge-results">${results.map(({ r, missing, have, total }) => `<button type="button" class="fridge-result ${missing.length ? '' : 'ready'}" data-fridge-open="${r.id}"><strong>${escapeHTML(r.name)}</strong><span class="meter"><i style="width:${Math.round((have / Math.max(total, 1)) * 100)}%"></i></span><small>${missing.length ? `ขาด ${missing.length}: ${escapeHTML(missing.slice(0, 4).join(', '))}${missing.length > 4 ? '…' : ''}` : '✓ มีครบ ทำได้เลย'}</small></button>`).join('')}</div>
  <div class="sheet-actions"><div class="sheet-buttons"><button class="ghost-button" data-fridge-reset type="button">เริ่มใหม่</button></div></div></div></section></div>`;
  const panel = overlayRoot.querySelector('.detail-panel');
  panel.focus({ preventScroll: true });
  panel.scrollTop = prevScroll;
}

/* =============== Time-of-day suggestion (10) =============== */
function suggestion() {
  const h = new Date().getHours();
  const slots = [
    [5, 10, 'เช้านี้', ['zosui', 'miso']],
    [10, 14, 'มื้อเที่ยง', ['oyakodon', 'gyudon', 'udon']],
    [14, 17, 'บ่ายนี้', ['potato-salad', 'miso']],
    [17, 21, 'มื้อเย็น', ['curry', 'nabe', 'nikujaga']],
    [21, 29, 'ดึกแล้ว', ['ramen', 'udon', 'zosui']]
  ];
  const hour = h < 5 ? h + 24 : h;
  const [, , label, ids] = slots.find(([a, b]) => hour >= a && hour < b);
  const pool = ids.map((id) => recipes.find((r) => r.id === id)).filter((r) => r && !isAvoided(r));
  if (!pool.length) return null;
  return { label, recipe: pool[new Date().getDate() % pool.length] };
}
function renderSuggestion() {
  const box = document.querySelector('#suggest');
  const s = suggestion();
  if (!s || state.query || state.savedOnly) {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  box.innerHTML = `<span class="suggest-label">${s.label}ลองนี่ไหม</span><strong>${escapeHTML(s.recipe.name)}</strong><span class="suggest-meta">◷ ${s.recipe.time} นาที • ${'฿'.repeat(budgetOf(s.recipe))}</span><button type="button" class="ghost-button small" data-open-suggest="${s.recipe.id}">ดูสูตร →</button>`;
}

/* =============== Deep links (11) + app shortcuts (12) =============== */
const _openDetail = openDetail,
  _closeDetail = closeDetail;
openDetail = function (recipe, trigger) {
  _openDetail(recipe, trigger);
  if (!recipe.custom && location.hash !== '#recipe=' + recipe.id)
    history.pushState({ fromApp: true }, '', '#recipe=' + recipe.id);
};
closeDetail = function () {
  if (location.hash.startsWith('#recipe=')) {
    if (history.state?.fromApp) {
      history.back();
      return;
    }
    history.replaceState(null, '', location.pathname + location.search);
  }
  _closeDetail();
};
function routeFromHash(initial) {
  const hash = decodeURIComponent(location.hash);
  const m = hash.match(/^#recipe=(.+)$/);
  if (m) {
    const recipe = recipes.find((r) => r.id === m[1]);
    if (recipe && state.recipe?.id !== recipe.id) _openDetail(recipe, null);
    return;
  }
  if (!initial && overlayRoot.innerHTML && !overlayRoot.querySelector('.cooking-screen')) {
    _closeDetail();
    return;
  }
  if (initial && ['#shopping', '#plan', '#random', '#fridge'].includes(hash)) {
    history.replaceState(null, '', location.pathname + location.search);
    if (hash === '#shopping') renderShopping();
    if (hash === '#plan') renderPlan();
    if (hash === '#fridge') renderFridge();
    if (hash === '#random') randomRecipe(null);
  }
}
window.addEventListener('popstate', () => routeFromHash(false));

/* =============== Wiring =============== */
window.afterRender = function () {
  const chip = document.querySelector('.filter-chip[data-category="ทั้งหมด"] span');
  if (chip) chip.textContent = String(recipes.filter((r) => !isAvoided(r)).length);
  renderAvoidRow();
  renderSuggestion();
};

overlayRoot.addEventListener(
  'click',
  (event) => {
    const t = event.target;
    const term = t.closest('[data-term]');
    if (term) {
      event.stopPropagation();
      showTerm(term.dataset.term);
      return;
    }
    const rate = t.closest('[data-rate]');
    if (rate) {
      const h = history_[state.recipe.id];
      h.rating = Number(rate.dataset.rate);
      saveHistory();
      overlayRoot.querySelectorAll('[data-rate]').forEach((b) => {
        const on = Number(b.dataset.rate) <= h.rating;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on);
      });
      render();
      return;
    }
    const font = t.closest('[data-font]');
    if (font) {
      cookScale = Math.round(Math.min(1.6, Math.max(0.8, cookScale + Number(font.dataset.font) * 0.2)) * 10) / 10;
      writeJSON('onepot-cook-scale', cookScale);
      applyCookScale();
      renderCooking();
      return;
    }
    if (t.closest('[data-print]')) {
      printRecipe();
      return;
    }
    const it = t.closest('[data-import-toggle]');
    if (it) {
      const body = it.nextElementSibling;
      body.hidden = !body.hidden;
      it.setAttribute('aria-expanded', String(!body.hidden));
      if (!body.hidden) body.querySelector('textarea').focus();
      return;
    }
    if (t.closest('[data-import-run]')) {
      runImport(t.closest('form'));
      return;
    }
    const sh = t.closest('[data-share-recipe]');
    if (sh) {
      shareRecipeLink(sh.dataset.shareRecipe);
      return;
    }
    const ed = t.closest('[data-edit-recipe]');
    if (ed) {
      renderRecipeForm(recipes.find((r) => r.id === ed.dataset.editRecipe));
      return;
    }
    const del = t.closest('[data-delete-recipe]');
    if (del) {
      deleteCustom(del.dataset.deleteRecipe);
      return;
    }
    if (t.closest('[data-photo-preview]')) {
      overlayRoot.querySelector('[data-photo-input]').click();
      return;
    }
    const fc = t.closest('[data-fridge]');
    if (fc) {
      const n = fc.dataset.fridge;
      fridge = fridge.includes(n) ? fridge.filter((x) => x !== n) : [...fridge, n];
      writeJSON('onepot-fridge', fridge);
      renderFridge();
      return;
    }
    if (t.closest('[data-fridge-reset]')) {
      fridge = [...PANTRY];
      writeJSON('onepot-fridge', fridge);
      renderFridge();
      return;
    }
    const fo = t.closest('[data-fridge-open]');
    if (fo) {
      const r = recipes.find((x) => x.id === fo.dataset.fridgeOpen);
      if (r) openDetail(r, document.querySelector('#fridge-open'));
      return;
    }
  },
  true
);

overlayRoot.addEventListener('change', async (event) => {
  const input = event.target.closest('[data-photo-input]');
  if (!input?.files[0]) return;
  try {
    formPhoto = await resizeImage(input.files[0]);
    overlayRoot.querySelector('[data-photo-preview]').innerHTML = `<img src="${formPhoto}" alt="" />`;
  } catch {
    alert('เปิดรูปนี้ไม่ได้ ลองรูปอื่นนะ');
  }
});
overlayRoot.addEventListener('input', (event) => {
  const w = event.target.closest('[data-when]');
  if (!w) return;
  const recipe = recipes.find((r) => r.id === w.dataset.when);
  const out = overlayRoot.querySelector('[data-when-out]');
  if (recipe && out) out.innerHTML = startTimeText(recipe, w.value);
});
overlayRoot.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-recipe-form]');
  if (form) {
    event.preventDefault();
    submitRecipeForm(form);
  }
});

document.querySelector('#avoid-toggle').addEventListener('click', (event) => {
  const row = document.querySelector('#avoid-row');
  row.hidden = !row.hidden;
  event.currentTarget.setAttribute('aria-expanded', String(!row.hidden));
});
document.querySelector('#avoid-row').addEventListener('change', (event) => {
  const key = event.target.dataset.avoid;
  if (!key) return;
  if (key === 'all') avoid = event.target.checked ? Object.keys(AVOID_RULES) : [];
  else avoid = event.target.checked ? [...new Set([...avoid, key])] : avoid.filter((k) => k !== key);
  writeJSON('onepot-avoid', avoid);
  render();
});
document.querySelector('#suggest').addEventListener('click', (event) => {
  const b = event.target.closest('[data-open-suggest]');
  if (b) {
    const r = recipes.find((x) => x.id === b.dataset.openSuggest);
    if (r) openDetail(r, b);
  }
});
document.querySelector('#add-recipe').addEventListener('click', (event) => {
  state.returnFocus = event.currentTarget;
  renderRecipeForm(null);
});
document.querySelector('#fridge-open').addEventListener('click', (event) => {
  state.returnFocus = event.currentTarget;
  renderFridge();
});

/* =============== Mobile bottom nav =============== */
const _updateShopCount = updateShopCount;
updateShopCount = function () {
  _updateShopCount();
  const badge = document.querySelector('#nav-shop-count');
  if (!badge) return;
  const n = shopping.filter((i) => !i.done).length;
  badge.textContent = n > 99 ? '99+' : String(n);
  badge.hidden = n === 0;
};
document.querySelector('#bottom-nav').addEventListener('click', (event) => {
  const b = event.target.closest('[data-nav]');
  if (!b) return;
  state.returnFocus = b;
  ({
    home: () =>
      window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }),
    fridge: () => renderFridge(),
    random: () => randomRecipe(b),
    plan: () => {
      state.recipe = null;
      renderPlan();
    },
    shop: () => {
      state.recipe = null;
      renderShopping();
    }
  })[b.dataset.nav]();
});
updateShopCount();

const langBtn = document.querySelector('#lang-toggle');
langBtn.textContent = LANG === 'en' ? 'ไทย' : 'EN';
langBtn.setAttribute('aria-label', LANG === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English');
langBtn.addEventListener('click', () => setLanguage(LANG === 'en' ? 'th' : 'en'));

['onepot-lang', 'onepot-custom', 'onepot-history', 'onepot-avoid', 'onepot-fridge', 'onepot-cook-scale'].forEach((k) =>
  BACKUP_KEYS.push(k)
);
applyCookScale();
render();
routeFromHash(true);
