/**
 * Service Worker - Pollos Yack's PWA (Versión 2)
 * Soporte de caché y modo offline
 */

const CACHE_NAME = 'pollos-yacks-v2-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './estilos.css',
  './script.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://assets.olaclick.app/companies/logos/40f62129-d3fa-4bb8-b494-8af219ca4239.png',
];

// Instalación: Precarga de recursos clave en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precargando caché para modo offline...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activación: Limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Eliminando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepción de peticiones (Network First con fallback a Cache para máxima frescura, y Cache First para recursos estáticos)
self.addEventListener('fetch', (event) => {
  // Ignorar llamadas que no sean GET o esquemas no soportados
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Peticiones a la API: intentar red primero
  if (url.pathname.includes('/api/v1/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ success: false, offline: true, message: 'Modo offline activo' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // Peticiones a assets y páginas: Estrategia Cache First con actualización en segundo plano
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // En background actualizar caché
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback a index.html para navegación offline
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
