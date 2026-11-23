/* =========================================================
   PERFUMERÍA PIPE FERNANDEZ - PWA SERVICE WORKER
   Estrategia de caché: Stale-While-Revalidate con Modo Offline Total
========================================================= */

const CACHE_NAME = 'pipe-fernandez-pwa-v1.0';

const PRECACHE_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './scrip.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-192-maskable.png',
    './icons/icon-512-maskable.png',
    './icons/favicon.png'
];

// 1. INSTALACIÓN: Pre-cacheo de recursos críticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW - Pipe Fernandez] Pre-cacheando recursos PWA...');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => {
                console.warn('[SW - Pipe Fernandez] Fallo en precache inicial:', err);
            })
    );
});

// 2. ACTIVACIÓN: Limpieza de cachés obsoletos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((name) => {
                        if (name !== CACHE_NAME) {
                            console.log('[SW - Pipe Fernandez] Eliminando caché previo:', name);
                            return caches.delete(name);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// 3. FETCH: Estrategia de respuesta ultra rápida y soporte Offline
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const requestUrl = new URL(event.request.url);

    // Recursos locales del mismo origen
    if (requestUrl.origin === location.origin) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                    });

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Recursos externos (imágenes, Google Fonts, FontAwesome, TikTok embed script, CDN)
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Si falla la red y no está en caché
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
        })
    );
});
