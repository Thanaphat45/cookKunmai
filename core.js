/* หม้อเดียว — pure helpers (no DOM). Shared as browser globals and as a Node module for tests. */
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );
}
const FRACTIONS = { '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3 };
function formatAmount(n) {
  const whole = Math.floor(n + 1e-9),
    rest = n - whole;
  const frac = Object.entries(FRACTIONS).find(([, v]) => Math.abs(v - rest) < 0.02);
  if (rest < 0.02) return String(whole);
  if (frac) return (whole ? whole : '') + frac[0];
  return String(Math.round(n * 10) / 10);
}
function scaleText(text, factor) {
  if (factor === 1) return text;
  return text.replace(/(\d+(?:\.\d+)?)?([¼½¾⅓⅔])?/g, (match, num, frac) => {
    if (!match) return match;
    const value = (num ? Number(num) : 0) + (frac ? FRACTIONS[frac] : 0);
    return formatAmount(value * factor);
  });
}
function parseIngredient(text) {
  const clean = text.replace(/\s*\(.*?\)\s*/g, ' ').trim();
  const m = clean.match(/^(.*?)\s*([\d¼½¾⅓⅔][\d.¼½¾⅓⅔]*)(?:\s*[–-]\s*([\d¼½¾⅓⅔][\d.¼½¾⅓⅔]*))?\s*(.*)$/);
  if (!m) return { name: clean, amount: null, unit: '', ranged: false };
  const toNum = (v) => {
    let n = 0;
    for (const part of v.match(/\d+(?:\.\d+)?|[¼½¾⅓⅔]/g) || []) n += FRACTIONS[part] ?? Number(part);
    return n;
  };
  return {
    name: m[1].trim(),
    low: toNum(m[2]),
    amount: toNum(m[3] || m[2]),
    unit: m[4].trim(),
    ranged: !!m[3],
    raw: clean.slice(m[1].length).trim()
  };
}
const STOP_PARTS = ['ริน', 'น้ำ', 'หอม', 'หัว', 'มัน', 'เนื้อ', 'ใส่', 'ให้', 'หม้อ', 'ทอด', 'ซุป'];
function coreName(name) {
  return name.replace(/หั่น|ซอย|สไลซ์บาง|สไลซ์|ขูด|แช่แข็ง|ปรุงรส|แห้ง|หรือ.*$/g, '').trim();
}
function longestCommon(a, b) {
  let best = '';
  for (let i = 0; i < a.length; i++)
    for (let j = i + best.length + 1; j <= a.length; j++) {
      const sub = a.slice(i, j);
      if (b.includes(sub)) best = sub;
      else break;
    }
  return best;
}
const EN_STOP = [
  'and',
  'the',
  'sliced',
  'diced',
  'thinly',
  'grated',
  'cooked',
  'frozen',
  'dried',
  'canned',
  'seasoned',
  'fried',
  'sweet',
  'japanese',
  'sauce',
  'stock',
  'paste',
  'optional',
  'pinch',
  'cubes',
  'roux',
  'pack',
  'block',
  'pieces'
];
function stepIngredients(recipe, stepIndex, scale = 1) {
  const step = recipe.steps[stepIndex];
  const parsed = recipe.ingredients.map((text) => ({ text: scaleText(text, scale), ...parseIngredient(text) }));
  const fullNames = parsed.map((p) => p.name);
  return parsed.filter((p) => {
    const core = coreName(p.name);
    if (!core) return false;
    if (core.startsWith('ไข่') && !step.includes('ไข่')) return false;
    if (/[a-z]/i.test(core)) {
      // English: whole-word match, ignoring descriptive words
      const words = core
        .toLowerCase()
        .split(/[^a-z]+/)
        .filter((w) => w.length >= 3 && !EN_STOP.includes(w));
      const text = step.toLowerCase();
      return words.some((w) => new RegExp(`\\b${w}(?:es|s)?\\b`).test(text));
    }
    if (step.includes(core)) return true;
    const common = longestCommon(core, step);
    return common.length >= 3 && !STOP_PARTS.includes(common) && !fullNames.some((n) => n !== p.name && n === common);
  });
}
function stepMinutes(text) {
  const matches = [...text.matchAll(/(\d+)(?:\s*[–-]\s*(\d+))?\s*(?:นาที|min(?:ute)?s?\b)/gi)];
  if (!matches.length) return 0;
  const m = matches[matches.length - 1];
  return Number(m[2] || m[1]);
}
function formatTime(ms) {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
}
function mergeItems(items) {
  const groups = new Map();
  items.forEach((item) => {
    const p = parseIngredient(item.text);
    const key = p.name;
    if (!groups.has(key)) groups.set(key, { name: key, parts: [], recipes: [], items: [] });
    const g = groups.get(key);
    g.parts.push(p);
    g.items.push(item);
    if (!g.recipes.includes(item.recipe)) g.recipes.push(item.recipe);
  });
  return [...groups.values()]
    .map((g) => {
      const units = new Set(g.parts.map((p) => p.unit));
      let amount;
      const byUnit = new Map();
      g.parts
        .filter((p) => p.amount != null)
        .forEach((p) => {
          const u = byUnit.get(p.unit) || { lo: 0, hi: 0 };
          u.lo += p.low;
          u.hi += p.amount;
          byUnit.set(p.unit, u);
        });
      amount = [...byUnit]
        .map(([unit, { lo, hi }]) =>
          `${lo === hi ? formatAmount(hi) : `${formatAmount(lo)}–${formatAmount(hi)}`} ${unit}`.trim()
        )
        .join(' + ');
      return {
        name: g.name,
        label: amount ? `${g.name} ${amount}` : g.name,
        recipes: g.recipes,
        done: g.items.every((i) => i.done)
      };
    })
    .sort((a, b) => a.done - b.done);
}

if (typeof module !== 'undefined')
  module.exports = {
    escapeHTML,
    FRACTIONS,
    formatAmount,
    scaleText,
    parseIngredient,
    STOP_PARTS,
    coreName,
    longestCommon,
    stepIngredients,
    stepMinutes,
    formatTime,
    mergeItems
  };
