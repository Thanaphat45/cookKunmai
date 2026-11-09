/* หม้อเดียว — English mode. Loaded right after recipes.js.
 * Thai is the source language. In English mode this file:
 *  1. swaps recipe text for English (originals kept on recipe._th for Thai-only logic such as diet filters),
 *  2. translates interface text as it is rendered (exact phrases + patterns), including alert/confirm dialogs.
 */
const LANG = (() => {
  try {
    return JSON.parse(localStorage.getItem('onepot-lang')) === 'en' ? 'en' : 'th';
  } catch {
    return 'th';
  }
})();
document.documentElement.lang = LANG;

const RECIPES_EN = {
  oyakodon: {
    name: 'Chicken & egg rice bowl',
    servings: '1–2 servings',
    description: 'Tender chicken and soft egg in a sweet-savoury sauce over hot rice',
    ingredients: [
      'Cooked rice 1–2 cups',
      'Chicken thigh, diced 180 g',
      'Eggs 2',
      'Onion ½',
      'Soy sauce 1½ tbsp',
      'Mirin 1 tbsp',
      'Water 120 ml'
    ],
    steps: [
      'Cut the chicken into bite-size pieces, slice the onion and lightly beat the eggs. Put the rice in bowls.',
      'Add water, soy sauce, mirin and onion to the pot. Bring to a gentle boil on medium.',
      'Add the chicken and spread it into the sauce. Cover and simmer 10–12 minutes until no pink remains.',
      'Pour the eggs over evenly, cover for 1–2 minutes and switch off while the egg is still soft. Spoon over the rice.'
    ],
    tip: 'If the pot boils too hard, lower the heat or switch it off briefly so the sauce does not dry out.'
  },
  gyudon: {
    name: 'Beef rice bowl',
    servings: '1–2 servings',
    description: 'Thin beef and onion simmered in soy sauce, like a Japanese beef-bowl shop',
    ingredients: [
      'Cooked rice 1–2 cups',
      'Thinly sliced beef 180 g',
      'Onion ½',
      'Soy sauce 2 tbsp',
      'Sugar 1 tsp',
      'Grated ginger ½ tsp',
      'Water 150 ml'
    ],
    steps: [
      'Slice the onion and get the beef and bowls of rice ready.',
      'Add water, soy sauce, sugar and onion to the pot and boil until the onion turns translucent.',
      'Add the beef a little at a time, separating the slices. Simmer 5–7 minutes until fully cooked.',
      'Taste and adjust with sugar or soy sauce, then spoon beef and sauce over the rice.'
    ],
    tip: 'Thin slices cook fast and stay tender. Do not taste the beef until it is cooked through.'
  },
  curry: {
    name: 'Japanese curry rice',
    servings: '2 servings',
    description: 'Thick, fragrant curry with potato, carrot and chicken — all in one pot',
    ingredients: [
      'Cooked rice 2 cups',
      'Chicken, diced 200 g',
      'Potato 1',
      'Carrot ½',
      'Onion ½',
      'Japanese curry roux 2 cubes',
      'Water 450 ml'
    ],
    steps: [
      'Cut the chicken, potato, carrot and onion into bite-size pieces.',
      'Add the water and vegetables to the pot and bring to a boil, then add the chicken and stir to separate.',
      'Cover and simmer 20–25 minutes, stirring now and then, until the vegetables are soft and the chicken is cooked.',
      'Switch off, add the curry roux and stir until dissolved. Simmer on low 3–5 minutes until thick, then serve with rice.'
    ],
    tip: 'Switch off before adding the roux so it dissolves smoothly and does not stick.'
  },
  zosui: {
    name: 'Japanese rice porridge',
    servings: '1 serving',
    description: 'Warm rice soup with egg and mushroom — gentle on the stomach, uses little',
    ingredients: [
      'Cooked rice 1 cup',
      'Egg 1',
      'Shiitake mushrooms 2',
      'Stock or water 450 ml',
      'Soy sauce 1 tsp',
      'Spring onion, sliced 1 tbsp',
      'Salt (a pinch)'
    ],
    steps: [
      'Rinse the rice briefly to loosen it, slice the mushrooms and beat the egg.',
      'Simmer the stock with the mushrooms for about 4 minutes.',
      'Add the rice, soy sauce and a little salt. Simmer 5 minutes, stirring now and then.',
      'Drizzle in the egg, wait 1 minute, stir once and top with spring onion.'
    ],
    tip: 'Use leftover rice — it soaks up the broth nicely without turning mushy.'
  },
  udon: {
    name: 'Kitsune udon',
    servings: '1 serving',
    description: 'Chewy udon in dashi broth topped with sweet fried tofu',
    ingredients: [
      'Frozen udon noodles 1 block',
      'Seasoned fried tofu 1–2 pieces',
      'Dashi stock 400 ml',
      'Soy sauce 1 tbsp',
      'Mirin 1 tbsp',
      'Spring onion, sliced',
      'Nori (optional)'
    ],
    steps: [
      'Heat the dashi with soy sauce and mirin until it boils gently.',
      'Add the frozen udon and cook as the pack says, usually 2–4 minutes.',
      'Stir gently to loosen the noodles, then pour noodles and broth into a bowl.',
      'Top with the fried tofu, spring onion and nori.'
    ],
    tip: 'Frozen udon cooks fast and stays chewy. No need to thaw first.'
  },
  miso: {
    name: 'Miso soup with tofu',
    servings: '2 servings',
    description: 'Simple miso soup with tofu and seaweed — a side for any meal',
    ingredients: [
      'Miso 1½ tbsp',
      'Soft tofu 150 g',
      'Dried wakame 1 tsp',
      'Water 500 ml',
      'Spring onion, sliced 1 tbsp',
      'Dashi powder ½ tsp (optional)'
    ],
    steps: [
      'Cut the tofu into small cubes and soak the wakame in water.',
      'Heat the water with the dashi powder, add the tofu and warm for 2–3 minutes.',
      'Lower the heat and dissolve the miso in a ladle of soup before stirring it back in.',
      'Add the wakame and spring onion and switch off before it boils hard.'
    ],
    tip: 'Do not boil miso for long — it loses its aroma.'
  },
  nabe: {
    name: 'Pork & vegetable hot pot',
    servings: '2 servings',
    description: 'One-pot hot pot with pork, mushrooms, cabbage and tofu — eat it hot',
    ingredients: [
      'Sliced pork 180 g',
      'Napa cabbage 2 leaves',
      'Enoki mushrooms ½ pack',
      'Tofu 150 g',
      'Dashi stock 500 ml',
      'Soy sauce 1 tbsp',
      'Sesame oil ½ tsp'
    ],
    steps: [
      'Cut the cabbage, trim the mushroom roots and cut the tofu into pieces.',
      'Bring the dashi and soy sauce to a boil in the pot.',
      'Add the cabbage, mushrooms and tofu and simmer 5 minutes until the vegetables soften.',
      'Add the pork one slice at a time and cook until no pink remains. Finish with sesame oil.'
    ],
    tip: 'Do not add the pork in one big lump — separate the slices so they cook evenly.'
  },
  nikujaga: {
    name: 'Beef & potato stew',
    servings: '2 servings',
    description: 'Soft potatoes with beef and onion in a sweet soy sauce, home-style',
    ingredients: [
      'Sliced beef or pork 180 g',
      'Potatoes 2',
      'Carrot ½',
      'Onion ½',
      'Soy sauce 2 tbsp',
      'Sugar 1 tbsp',
      'Water 350 ml'
    ],
    steps: [
      'Peel the potatoes and cut into large pieces. Cut the carrot and onion.',
      'Add water, soy sauce, sugar, onion and the meat. Boil and skim off the foam.',
      'Add the potatoes and carrot, cover and simmer 15 minutes.',
      'Uncover and simmer 5 minutes more until the potatoes are soft and the sauce has reduced.'
    ],
    tip: 'Stir gently so the potatoes keep their shape.'
  },
  ramen: {
    name: 'Miso corn ramen',
    servings: '1 serving',
    description: 'Rich miso ramen with corn and egg — filling and quick',
    ingredients: [
      'Ramen noodles 1 block',
      'Miso 1 tbsp',
      'Sweet corn 3 tbsp',
      'Egg 1',
      'Water 450 ml',
      'Milk 2 tbsp (optional)',
      'Spring onion, sliced'
    ],
    steps: [
      'Boil the water and cook the noodles as the pack says.',
      'Lower the heat, dissolve the miso and add the milk if using.',
      'Add the corn and crack in the egg. Cover for 3 minutes.',
      'Pour into a bowl and top with spring onion.'
    ],
    tip: 'Add the miso after lowering the heat to keep its flavour.'
  },
  'potato-salad': {
    name: 'Japanese potato salad',
    servings: '2 servings',
    description: 'Creamy mashed potato with mayonnaise, cucumber and carrot — a cold side',
    ingredients: [
      'Potatoes 2',
      'Carrot ¼',
      'Cucumber ½',
      'Mayonnaise 2 tbsp',
      'Salt and pepper (a pinch)',
      'Sweet corn 2 tbsp (optional)'
    ],
    steps: [
      'Peel and cube the potatoes, dice the carrot and thinly slice the cucumber with a little salt.',
      'Boil the potatoes and carrot in the pot until a fork goes in easily, about 15 minutes.',
      'Drain and mash the potatoes roughly while hot. Let cool.',
      'Squeeze the cucumber dry and mix with mayonnaise, salt, pepper and corn.'
    ],
    tip: 'Let the potato cool before adding mayonnaise so it does not turn oily.'
  },
  'kinoko-gohan': {
    name: 'Japanese mushroom rice',
    servings: '2 servings',
    description: 'Rice cooked with mushrooms and soy sauce — fragrant and meat-free',
    ingredients: [
      'Japanese rice 1 cup',
      'Shimeji mushrooms ½ pack',
      'Shiitake mushrooms 3',
      'Carrot ¼',
      'Soy sauce 1½ tbsp',
      'Mirin 1 tbsp',
      'Water 220 ml'
    ],
    steps: [
      'Rinse the rice 2–3 times, soak for 20 minutes, then drain.',
      'Slice the shiitake, separate the shimeji and cut the carrot into thin strips.',
      'Put the rice, water, soy sauce and mirin in the pot with the mushrooms and carrot on top. Do not stir.',
      'Bring to a boil, cover, turn to the lowest heat and cook 15 minutes.',
      'Switch off and rest covered for 10 minutes, then fold the mushrooms through.'
    ],
    tip: 'Some electric pots run hot. If the bottom catches, use lower heat and 2 tbsp more water next time.'
  },
  kabocha: {
    name: 'Simmered pumpkin',
    servings: '2 servings',
    description: 'Sweet, tender pumpkin in a light soy broth — a side or snack',
    ingredients: ['Pumpkin 300 g', 'Water 200 ml', 'Soy sauce 1 tbsp', 'Mirin 1 tbsp', 'Sugar 1 tsp'],
    steps: [
      'Wash the pumpkin, scoop out the seeds and cut into 3 cm pieces. No need to peel it all.',
      'Lay the pumpkin skin-side down in the pot and add water, soy sauce, mirin and sugar.',
      'Bring to a boil, cover, lower the heat and simmer 12 minutes until a skewer goes in easily.',
      'Switch off and let it rest in the pot for 5 minutes to soak up the broth.'
    ],
    tip: 'Do not stir hard or the pumpkin will break — gently shake the pot instead.'
  },
  'yasai-curry': {
    name: 'Japanese vegetable curry',
    servings: '2 servings',
    description: 'All-vegetable curry with potato, pumpkin and carrot — thick and fragrant',
    ingredients: [
      'Cooked rice 2 cups',
      'Potato 1',
      'Pumpkin 150 g',
      'Carrot ½',
      'Onion ½',
      'Japanese curry roux 2 cubes',
      'Water 400 ml'
    ],
    steps: [
      'Cut the potato, pumpkin, carrot and onion into bite-size pieces.',
      'Add the vegetables and water to the pot, boil, then cover and simmer 15 minutes until the potato is soft.',
      'Switch off, add the curry roux and stir until dissolved.',
      'Simmer on low 3–5 minutes, stirring, until thick. Serve over rice.'
    ],
    tip: 'Some curry roux brands contain animal fat — check the label if you are vegetarian.'
  },
  chawanmushi: {
    name: 'Japanese steamed egg custard',
    servings: '2 cups',
    description: 'Silky, smooth steamed egg, cooked in one pot',
    ingredients: ['Eggs 2', 'Dashi stock 240 ml', 'Soy sauce 1 tsp', 'Shiitake mushrooms 2', 'Spring onion, sliced'],
    steps: [
      'Beat the eggs gently without making foam, then mix with cooled dashi and soy sauce.',
      'Strain the egg into 2 heatproof cups, add thinly sliced shiitake and cover each with foil.',
      'Pour about 2 cm of water into the pot, set the cups in and bring the water to a boil.',
      'Turn to the lowest heat, cover the pot leaving a small gap and steam 12–15 minutes.',
      'Poke the centre with a skewer — clear liquid means it is done. Top with spring onion.'
    ],
    tip: 'High heat makes the custard full of holes. Keep the heat low and the lid slightly open.'
  },
  zenzai: {
    name: 'Sweet red bean soup with mochi',
    servings: '2 cups',
    description: 'Warm sweet red beans with chewy mochi — canned beans work fine',
    ingredients: ['Canned sweet red bean paste 1 can (200 g)', 'Water 150 ml', 'Mochi 4 pieces', 'Salt (a pinch)'],
    steps: [
      'Put the red bean paste and water in the pot, stir and bring to a gentle boil on medium.',
      'Add a tiny pinch of salt to round out the sweetness. Add water if it is too thick.',
      'Add the mochi and cook 3–5 minutes until soft and puffed.',
      'Ladle into cups and eat warm.'
    ],
    tip: 'Hot mochi is very sticky — cut it small and chew slowly, especially for children and older people.'
  }
};

