// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (err) => {
    throw err;
  });
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('home lists recipes and filters by category and time', async ({ page }) => {
  const cards = page.locator('.recipe-card');
  const total = await cards.count();
  expect(total).toBeGreaterThanOrEqual(10);
  await page.locator('.filter-chip[data-category="ซุป"]').click();
  expect(await cards.count()).toBeLessThan(total);
  await page.locator('.filter-chip[data-category="ทั้งหมด"]').click();
  await page.locator('#quick-toggle').click();
  for (const t of await page.locator('.recipe-card .cook-time').allTextContents()) {
    expect(Number(t.match(/\d+/)[0])).toBeLessThanOrEqual(20);
  }
});

test('recipe detail scales servings and deep-links', async ({ page }) => {
  await page.locator('[data-open="oyakodon"]').click();
  await expect(page).toHaveURL(/#recipe=oyakodon$/);
  await page.locator('[data-scale="2"]').click();
  await expect(page.locator('.ingredient-list')).toContainText('ไข่ไก่ 4 ฟอง');
  await page.goBack();
  await expect(page.locator('.detail-panel')).toHaveCount(0);
  await page.goto('/#recipe=gyudon');
  await expect(page.locator('#detail-title')).toHaveText('ข้าวหน้าเนื้อ');
});

test('shopping list adds, merges and counts', async ({ page }) => {
  for (const id of ['oyakodon', 'gyudon']) {
    await page.locator(`[data-open="${id}"]`).click();
    await page.locator('[data-add-shop]').click();
    await page.locator('.detail-head [data-close]').first().click();
  }
  await page.locator('#shop-toggle').click();
  await page.locator('[data-shop-mode="merged"]').click();
  await expect(page.locator('.ingredient-list.one-col')).toContainText('ข้าวสวย 2–4 ถ้วย');
  await expect(page.locator('#shop-count')).toHaveText('14');
});

test('cooking mode offers a timer from the step text', async ({ page }) => {
  await page.locator('[data-open="oyakodon"]').click();
  await page.locator('[data-start]').click();
  await page.locator('[data-next-step]').click();
  await page.locator('[data-next-step]').click();
  await page.locator('[data-timer-start="12"]').click();
  await expect(page.locator('[data-timer-display]')).toHaveText(/^1[12]:\d\d$/);
  await page.locator('[data-timer-add="1"]').click();
  await expect(page.locator('[data-timer-display]')).toHaveText(/^1[23]:\d\d$/);
});

test('custom recipe can be created and cooked', async ({ page }) => {
  await page.locator('#add-recipe').click();
  await page.fill('input[name="name"]', 'ไข่ตุ๋นทดสอบ');
  await page.fill('textarea[name="ingredients"]', 'ไข่ไก่ 2 ฟอง\nน้ำ 150 มล.');
  await page.fill('textarea[name="steps"]', 'ตีไข่กับน้ำ\nนึ่ง 12 นาที');
  await page.locator('.recipe-form [type="submit"]').click();
  await expect(page.locator('#detail-title')).toHaveText('ไข่ตุ๋นทดสอบ');
  await page.locator('[data-start]').click();
  await page.locator('[data-next-step]').click();
  await expect(page.locator('[data-timer-start="12"]')).toBeVisible();
});

test('recipe import from pasted text fills the form', async ({ page }) => {
  await page.locator('#add-recipe').click();
  await page.locator('[data-import-toggle]').click();
  await page.fill(
    '[data-import-text]',
    'ข้าวผัดไข่\n\nวัตถุดิบ\n- ข้าวสวย 1 ถ้วย\n- ไข่ไก่ 1 ฟอง\n\nวิธีทำ\n1. ตีไข่\n2. ผัดกับข้าว 3 นาที'
  );
  await page.locator('[data-import-run]').click();
  await expect(page.locator('input[name="name"]')).toHaveValue('ข้าวผัดไข่');
  await expect(page.locator('textarea[name="ingredients"]')).toHaveValue('ข้าวสวย 1 ถ้วย\nไข่ไก่ 1 ฟอง');
  await expect(page.locator('textarea[name="steps"]')).toHaveValue('ตีไข่\nผัดกับข้าว 3 นาที');
});

test('English interface switch', async ({ page }) => {
  await page.locator('#lang-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#collection-title')).toContainText('recipes');
  await page.locator('[data-open="oyakodon"]').click();
  await expect(page.locator('#detail-title')).toHaveText('Chicken & egg rice bowl');
  await page.locator('[data-start]').click();
  await page.locator('[data-next-step]').click();
  await page.locator('[data-next-step]').click();
  await expect(page.locator('[data-timer-start="12"]')).toBeVisible();
});

const SIZES = [
  [320, 640],
  [375, 740],
  [414, 896],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
  [2560, 1440]
];
for (const [width, height] of SIZES) {
  test(`layout fits at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.reload();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.locator('[data-open="nabe"]').click();
    const panel = await page.locator('.detail-panel').boundingBox();
    // 1px tolerance: sub-pixel layout can report e.g. 414.0000029 on a 414px screen
    expect(panel.x).toBeGreaterThanOrEqual(-1);
    expect(panel.width).toBeLessThanOrEqual(width + 1);
    if (width <= 600) {
      const small = await page.evaluate(() =>
        [...document.querySelectorAll('.detail-panel button, .detail-panel select, .detail-panel label.ingredient')]
          .filter((e) => e.offsetParent && !e.closest('.ingredient-list .term') && !e.classList.contains('term'))
          .map((e) => e.getBoundingClientRect())
          .filter((r) => r.height < 40).length
      );
      expect(small).toBe(0);
    }
  });
}
