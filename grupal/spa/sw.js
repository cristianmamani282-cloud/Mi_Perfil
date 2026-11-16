/**
 * ASIO Spa Asiático - Service Worker
 * Proporciona soporte offline completo, caching inteligente y rendimiento PWA de alta velocidad.
 */

const CACHE_NAME = 'asio-spa-cache-v1.0.0';
const DYNAMIC_CACHE_NAME = 'asio-spa-dynamic-v1.0.0';

const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png'
];

// Instalación: Pre-almacena en caché los archivos fundamentales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpia versiones antiguas de caché y toma control de inmediato
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptor de peticiones (Fetch)
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Ignorar protocolos no HTTP/HTTPS (por ejemplo, extensiones de navegador)
  if (!requestUrl.protocol.startsWith('http')) {
    return;
  }

  // Peticiones de navegación (cargar página HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match('./index.html') || caches.match(event.request);
        })
    );
    return;
  }

  // Peticiones a assets locales (CSS, JS, iconos, manifest)
  if (requestUrl.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidar en segundo plano para mantener assets frescos
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {/* Offline silencioso */});
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        });
      })
    );
    return;
  }

  // Peticiones externas (Google Fonts, Unsplash Images)
  // Estrategia: Cache First con fallback a Network y almacenamiento dinámico
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((dynamicCache) => {
            dynamicCache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Si falla internet y no está en caché, responder de forma segura sin romper la app
          return new Response('', { status: 408, statusText: 'Offline' });
        });
    })
  );
});

