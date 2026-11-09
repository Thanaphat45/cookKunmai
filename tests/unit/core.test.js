// Unit tests for the pure helpers in core.js. Run: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../../core.js');

// recipes.js is a browser script with plain globals; evaluate it in a sandbox.
const sandbox = {};
vm.runInNewContext(
  fs.readFileSync(path.join(__dirname, '../../recipes.js'), 'utf8') +
    ';this.recipes=recipes;this.photoFiles=photoFiles;',
  sandbox
);
const { recipes, photoFiles } = sandbox;
const byId = (id) => recipes.find((r) => r.id === id);

test('escapeHTML escapes markup characters', () => {
  assert.equal(core.escapeHTML(`<a href="x">'&'</a>`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
});

test('formatAmount prints fractions as unicode', () => {
  assert.equal(core.formatAmount(0.5), '½');
  assert.equal(core.formatAmount(1.5), '1½');
  assert.equal(core.formatAmount(0.75), '¾');
  assert.equal(core.formatAmount(3), '3');
  assert.equal(core.formatAmount(2.4), '2.4');
});

test('scaleText scales whole numbers, fractions and ranges', () => {
  assert.equal(core.scaleText('ไข่ไก่ 2 ฟอง', 2), 'ไข่ไก่ 4 ฟอง');
  assert.equal(core.scaleText('โชยุ 1½ ช้อนโต๊ะ', 0.5), 'โชยุ ¾ ช้อนโต๊ะ');
  assert.equal(core.scaleText('ข้าวสวย 1–2 ถ้วย', 2), 'ข้าวสวย 2–4 ถ้วย');
  assert.equal(core.scaleText('ต้นหอมซอย', 3), 'ต้นหอมซอย');
  assert.equal(core.scaleText('น้ำ 120 มล.', 1), 'น้ำ 120 มล.');
});

test('parseIngredient splits name, amount and unit', () => {
  assert.deepEqual(
    { ...core.parseIngredient('สะโพกไก่หั่น 180 กรัม'), raw: undefined },
    { name: 'สะโพกไก่หั่น', low: 180, amount: 180, unit: 'กรัม', ranged: false, raw: undefined }
  );
  const ranged = core.parseIngredient('ข้าวสวย 1–2 ถ้วย');
  assert.equal(ranged.low, 1);
  assert.equal(ranged.amount, 2);
  assert.equal(ranged.ranged, true);
  assert.equal(core.parseIngredient('นมจืด 2 ช้อนโต๊ะ (ถ้ามี)').unit, 'ช้อนโต๊ะ');
  assert.equal(core.parseIngredient('เกลือเล็กน้อย').amount, null);
});

test('mergeItems sums same units, keeps different units separate', () => {
  const merged = core.mergeItems([
    { text: 'โชยุ 1 ช้อนโต๊ะ', recipe: 'A', done: false },
    { text: 'โชยุ 1½ ช้อนโต๊ะ', recipe: 'B', done: false },
    { text: 'โชยุ 1 ช้อนชา', recipe: 'C', done: true },
    { text: 'ข้าวสวย 1–2 ถ้วย', recipe: 'A', done: true },
    { text: 'ข้าวสวย 2 ถ้วย', recipe: 'B', done: true }
  ]);
  const soy = merged.find((g) => g.name === 'โชยุ');
  assert.equal(soy.label, 'โชยุ 2½ ช้อนโต๊ะ + 1 ช้อนชา');
  assert.deepEqual(soy.recipes, ['A', 'B', 'C']);
  assert.equal(soy.done, false);
  const rice = merged.find((g) => g.name === 'ข้าวสวย');
  assert.equal(rice.label, 'ข้าวสวย 3–4 ถ้วย');
  assert.equal(rice.done, true);
  assert.equal(merged.at(-1).name, 'ข้าวสวย', 'done groups sort last');
});

test('stepMinutes takes the upper bound of a range', () => {
  assert.equal(core.stepMinutes('ปิดฝาเคี่ยว 10–12 นาทีจนไก่สุกทั่ว'), 12);
  assert.equal(core.stepMinutes('ต้ม 5 นาที'), 5);
  assert.equal(core.stepMinutes('ชิมแล้วตักเสิร์ฟ'), 0);
});

test('formatTime renders mm:ss and never goes negative', () => {
  assert.equal(core.formatTime(65000), '01:05');
  assert.equal(core.formatTime(-500), '00:00');
  assert.equal(core.formatTime(1), '00:01');
});

test('stepIngredients matches what each step uses', () => {
  // Array.from: recipes come from a vm sandbox, so normalise to this realm's Array for deepEqual
  const names = (id, i) => Array.from(core.stepIngredients(byId(id), i), (p) => p.name);
  assert.deepEqual(names('oyakodon', 1), ['หอมหัวใหญ่', 'โชยุ', 'มิริน', 'น้ำ']);
  assert.ok(!names('oyakodon', 2).includes('ไข่ไก่'), '"ไก่" alone must not match ไข่ไก่');
  assert.ok(names('oyakodon', 3).includes('ไข่ไก่'));
  assert.ok(!names('oyakodon', 3).includes('มิริน'), '"ริน" in รินไข่ must not match มิริน');
});

test('stepIngredients applies the serving scale', () => {
  const items = core.stepIngredients(byId('oyakodon'), 1, 2);
  assert.ok(items.some((p) => p.text === 'น้ำ 240 มล.'));
});

test('recipe data is complete and consistent', () => {
  const ids = new Set();
  for (const r of recipes) {
    assert.ok(!ids.has(r.id), `duplicate id ${r.id}`);
    ids.add(r.id);
    for (const key of ['name', 'jp', 'category', 'description', 'tip']) assert.ok(r[key], `${r.id} missing ${key}`);
    assert.ok(Number.isFinite(r.time) && r.time > 0, `${r.id} time`);
    assert.ok(r.ingredients.length >= 2, `${r.id} ingredients`);
    assert.ok(r.steps.length >= 2, `${r.id} steps`);
    assert.ok(['ข้าว', 'ซุป', 'หม้อไฟ', 'ของเคียง', 'ของหวาน'].includes(r.category), `${r.id} category`);
    if (photoFiles[r.id]) assert.ok(fs.existsSync(path.join(__dirname, '../../assets/recipes', photoFiles[r.id])));
  }
});
