self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('bolidesh-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/about us.html',
        '/contact us.html',
        '/manifest.json',
        '/favicon.ico'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});