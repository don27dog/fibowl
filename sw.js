// Minimal service worker so Android Chrome treats the score sheet as an installable app
// (installed apps get a clean icon without the Chrome badge). Network first, cached copy if offline.
const CACHE = 'fibowl-v1';
const FILES = ['./', './index.html', './manifest.webmanifest?v=2', './icon-192.png?v=2', './icon-512.png?v=2', './apple-touch-icon.png?v=2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{}); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
