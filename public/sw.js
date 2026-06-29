/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CACHE_NAME = 'krishok-bazar-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Install Service Worker and pre-cache basic static shells
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline shell and assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate & clean up old obsolete caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((allCacheNames) => {
      return Promise.all(
        allCacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event with Cache-First strategy for static assets and Network-First with backup for other items
self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  // Let browser handle bypass routes like cloud Firestore directly or server APIs
  const requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.startsWith('/api/') || requestUrl.host.includes('firestore.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache & perform a background update (Stale-While-Revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => { /* offline silent fail */ });
        
        return cachedResponse;
      }

      // If not cached, attempt network fetch
      return fetch(event.request).then((networkResponse) => {
        // Cache images, styles, and other statics on-the-fly
        // Support caching of opaque responses (status === 0) specifically for cross-origin product images
        const isOpaqueImage = networkResponse && networkResponse.status === 0 && event.request.destination === 'image';
        if (
          networkResponse &&
          (networkResponse.status === 200 || isOpaqueImage) &&
          (event.request.destination === 'image' || 
           event.request.destination === 'style' || 
           event.request.destination === 'script' || 
           event.request.destination === 'font' ||
           requestUrl.pathname.endsWith('.js') ||
           requestUrl.pathname.endsWith('.css'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        // Fallback to caching shell for SPA routing (index.html link) if offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }
        console.warn('[Service Worker] Network request failed and asset was not cached:', err);
        return new Response('আন্তর্জালে বিচ্যুতি চিহ্নিত হয়েছে। আপনি অফলাইনে আছেন।', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
        });
      });
    })
  );
});

// LISTEN FOR PUSH NOTIFICATIONS
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification event received');
  
  let data = {
    title: 'কৃষক বাজার (Krishok Bazar)',
    body: 'নতুন ফসল সংগ্রহ করা হয়েছে! এখনই আমাদের বাজারে প্রবেশ করে আকর্ষণীয় কমিশন উপভোগ করুন।',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg'
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.svg',
    badge: data.badge || '/icon-192.svg',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'বাজার দেখুন 🌾' },
      { action: 'close', title: 'বন্ধ করুন ❌' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// HANDLES NOTIFICATION CLICKS OR ACTIONS
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = event.notification.data ? event.notification.data.url : '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and redirect
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new tab/window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
