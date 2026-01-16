// Service Worker for Epic 2 - Enhanced Offline Caching
const CACHE_NAME = 'edupro-epic2-v1.1.0';
const STATIC_CACHE = 'edupro-static-v1.1.0';
const DYNAMIC_CACHE = 'edupro-dynamic-v1.1.0';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/dashboard/courses',
  '/icons/android-chrome-192x192.png',
  '/icons/apple-touch-icon.png',
  '/manifest.json'
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /^\/api\/learning\/progress/,
  /^\/api\/learning\/devices/,
  /^\/api\/learning\/events/,
  /^\/api\/learning\/milestones/
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Do NOT intercept Next.js runtime/static assets to avoid serving stale chunks
  // Let the browser HTTP cache handle them (they are hash-versioned)
  if (url.pathname.startsWith('/_next/')) {
    return; // bypass SW
  }

  // Bloquer explicitement certains appels API élève lorsque la page initiatrice
  // n'est pas une page /dashboard. Utilise event.clientId (plus fiable que referrer).
  if (request.method === 'GET' && url.pathname.startsWith('/api/v1/student/dashboard/')) {
    event.respondWith((async () => {
      try {
        const client = event.clientId ? await self.clients.get(event.clientId) : null;
        const clientPath = client ? new URL(client.url).pathname : '';
        if (!clientPath.startsWith('/dashboard')) {
          return new Response(null, { status: 204 });
        }
      } catch (e) {
        return new Response(null, { status: 204 });
      }
      return fetch(request);
    })());
    return;
  }

  // Temporarily disable service worker for payment APIs to fix issues
  if (url.pathname.includes('/api/payments/')) {
    return; // Let the browser handle payment requests normally
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    if (isStaticAsset(url)) {
      event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isAPIRequest(url)) {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
      event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
  } else if (request.method === 'POST' || request.method === 'PUT') {
    // Handle API mutations - store for offline sync
    // Skip payment APIs
    if (isAPIRequest(url) && !url.pathname.includes('/api/payments/')) {
      event.respondWith(handleAPIMutation(request));
    }
  }
});

// Caching strategies
async function cacheFirst(request, cacheName) {
  try {
    // Check if request scheme is supported
    const url = new URL(request.url);
    if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:' || url.protocol === 'safari-extension:') {
      return fetch(request);
    }

    const cache = await caches.open(cacheName);
    const response = await cache.match(request);
    
    if (response) {
      return response;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cache = await caches.open(cacheName);
    const response = await cache.match(request);
    
    if (response) {
      return response;
    }
    
    // Return offline response for API requests
    if (isAPIRequest(new URL(request.url))) {
      return new Response(JSON.stringify({
        error: 'Offline - données en cache non disponibles',
        offline: true
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Offline', { status: 503 });
  }
}

async function handleAPIMutation(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      return response;
    }
    
    // If network fails, store for background sync
    if (!navigator.onLine) {
      await storeForBackgroundSync(request);
      
      return new Response(JSON.stringify({
        success: true,
        offline: true,
        message: 'Enregistré pour synchronisation ultérieure'
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return response;
  } catch (error) {
    await storeForBackgroundSync(request);
    
    return new Response(JSON.stringify({
      success: true,
      offline: true,
      message: 'Enregistré pour synchronisation ultérieure'
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function isStaticAsset(url) {
  // Exclure explicitement /_next/** (déjà géré en amont)
  return url.pathname.startsWith('/static/') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.svg');
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') ||
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Prendre le contrôle immédiatement des clients
        return self.clients.claim();
      })
  );
});

// Handle background sync for offline API requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-progress') {
    event.waitUntil(syncOfflineProgress());
  }
});

async function storeForBackgroundSync(request) {
  const data = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers),
    body: await request.text(),
    timestamp: Date.now()
  };
  
  // Store in IndexedDB for background sync
  const db = await openIndexedDB();
  const transaction = db.transaction(['offline_requests'], 'readwrite');
  const store = transaction.objectStore('offline_requests');
  
  await store.add(data);
  
  // Register background sync
  await self.registration.sync.register('background-sync-progress');
}

async function syncOfflineProgress() {
  const db = await openIndexedDB();
  const transaction = db.transaction(['offline_requests'], 'readwrite');
  const store = transaction.objectStore('offline_requests');
  
  const requests = await store.getAll();
  
  for (const requestData of requests) {
    try {
      const response = await fetch(requestData.url, {
        method: requestData.method,
        headers: requestData.headers,
        body: requestData.body
      });
      
      if (response.ok) {
        await store.delete(requestData.id);
        console.log('Offline request synced:', requestData.url);
      }
    } catch (error) {
      console.error('Failed to sync offline request:', error);
    }
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('edupro_offline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('offline_requests')) {
        const store = db.createObjectStore('offline_requests', {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('url', 'url');
      }
    };
  });
}

// Gestion des notifications push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/android-chrome-192x192.png',
    badge: '/icons/android-chrome-192x192.png',
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Ouvrir l'URL associée à la notification lorsqu'on clique dessus
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
}); 