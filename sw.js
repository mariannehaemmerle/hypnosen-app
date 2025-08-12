// Einfacher Service Worker für GitHub Pages
const CACHE = 'hypnosen-app-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Wenn du Icons hinzufügst, hier listen:
  // './icon-192.png',
  // './icon-512.png',
];

// Beim Install: Grunddateien cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Aktivieren
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Netzwerkanfragen abfangen: Cache-first, dann Netzwerk
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Response kopieren und in Cache legen
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match('./index.html')); // Fallback offline
    })
  );
});
