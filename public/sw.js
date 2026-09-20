/* Ayuda service worker — app-shell precache + runtime caching. */
const VERSION = "ayuda-v1";
const PRECACHE = `${VERSION}-precache`;
const RUNTIME = `${VERSION}-runtime`;
const OFFLINE_URL = "/offline";

const PRECACHE_URLS = [
  "/",
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/logos/svg/BetterGov_Icon-Primary.svg",
  "/icons/apple-touch-icon.png",
];

/** Destinations worth caching opportunistically at runtime. */
const CACHEABLE_DESTINATIONS = new Set([
  "script",
  "style",
  "image",
  "font",
  "manifest",
]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      // Add individually so one failing request cannot abort the whole install.
      await Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => undefined),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== PRECACHE && key !== RUNTIME)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle same-origin GETs; let the network own everything else
  // (Overpass, PSGC, Nominatim, map tiles, etc.).
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network first, fall back to the cached page, then /offline.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const cache = await caches.open(RUNTIME);
          cache.put(request, response.clone());
          return response;
        } catch {
          const cached = (await caches.match(request)) || (await caches.match("/"));
          if (cached) return cached;
          return (await caches.match(OFFLINE_URL)) || Response.error();
        }
      })(),
    );
    return;
  }

  if (!CACHEABLE_DESTINATIONS.has(request.destination)) return;

  // Static assets: stale-while-revalidate.
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      const network = fetch(request)
        .then(async (response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const cache = await caches.open(RUNTIME);
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })(),
  );
});