const DIFFICULTY_EN = { เริ่มง่าย: 'Easy', 'สบาย ๆ': 'Relaxed', ปานกลาง: 'Medium', เร็วทันใจ: 'Quick' };
if (LANG === 'en') {
  for (const r of recipes) {
    const en = RECIPES_EN[r.id];
    if (!en) continue;
    r._th = {
      name: r.name,
      servings: r.servings,
      description: r.description,
      ingredients: r.ingredients,
      steps: r.steps,
      tip: r.tip,
      difficulty: r.difficulty
    };
    Object.assign(r, en, { difficulty: DIFFICULTY_EN[r.difficulty] || r.difficulty });
  }
}

/* ---------- interface text ---------- */
const UI_EN = {
  'หม้อเดียว — ครัวญี่ปุ่นฉบับง่าย': 'Moh Diao — easy one-pot Japanese',
  หม้อเดียว: 'Moh Diao',
  'หม้อเดียว หน้าหลัก': 'Moh Diao home',
  ทำง่ายด้วยหม้อไฟฟ้าเครื่องเดียว: 'Easy cooking with one electric pot',
  แผนสัปดาห์: 'Week plan',
  ซื้อของ: 'Shopping',
  เมนูที่บันทึก: 'Saved',
  อร่อยแบบไม่ยุ่งยาก: 'tasty without fuss',
  ครัวญี่ปุ่น: 'Japanese cooking',
  เริ่มที่หม้อใบเดียว: 'starts with one pot',
  'มีแค่หม้อไฟฟ้าก็ทำมื้ออร่อยได้ เลือกเมนูที่ชอบ แล้วทำตามทีละขั้นได้เลย':
    'All you need is an electric pot. Pick a dish and follow it step by step.',
  วัตถุดิบหาง่าย: 'Easy-to-find ingredients',
  ไม่ต้องมีเตา: 'No stove needed',
  มื้ออร่อยของวันนี้: "today's meal",
  มื้อนี้ทำอะไรดี: 'What to cook',
  เลือกเมนู: 'Pick from',
  อย่าง: 'recipes',
  'ค้นหาเมนูหรือวัตถุดิบ...': 'Search dishes or ingredients…',
  กรองประเภทอาหาร: 'Filter by type',
  ทั้งหมด: 'All',
  เมนูข้าว: 'Rice',
  'ซุป & เส้น': 'Soup & noodles',
  หม้อไฟ: 'Hot pot',
  ของเคียง: 'Sides',
  ของหวาน: 'Dessert',
  ข้าว: 'Rice',
  ซุป: 'Soup',
  'ไม่เกิน 20 นาที': '20 min or less',
  'ไม่กิน…': "Don't eat…",
  มีอะไรในตู้เย็น: "What's in the fridge",
  สุ่มเมนูให้หน่อย: 'Surprise me',
  เพิ่มสูตรของฉัน: 'Add my recipe',
  ยังไม่เจอเมนูนี้: 'No dishes found',
  ลองค้นด้วยชื่อเมนูหรือวัตถุดิบอื่นดูนะ: 'Try another dish or ingredient.',
  ล้างตัวกรอง: 'Clear filters',
  ทำอาหารให้ง่ายขึ้นอีกนิด: 'making cooking a little easier',
  'สูตรสำหรับหม้อไฟฟ้าทั่วไป ปรับเวลาให้เข้ากับหม้อของคุณได้เลย':
    'Recipes for a typical electric pot — adjust times to yours',
  เครดิตภาพ: 'Photo credits',
  'เครดิตภาพอาหาร ↗': 'Photo credits ↗',
  ข้อมูลของฉัน: 'My data',
  สำรองข้อมูล: 'Back up',
  นำเข้า: 'Import',
  เมนูหลัก: 'Main menu',
  หน้าแรก: 'Home',
  ตู้เย็น: 'Fridge',
  สุ่มเมนู: 'Random',
  แผน: 'Plan',
  'ดูสูตร →': 'View recipe →',
  ดูสูตร: 'View',
  กลับไปเลือกเมนู: 'Back to dishes',
  ปิด: 'Close',
  กลับ: 'Back',
  'มีหม้อใบเดียวก็พอ:': 'One pot is enough:',
  'ถ้ายังไม่มีข้าวสวย หุงข้าวในหม้อใบนี้ก่อน พักข้าวไว้ แล้วค่อยทำกับข้าว หรือใช้ข้าวสวยพร้อมทานก็ได้':
    'No cooked rice yet? Cook rice in this pot first, set it aside, then make the dish — or use ready-to-eat rice.',
  สูตรของฉัน: 'My recipe',
  เวลา: 'Time',
  ปริมาณ: 'Serves',
  ระดับ: 'Level',
  เตรียมวัตถุดิบ: 'Ingredients',
  แตะเพื่อเช็กของที่มี: 'tap to tick off',
  ปรับปริมาณ: 'Adjust servings',
  เพิ่มวัตถุดิบลงรายการซื้อของ: 'Add ingredients to shopping list',
  วิธีทำ: 'Method',
  'ทิปหม้อไฟฟ้า:': 'Electric pot tip:',
  โน้ตของฉัน: 'My notes',
  บันทึกอัตโนมัติ: 'saved automatically',
  'บันทึกแล้ว ✓': 'saved ✓',
  'เช่น รอบหน้าลดโชยุลงนิดนึง หม้อเราเดือดเร็ว': 'e.g. less soy sauce next time, my pot boils fast',
  เริ่มทำทีละขั้น: 'Cook step by step',
  มีในรายการอยู่แล้ว: 'Already on the list',
  '✓ มีในรายการอยู่แล้ว': '✓ Already on the list',
  มุมมอง: 'View',
  แสดง: 'Show',
  แยกตามเมนู: 'By dish',
  รวมของซ้ำ: 'Combined',
  ยังไม่มีของในรายการ: 'Your list is empty',
  ไปตลาดกัน: "let's go shopping",
  รายการซื้อของ: 'Shopping list',
  'เปิดสูตรที่อยากทำ แล้วกด "เพิ่มวัตถุดิบลงรายการซื้อของ"':
    'Open a recipe and tap "Add ingredients to shopping list".',
  'ติ๊กของที่ซื้อแล้ว รายการจะเก็บไว้ในเครื่องนี้': 'Tick what you have bought. The list stays on this device.',
  ลบที่ซื้อแล้ว: 'Remove bought',
  ล้างทั้งหมด: 'Clear all',
  'แชร์ / คัดลอก': 'Share / copy',
  'คัดลอกแล้ว วางในแชทได้เลย ✓': 'Copied — paste it into a chat ✓',
  'คัดลอกไม่ได้ ลองใหม่อีกครั้ง': "Couldn't copy, try again",
  ใช้ในขั้นนี้: 'Used in this step',
  'ไม่มีของ? ใช้อะไรแทนได้': 'Missing something? Substitutes',
  วางแผนล่วงหน้า: 'plan ahead',
  เมนูประจำสัปดาห์: 'Weekly menu',
  'เลือกเมนูให้แต่ละวัน แล้วส่งวัตถุดิบทั้งหมดไปที่รายการซื้อของได้ในครั้งเดียว':
    'Pick a dish for each day, then send every ingredient to the shopping list at once.',
  วันนี้: 'today',
  '— ยังไม่เลือก —': '— not set —',
  ล้างแผน: 'Clear plan',
  สุ่มทั้งสัปดาห์: 'Randomise week',
  ส่งไปรายการซื้อของ: 'Send to shopping list',
  จันทร์: 'Mon',
  อังคาร: 'Tue',
  พุธ: 'Wed',
  พฤหัสฯ: 'Thu',
  ศุกร์: 'Fri',
  เสาร์: 'Sat',
  อาทิตย์: 'Sun',
  '✓ ทุกอย่างอยู่ในรายการซื้อของแล้ว': '✓ Everything is already on the list',
  'ครบเวลาแล้ว!': "Time's up!",
  'ยังไม่สุก? ต่อเวลาได้เลย': 'Not done? Add time',
  เสร็จแล้ว: 'Done',
  ยกเลิก: 'Cancel',
  ตั้งเวลาขั้นนี้: 'timer for this step',
  'อีก 1 นาที เตรียมตัวได้เลย': '1 minute left — get ready',
  โหมดทำอาหาร: 'Cooking mode',
  ออกจากโหมดทำอาหาร: 'Exit cooking mode',
  กำลังอ่านออกเสียง: 'Reading aloud',
  อ่านออกเสียง: 'Read aloud',
  ความคืบหน้า: 'Progress',
  '← ก่อนหน้า': '← Back',
  'ขั้นต่อไป →': 'Next →',
  'เสร็จแล้ว ✓': 'Finish ✓',
  'เสร็จแล้ว อร่อยได้เลย!': 'Done — enjoy!',
  'อร่อยแค่ไหน?': 'How was it?',
  ให้คะแนน: 'Rate',
  'ก่อนไปกิน เช็กหม้อหน่อย': 'Before you eat, check the pot',
  ปิดสวิตช์และถอดปลั๊กหม้อแล้ว: 'Switched off and unplugged',
  'วางหม้อบนที่ทนร้อน ห่างมือเด็ก': 'Pot on a heat-safe spot, away from children',
  'รอให้หม้อเย็นก่อนล้าง และอย่าให้น้ำโดนปลั๊ก': 'Let it cool before washing; keep water away from the plug',
  กลับไปดูสูตร: 'Back to recipe',
  ทำต่อ: 'Resume',
  ไม่ทำต่อ: 'Dismiss',
  เปลี่ยนเป็นโหมดสว่าง: 'Switch to light mode',
  เปลี่ยนเป็นโหมดมืด: 'Switch to dark mode',
  สลับโหมดมืด: 'Toggle dark mode',
  แก้ไขสูตร: 'Edit recipe',
  เพิ่มสูตรใหม่: 'New recipe',
  วางสูตรจากข้อความ: 'Paste a recipe as text',
  'วางสูตรที่ก๊อปมาจากเว็บหรือแชท บรรทัดแรกคือชื่อเมนู แล้วมีหัวข้อ “วัตถุดิบ” กับ “วิธีทำ”':
    'Paste a recipe from a website or chat. First line = name, then "Ingredients" and "Method" headings.',
  ข้อความสูตร: 'Recipe text',
  แยกใส่ฟอร์มให้: 'Fill the form',
  'รูปอาหาร (ไม่ใส่ก็ได้)': 'Photo (optional)',
  แตะเพื่อเลือกรูป: 'Tap to choose a photo',
  'ชื่อเมนู *': 'Dish name *',
  'เช่น ข้าวผัดไข่หม้อไฟฟ้า': 'e.g. Electric-pot egg fried rice',
  'ชื่อญี่ปุ่น / ชื่อรอง': 'Japanese / alternative name',
  หมวด: 'Category',
  'เวลา (นาที)': 'Time (min)',
  งบ: 'Budget',
  'คำอธิบายสั้น ๆ': 'Short description',
  'วัตถุดิบ *': 'Ingredients *',
  'บรรทัดละ 1 อย่าง ใส่ตัวเลขไว้ด้วยจะปรับปริมาณได้ เช่น “ไข่ไก่ 2 ฟอง”':
    'One per line. Include amounts to enable scaling, e.g. "Eggs 2".',
  'วิธีทำ *': 'Method *',
  'บรรทัดละ 1 ขั้น ใส่ “… 10 นาที” จะมีปุ่มจับเวลาให้':
    'One step per line. Write "… 10 minutes" to get a timer button.',
  ทิปหม้อไฟฟ้า: 'Electric pot tip',
  บันทึกสูตร: 'Save recipe',
  ใส่ชื่อเมนูก่อนนะ: 'Add a dish name first',
  'ใส่วัตถุดิบอย่างน้อย 1 อย่าง': 'Add at least 1 ingredient',
  'ใส่วิธีทำอย่างน้อย 1 ขั้น': 'Add at least 1 step',
  ติดตั้งจากในแอปนี้ไม่ได้: "Can't install from inside this app",
  'เปิดใน Safari': 'Open in Safari',
  เปิดในเบราว์เซอร์: 'Open in browser',
  เริ่มง่าย: 'Easy',
  'สบาย ๆ': 'Relaxed',
  ปานกลาง: 'Medium',
  เร็วทันใจ: 'Quick',
  '• อร่อยแบบไม่ยุ่งยาก': '• tasty without fuss',
  งบประมาณ: 'Budget',
  'อยากกินกี่โมง?': 'Eat at what time?',
  'ไม่กิน:': "Don't eat:",
  เนื้อวัว: 'Beef',
  หมู: 'Pork',
  ไก่: 'Chicken',
  ไม่กินเนื้อสัตว์: 'No meat',
  'ตั้งไว้ครั้งเดียว จำให้ตลอด': 'Set once, remembered',
  ขนาดตัวอักษร: 'Text size',
  ตัวอักษรเล็กลง: 'Smaller text',
  ตัวอักษรใหญ่ขึ้น: 'Larger text',
  พิมพ์สูตร: 'Print',
  แชร์ลิงก์: 'Share link',
  แก้ไข: 'Edit',
  ลบสูตร: 'Delete',
  'คัดลอกลิงก์แล้ว ✓': 'Link copied ✓',
  ใช้ของที่มีให้คุ้ม: 'use what you have',
  'ในตู้เย็นมีอะไรบ้าง?': "What's in your fridge?",
  'แตะเลือกของที่มีอยู่ แล้วดูว่าทำเมนูไหนได้บ้าง': 'Tap what you have and see which dishes you can make.',
  'ทำได้เลย / ขาดอีกนิด': 'Ready / almost',
  '✓ มีครบ ทำได้เลย': '✓ You have everything',
  เริ่มใหม่: 'Reset',
  'ดูสูตร → ': 'View recipe →',
  // the import box's example placeholder (multi-line)
  'ข้าวผัดไข่\n\nวัตถุดิบ\n- ข้าวสวย 1 ถ้วย\n- ไข่ไก่ 1 ฟอง\n\nวิธีทำ\n1. ตีไข่\n2. ผัดกับข้าว 3 นาที':
    'Egg fried rice\n\nIngredients\n- Cooked rice 1 cup\n- Egg 1\n\nMethod\n1. Beat the egg\n2. Stir-fry with the rice 3 minutes'
};
const UI_PATTERNS = [
  [/^(\d+) สูตรเริ่มต้น$/, '$1 starter recipes'],
  [/◷ (\d+) นาที/g, '◷ $1 min'],
  [/(\d+(?:–\d+)?) นาที/g, '$1 min'],
  [/^STEP (\d+) • (.+)$/, 'STEP $1 • $2'],
  [/^ต่อเวลา \+(\d+)/, 'Extra +$1'],
  [/^เริ่มจับเวลา (\d+) min$/, 'Start $1-min timer'],
  [/^\+(\d+) min$/, '+$1 min'],
  [/ทำแล้ว (\d+) ครั้ง/, 'Made $1×'],
  [/^(.+) พร้อมเสิร์ฟแล้ว • ทำไปแล้ว (\d+) ครั้ง$/, '$1 is ready • made $2×'],
  [/^✓ เพิ่มแล้ว (\d+) รายการ ดูได้ที่ปุ่ม “ซื้อของ” ด้านบน$/, '✓ Added $1 items — see Shopping'],
  [/^✓ เพิ่มแล้ว (\d+) รายการ$/, '✓ Added $1 items'],
  [/^วางแผนแล้ว (\d+)\/7 วัน • รวม (\d+) min$/, 'Planned $1/7 days • $2 min total'],
  [/^เลือกไว้ (\d+) อย่าง$/, '$1 selected'],
  [/^ขาด (\d+): (.+)$/, 'Missing $1: $2'],
  [/^ซ่อนอยู่ (\d+) เมนู$/, '$1 dishes hidden'],
  [/^(\d+) ขั้นตอน$/, '$1 steps'],
  [/^ทำ(.+)ค้างไว้$/, 'Unfinished: $1'],
  [/^ขั้นที่ (\d+) จาก (\d+)(.*)$/, 'Step $1 of $2$3'],
  [/ • ตัวจับเวลาเหลือ /, ' • timer left '],
  [/ • ตัวจับเวลาหมดแล้ว/, ' • timer finished'],
  [/ \(หมดเวลาระหว่างที่ปิดแอป\)/, ' (finished while closed)'],
  [
    /^(เช้านี้|มื้อเที่ยง|บ่ายนี้|มื้อเย็น|ดึกแล้ว)ลองนี่ไหม$/,
    (m, s) =>
      ({
        เช้านี้: 'This morning',
        มื้อเที่ยง: 'For lunch',
        บ่ายนี้: 'This afternoon',
        มื้อเย็น: 'For dinner',
        ดึกแล้ว: 'Late night'
      })[s] + ', try'
  ],
  [/^เริ่มทำตอน$/, 'Start at'],
  [/^\(อีก (\d+) min\)$/, '(in $1 min)'],
  [/^\(อีก (\d+) ชม\. (\d+) min\)$/, '(in $1 h $2 min)'],
  [/^ต้องเริ่มเลยตอนนี้ จะได้กินประมาณ (.+)$/, 'Start now to eat around $1'],
  [/^ให้ (\d+) ดาว$/, 'Rate $1 stars'],
  [/^เมนูวัน(.+)$/, (m, d) => 'Dish for ' + (UI_EN[d] || d)],
  [/^เช็ก (.+)$/, 'Tick $1'],
  [/^ดูสูตร (.+)$/, 'View $1'],
  [/^(นำออกจาก|บันทึก)เมนูโปรด$/, (m, a) => (a === 'บันทึก' ? 'Save to favourites' : 'Remove from favourites')],
  [
    /^✓ ได้วัตถุดิบ (\d+) อย่าง วิธีทำ (\d+) ขั้น ตรวจก่อนกดบันทึกนะ$/,
    '✓ Found $1 ingredients and $2 steps — check before saving'
  ],
  [
    /^ยังแยกไม่ได้ ลองใส่หัวข้อ “วัตถุดิบ” และ “วิธีทำ”$/,
    'Could not split it — add "Ingredients" and "Method" headings'
  ],
  [/^ลบสูตร “(.+)” ใช่ไหม\? ลบแล้วกู้คืนไม่ได้$/, 'Delete "$1"? This cannot be undone.'],
  [/^ล้างรายการซื้อของทั้งหมด\?$/, 'Clear the whole shopping list?'],
  [/^รายการซื้อของ — หม้อเดียว/, 'Shopping list — Moh Diao'],
  [
    /^นำเข้าข้อมูลจากไฟล์นี้\? ข้อมูลเดิมในเครื่องนี้ \((\d+) หมวด\) จะถูกแทนที่$/,
    'Import this file? Current data on this device ($1 sections) will be replaced.'
  ],
  [/^นำเข้าเรียบร้อย ✓$/, 'Imported ✓'],
  [/^ไฟล์นี้ไม่ใช่ไฟล์สำรองของหม้อเดียว$/, 'This is not a Moh Diao backup file'],
  [/^เบราว์เซอร์นี้อ่านออกเสียงไม่ได้$/, 'This browser cannot read aloud'],
  [
    /^เครื่องนี้อาจยังไม่มีเสียงภาษาไทย.*$/,
    'No English voice found on this device. Add one in your system speech settings.'
  ],
  [/^พื้นที่เก็บข้อมูลในเบราว์เซอร์เต็ม.*$/, 'Browser storage is full — try a smaller photo or none.'],
  [/^กด ⋯ หรือปุ่มแชร์.*$/, 'Tap ⋯ or Share, choose "Open in Safari", then Share → Add to Home Screen'],
  [/^กด ⋮ แล้วเลือก.*$/, 'Tap ⋮, choose "Open in browser" (Chrome), then Install app'],
  [/^เปิดรูปนี้ไม่ได้ ลองรูปอื่นนะ$/, "Couldn't open that photo — try another."],
  [/^ขั้นที่ (\d+)\. /, 'Step $1. '],
  [/^เสร็จแล้ว อร่อยได้เลย$/, 'Done, enjoy'],
  [/^⏱ (.+) — หม้อเดียว$/, '⏱ $1 — Moh Diao'],
  [/^⏰ ครบเวลา — หม้อเดียว$/, "⏰ Time's up — Moh Diao"]
];
const THAI = /[฀-๿]/;
function tr(text) {
  if (LANG !== 'en' || !text || !THAI.test(text)) return text;
  const key = text.trim();
  if (UI_EN[key]) return text.replace(key, UI_EN[key]);
  let out = key;
  for (const [re, to] of UI_PATTERNS) out = out.replace(re, to);
  return out === key ? text : text.replace(key, out);
}

