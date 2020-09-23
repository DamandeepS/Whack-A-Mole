
(() => {

    const cacheName = 'WhackAMole-v1';
    var appShellFiles = [
    './index.html',
    './styles/main.css',
    './scripts/customEvents.polyfill.js',
    './scripts/whackAMole.js',
    './scripts/view.js',
    '/assets/icons/144.png',
    '/assets/icons/512.png'
    ];

    self.addEventListener('install', (e) => {
        console.log('[Service Worker] Install');
        e.waitUntil(
            caches.open(cacheName).then((cache) => {
                  console.log('[Service Worker] Caching all: app shell and content');
              return cache.addAll(appShellFiles);
            })
          );
    });    

    self.addEventListener('fetch', (e) => {
        e.respondWith(
          caches.match(e.request).then((r) => {
                console.log('[Service Worker] Fetching resource: '+e.request.url);
            return r || fetch(e.request).then((response) => {
                      return caches.open(cacheName).then((cache) => {
                console.log('[Service Worker] Caching new resource: '+e.request.url);
                cache.put(e.request, response.clone());
                return response;
              });
            });
          })
        );
      });
})();


