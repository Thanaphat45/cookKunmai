// Offline cache for หม้อเดียว. Bump VERSION whenever app files change.
const VERSION = 'onepot-v11';
const FILES = [
  './',
  'index.html',
  'styles.css',
  'recipes.js',
  'i18n.js',
  'core.js',
  'app.js',
  'features.js',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/icons/apple-touch-icon.png',
  'favicon.svg',
  'manifest.webmanifest',
  'assets/recipes/credits.html',
  ...[
    'oyakodon',
    'gyudon',
    'curry',
    'zosui',
    'kitsune-udon',
    'miso-soup',
    'nabe',
    'nikujaga',
    'miso-ramen',
    'potato-salad',
    'kinoko-gohan',
    'kabocha',
    'yasai-curry',
    'chawanmushi',
    'zenzai'
  ].map((name) => `assets/recipes/${name}.jpg`)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Network first (so edits show up), fall back to cache when offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
