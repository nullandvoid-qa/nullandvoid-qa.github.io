/**
 * Service Worker for Null and Void QA Course
 * Provides offline support and caching strategy
 * 
 * @global self
 * @global clients
 */

const CACHE_VERSION = "v1.0.10";
const CACHE_NAME = `nullandvoid-${CACHE_VERSION}`;
const RUNTIME_CACHE = `nullandvoid-runtime-${CACHE_VERSION}`;

const NETWORK_FIRST_ASSETS = [
  "/js/i18n.js",
  "/js/icons.js",
  "/js/auth.js",
  "/data/translations-en.js"
];

function isNetworkFirstAsset(request) {
  const url = new URL(request.url);
  return NETWORK_FIRST_ASSETS.includes(url.pathname) || url.pathname.startsWith("/data/");
}

function shouldServeOfflinePage(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

async function createOfflinePageResponse() {
  let texts = null;
  try {
    const res = await fetch('/data/translations-pt.json');
    if (res && res.ok) {
      const json = await res.json();
      // expected shape: { offline: { title, heading, message, cta, lang } }
      if (json && json.offline) texts = json.offline;
    }
  } catch (e) {
    // ignore fetch errors and fall back to built-in defaults
  }

  const t = Object.assign(
    {
      title: 'Null and Void - Offline',
      heading: 'Você está offline',
      message: 'O conteúdo não está disponível no momento, mas você ainda pode retornar à página inicial.',
      cta: 'Voltar para a home',
      lang: 'pt-BR',
    },
    texts || {},
  );

  return new Response(
    `<!DOCTYPE html>
      <html lang="${t.lang}">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${escapeHtml(t.title)}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: system-ui, sans-serif; background: #0b1120; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; }
            .container { text-align: center; max-width: 520px; }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
            a { color: #38bdf8; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📡</div>
            <h1>${escapeHtml(t.heading)}</h1>
            <p>${escapeHtml(t.message)}</p>
            <p><a href="/">${escapeHtml(t.cta)}</a></p>
          </div>
        </body>
      </html>`,
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    },
  );
}

// Minimal HTML-escape helper for insertion into the offline page
function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Assets to cache on install
const CRITICAL_ASSETS = [
  "/",
  "/index.html",
  "/verify.html",
  "/css/styles.css",
  "/js/app.js",
  "/js/icons.js",
  "/js/utils.js",
  "/js/i18n.js",
  "/js/auth.js",
  "/js/certificates.js",
  "/data/tracks.js",
  "/data/quizzes.js",
  "/data/checklists.js",
  "/data/glossary.js",
  "/data/achievements.js",
  "/data/labs.js",
  "/data/lesson-enrichment.js",
  "/data/translations-en.js",
  "/data/lesson-quizzes.js",
  "/data/performance-track.js",
  "/data/mentorship.js",
  "/data/mobile-labs.js",
  "/data/daily-challenges.js",
  "/data/video-scripts.js"
];


// Install: cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CRITICAL_ASSETS).catch((err) => {
        console.warn("[SW] Some assets failed to cache (normal):", err);
        // Don't fail install if some assets can't be cached
      });
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all clients immediately

  // Notify open pages that a new service worker has taken control so they can reload.
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
    for (const client of clients) {
      try {
        client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
      } catch (e) {
        // ignore
      }
    }
  });
});

// Fetch: implement caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests. POST, PUT and other methods should bypass the cache.
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip chrome extensions and other non-http(s) requests
  if (!request.url.startsWith("http")) {
    return;
  }

  // Strategy: Network first for translation assets, cache first for most static assets,
  // and network first for anything else that may change frequently.
  if (isNetworkFirstAsset(request)) {
    event.respondWith(networkFirst(request));
  } else if (
    request.url.includes("/css/") ||
    request.url.includes("/js/") ||
    request.url.includes("/data/") ||
    request.url.endsWith(".js") ||
    request.url.endsWith(".css")
  ) {
    // Cache first for static assets
    event.respondWith(cacheFirst(request));
  } else {
    // Network first for HTML and dynamic content
    event.respondWith(networkFirst(request));
  }
});

/**
 * Cache first strategy: try cache, fall back to network
 */
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Cache successful responses
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());

    return response;
  } catch (error) {
    console.warn("[SW] Cache first failed:", error);
    if (shouldServeOfflinePage(request)) {
      return createOfflinePageResponse();
    }

    return new Response("Offline - asset not available", {
      status: 503,
      statusText: "Service Unavailable"
    });
  }
}

/**
 * Network first strategy: try network, fall back to cache
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Cache successful responses
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());

    return response;
  } catch (error) {
    console.warn("[SW] Network request failed:", error);
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    if (shouldServeOfflinePage(request)) {
      return createOfflinePageResponse();
    }

    return new Response("Offline - asset not available", {
      status: 503,
      statusText: "Service Unavailable"
    });
  }
}

// Handle messages from clients (for push notifications later)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Push notifications support (future)
self.addEventListener("push", (event) => {
  const title = "Null and Void";
  const options = {
    body: event.data ? event.data.text() : "Conteúdo novo disponível",
    icon: "/data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect fill='%2310b981' width='192' height='192'/><text x='96' y='120' font-size='80' font-weight='bold' fill='white' text-anchor='middle'>🎓</text></svg>",
    badge: "/data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'><rect fill='%2310b981' width='96' height='96'/><text x='48' y='65' font-size='40' text-anchor='middle'>🎓</text></svg>"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
/* global clients */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open it
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
