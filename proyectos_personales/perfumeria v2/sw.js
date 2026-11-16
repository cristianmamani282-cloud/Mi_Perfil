/* =========================================================
   ESSENZA PWA - SERVICE WORKER
   Diseño Web II (SIS-0141) - Entregable C3-A1
   Estrategia de caché: Stale-While-Revalidate con Fallback Offline
========================================================= */

const CACHE_NAME = 'essenza-pwa-v2.1';

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

// 1. INSTALACIÓN: Pre-cacheo de recursos críticos (Tree Shaking manual & Fast Load)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Pre-cacheando recursos esenciales PWA...');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => {
                console.warn('[SW] Fallo parcial en pre-cache:', err);
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
                            console.log('[SW] Eliminando caché antiguo:', name);
                            return caches.delete(name);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// 3. FETCH: Estrategia de respuesta rápida y soporte Offline
self.addEventListener('fetch', (event) => {
    // Solo gestionar solicitudes GET
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
                        // En caso de estar sin conexión y navegar a una página
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                    });

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Recursos externos (imágenes de Unsplash, FontAwesome, jQuery CDN)
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;

            return fetch(event.request)
                .then((networkResponse) => {
                    // Guardar en caché recursos externos válidos u opacos
                    if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Fallback para imágenes externas si está offline
                    if (event.request.destination === 'image') {
                        return caches.match('./icons/icon-192.png');
                    }
                });
        })
    );
});