if (LANG === 'en') {
  const ATTRS = ['placeholder', 'aria-label', 'title'];
  const translateNode = (root) => {
    if (root.nodeType === 3) {
      const next = tr(root.nodeValue);
      if (next !== root.nodeValue) root.nodeValue = next;
      return;
    }
    if (root.nodeType !== 1 || root.closest?.('[data-no-translate]')) return;
    for (const a of ATTRS)
      if (root.hasAttribute?.(a)) {
        const v = root.getAttribute(a),
          n = tr(v);
        if (n !== v) root.setAttribute(a, n);
      }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (n.nodeType === 3) {
        if (n.parentElement?.closest('textarea,[data-no-translate]')) continue;
        const next = tr(n.nodeValue);
        if (next !== n.nodeValue) n.nodeValue = next;
      } else
        for (const a of ATTRS)
          if (n.hasAttribute(a)) {
            const v = n.getAttribute(a),
              t = tr(v);
            if (t !== v) n.setAttribute(a, t);
          }
    }
  };
  document.title = tr(document.title);
  translateNode(document.body);
  new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === 'characterData') translateNode(m.target);
      else if (m.type === 'attributes') translateNode(m.target);
      else m.addedNodes.forEach(translateNode);
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS
  });
  new MutationObserver(() => {
    const t = tr(document.title);
    if (t !== document.title) document.title = t;
  }).observe(document.querySelector('title'), { childList: true, characterData: true, subtree: true });
  const _alert = window.alert.bind(window),
    _confirm = window.confirm.bind(window);
  window.alert = (msg) => _alert(tr(String(msg)));
  window.confirm = (msg) => _confirm(tr(String(msg)));
  window.addEventListener('DOMContentLoaded', () => {
    if (typeof speak === 'function') {
      const _speak = speak;
      speak = (text) => _speak(tr(text));
    }
  });
}

function setLanguage(lang) {
  try {
    localStorage.setItem('onepot-lang', JSON.stringify(lang));
  } catch {}
  location.reload();
}
