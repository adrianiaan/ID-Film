// src/sw.js
self.addEventListener('install', (event) => {
    console.log('Installing Service Worker...');
    event.waitUntil(
      caches.open('id-film-v1').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/favicon.png',
          '/app.bundle.js',
          '/app.webmanifest',
          '/src/public/images/placeholder.png',
          '/src/public/images/logo.png',
        ]);
      })
    );
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Activating Service Worker...');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((cacheName) => {
            return cacheName !== 'id-film-v1';
          }).map((cacheName) => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
  
    // Skip cross-origin requests
    if (requestUrl.origin === location.origin) {
      // Cache first for assets
      if (event.request.url.includes('/src/public/')) {
        event.respondWith(cacheFirst(event.request));
      } else if (event.request.url.includes('api.themoviedb.org')) {
        // Network first for API calls
        event.respondWith(networkFirst(event.request));
      } else {
        // Cache first for HTML and other static assets
        event.respondWith(cacheFirst(event.request));
      }
    }
  });
  
  const cacheFirst = async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
  
    try {
      const networkResponse = await fetch(request);
      await cacheResponse(request, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      // Return fallback for images if available
      if (request.destination === 'image') {
        return caches.match('/src/public/images/placeholder.png');
      }
      throw error;
    }
  };
  
  const networkFirst = async (request) => {
    try {
      const networkResponse = await fetch(request);
      await cacheResponse(request, networkResponse.clone());
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  };
  
  const cacheResponse = async (request, response) => {
    const cache = await caches.open('id-film-v1');
    // Only cache successful responses
    if (response.status === 200) {
      await cache.put(request, response);
    }
  };