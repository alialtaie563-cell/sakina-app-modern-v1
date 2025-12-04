
const CACHE_NAME = 'sakina-cache-v2';
const DYNAMIC_CACHE = 'sakina-dynamic-v2';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Network First for API, Cache First for Assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. API Requests (Network first, handled by api.ts but good to have fallback)
  if (url.pathname.startsWith('/api')) {
     return; // Let the app handle API caching internally via api.ts
  }

  // 2. Static Assets (Cache First)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return caches.open(DYNAMIC_CACHE).then((cache) => {
            // Cache any new static assets (JS, CSS, Images)
            if (event.request.method === 'GET' && networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
        });
      }).catch(() => {
         if (event.request.headers.get('accept').includes('text/html')) {
             return caches.match('/index.html');
         }
      });
    })
  );
});
