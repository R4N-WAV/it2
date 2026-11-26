/* Offline-støtte: appen og alt innhold caches ved første besøk, slik at leksjoner og oppgaver virker uten nett. */
const CACHE = 'it2-rea3050-v3';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './favicon.svg'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n !== CACHE).map((n) => caches.delete(n)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Sider: nett først (nyeste versjon), cache som reserve når du er offline.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const kopi = r.clone(); caches.open(CACHE).then((c) => c.put('./index.html', kopi)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // Skript, stiler, fonter: cache først.
  if (url.origin === location.origin || url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.match(req).then((treff) => treff || fetch(req).then((r) => {
      if (r.ok || r.type === 'opaque') { const kopi = r.clone(); caches.open(CACHE).then((c) => c.put(req, kopi)); }
      return r;
    })));
  }
});
