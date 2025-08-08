// Service worker for caching static assets
const CACHE_NAME = 'matthewgall-v2';
const STATIC_CACHE_URLS = [
  '/',
  '/about/',
  '/contact/', 
  '/tools/',
  '/posts/',
  '/offline.html'
];

// Cache strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets (CSS, JS, images)
  CACHE_FIRST: 'cache-first',
  // Network first for pages (HTML)
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate for everything else
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache core resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core files');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('Service Worker: Cache install failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event with different strategies
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Determine cache strategy based on request type
    if (request.destination === 'style' || request.destination === 'script' || request.destination === 'image') {
      // Cache first for static assets
      return await cacheFirstStrategy(request);
    } else if (request.destination === 'document' || url.pathname.endsWith('/')) {
      // Network first for pages
      return await networkFirstStrategy(request);
    } else {
      // Stale while revalidate for everything else
      return await staleWhileRevalidateStrategy(request);
    }
  } catch (error) {
    console.error('Service Worker: Fetch failed:', error);
    
    // Return offline fallback for navigation requests
    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/');
      return offlineResponse || new Response('Offline', { status: 503 });
    }
    
    return new Response('Network Error', { status: 503 });
  }
}

// Cache first strategy - good for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request.clone(), networkResponse.clone());
  }
  
  return networkResponse;
}

// Network first strategy - good for pages
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request.clone(), networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match('/');
  }
}

// Stale while revalidate strategy - good for API calls
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then(c => c.put(request.clone(), networkResponse.clone()));
    }
    return networkResponse;
  });
  
  return cachedResponse || networkResponsePromise;
}