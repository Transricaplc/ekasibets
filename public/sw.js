// eKasibets Service Worker — data-lite offline shell for SA users
const CACHE_VERSION = "ekasi-v1";
const APP_SHELL = ["/", "/manifest.webmanifest", "/placeholder.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((c) => c.addAll(APP_SHELL)).catch(() => null),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

// Network-first for API/auth, cache-first for static assets, stale-while-revalidate for navigation
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Never cache Supabase/auth/realtime — must be fresh and authenticated
  if (
    url.hostname.includes("supabase") ||
    url.pathname.startsWith("/auth") ||
    url.pathname.includes("/rest/") ||
    url.pathname.includes("/realtime")
  ) {
    return; // let the browser handle it normally
  }

  // HTML navigations: stale-while-revalidate against the app shell
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("/").then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put("/", copy));
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      }),
    );
    return;
  }

  // Static assets: cache-first
  if (["script", "style", "image", "font"].includes(req.destination)) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
