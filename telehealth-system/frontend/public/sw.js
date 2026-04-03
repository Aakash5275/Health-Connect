// Service Worker for Rural TeleHealth PWA
const CACHE_NAME = 'telehealth-v1';
const DYNAMIC_CACHE = 'telehealth-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets - Cache first, network fallback
  event.respondWith(cacheFirstStrategy(request));
});

// Cache first strategy
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Return cached response and update cache in background
    fetchAndCache(request);
    return cachedResponse;
  }
  
  return fetchAndCache(request);
}

// Network first strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for API requests
    return new Response(
      JSON.stringify({ 
        error: 'You are offline. Please check your internet connection.',
        offline: true 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 503 
      }
    );
  }
}

// Fetch and cache helper
async function fetchAndCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached response or offline page
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match('/');
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-appointments') {
    event.waitUntil(syncAppointments());
  }
});

async function syncAppointments() {
  // Sync any pending appointment data when back online
  console.log('Syncing offline appointments...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  const options = {
    body: data.body || 'New notification from TeleHealth',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id
    },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'TeleHealth', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
