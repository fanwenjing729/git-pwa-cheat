// Cache version -- bump this to push updates
var CACHE_NAME = 'git-cheat-v1';

// Resources to precache on install
var PRECACHE_URLS = [
  '/git-pwa-cheat/',
  '/git-pwa-cheat/index.html',
  '/git-pwa-cheat/style.css',
  '/git-pwa-cheat/app.js',
  '/git-pwa-cheat/manifest.json',
  '/git-pwa-cheat/icon-192.png',
  '/git-pwa-cheat/icon-512.png'
];

// ---------- install: precache all static assets ----------
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS).catch(function(err) {
        console.warn('SW precache partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

// ---------- activate: purge old caches ----------
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// ---------- fetch ----------
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // HTML: network-first, fall back to cache
  var accept = event.request.headers.get('Accept') || '';
  if (accept.indexOf('text/html') !== -1 ||
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var cloned = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, cloned);
        });
        return response;
      }).catch(function() {
        return caches.match(event.request).then(function(cached) {
          return cached || caches.match('/git-pwa-cheat/');
        });
      })
    );
    return;
  }

  // Everything else: cache-first, fall back to network
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        var cloned = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, cloned);
        });
        return response;
      });
    })
  );
});
