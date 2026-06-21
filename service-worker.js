// ===========================
// SERVICE WORKER
// ===========================
// This service worker enables offline functionality and caching for PWA

const CACHE_VERSION = 'weather-bot-v1';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/js/config.js',
    '/js/api.js',
    '/js/storage.js',
    '/js/ui.js',
    '/js/main.js',
    '/js/weather-logic.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => {
                console.log('[Service Worker] Caching app resources');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => self.skipWaiting()) // Activate immediately
            .catch((error) => {
                console.error('[Service Worker] Cache failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_VERSION) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Control clients immediately
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and external resources from different origins
    if (request.method !== 'GET') {
        return;
    }

    // Network first strategy for API calls
    if (url.pathname.includes('/api/') || request.url.includes('openweathermap')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache successful API responses
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_VERSION).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Return cached response if network fails
                    return caches.match(request)
                        .then((cachedResponse) => {
                            return cachedResponse || createOfflineResponse();
                        });
                })
        );
        return;
    }

    // Cache first strategy for static assets
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then((response) => {
                        // Cache successful responses for static assets
                        if (response && response.status === 200 && isStaticAsset(request.url)) {
                            const responseClone = response.clone();
                            caches.open(CACHE_VERSION).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return createOfflineResponse();
                        }
                        return null;
                    });
            })
    );
});

/**
 * Check if URL is a static asset
 * @param {string} url - The URL to check
 * @returns {boolean} True if it's a static asset
 */
function isStaticAsset(url) {
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf'];
    return staticExtensions.some(ext => url.includes(ext));
}

/**
 * Create offline response
 * @returns {Response} HTML response for offline mode
 */
function createOfflineResponse() {
    return new Response(`
        <!DOCTYPE html>
        <html lang="pl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tryb Offline</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #333;
                }
                .offline-container {
                    background: white;
                    border-radius: 12px;
                    padding: 2rem;
                    max-width: 500px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    text-align: center;
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                h1 {
                    font-size: 1.8rem;
                    margin-bottom: 0.5rem;
                    color: #667eea;
                }
                p {
                    font-size: 1rem;
                    color: #666;
                    line-height: 1.6;
                }
                .offline-tips {
                    margin-top: 1.5rem;
                    padding: 1rem;
                    background: #f0f9ff;
                    border-radius: 8px;
                    text-align: left;
                }
                .offline-tips h3 {
                    color: #667eea;
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }
                .offline-tips ul {
                    list-style: none;
                    font-size: 0.85rem;
                    color: #555;
                }
                .offline-tips li {
                    padding: 0.25rem 0;
                }
                .retry-btn {
                    margin-top: 1.5rem;
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .retry-btn:hover {
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📡</div>
                <h1>Brak połączenia internetowego</h1>
                <p>Wygląda na to, że utracono połączenie z siecią. Aplikacja jest dostępna w trybie offline z poprzednio pobranymi danymi.</p>
                
                <div class="offline-tips">
                    <h3>Co możesz zrobić:</h3>
                    <ul>
                        <li>✓ Przejrzeć historię poprzednich zapytań</li>
                        <li>✓ Czekać na przywrócenie połączenia</li>
                        <li>✓ Odświeżyć stronę, gdy będzie połączenie</li>
                    </ul>
                </div>
                
                <button class="retry-btn" onclick="location.reload()">
                    🔄 Spróbuj ponownie
                </button>
            </div>
        </body>
        </html>
    `, {
        status: 200,
        statusText: 'OK',
        headers: new Headers({
            'Content-Type': 'text/html; charset=utf-8'
        })
    });
}

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[Service Worker] Loaded and ready');
