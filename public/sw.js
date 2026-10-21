/* Ayuda service worker — app-shell precache + runtime caching. */
const VERSION = "ayuda-v2";
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
          .filter((key) => key.startsWith("ayuda-") && key !== PRECACHE && key !== RUNTIME)
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

  // RSC requests have an empty destination. Keep their exact URLs and Vary
  // headers: a prefetch shell must never substitute for a navigation payload.
  const isRsc = request.headers.get("RSC") === "1" ||
    url.pathname.endsWith(".rsc") || url.searchParams.has("_rsc");

  const remember = async (response) => {
    if (response.ok && response.type === "basic" &&
        (!isRsc || response.headers.get("content-type")?.startsWith("text/x-component"))) {
      try {
        const cache = await caches.open(RUNTIME);
        await cache.put(request, response.clone());
      } catch { /* a full cache must not turn a successful request into an error */ }
    }
  };

  if (request.mode === "navigate" || isRsc) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (!response.ok && response.status >= 500) throw new Error("Server unavailable");
          await remember(response);
          return response;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          // An HTML response to RSC makes vinext perform a document navigation.
          // Returning the cached offline page preserves its /offline response URL.
          return (await caches.match(OFFLINE_URL)) || Response.error();
        }
      })(),
    );
    return;
  }

  if (!CACHEABLE_DESTINATIONS.has(request.destination)) return;

  // Extend the event lifetime even when a cached asset is returned immediately.
  const network = fetch(request)
    .then(async response => { await remember(response); return response; })
    .catch(() => undefined);
  event.waitUntil(network);
  event.respondWith(
    (async () => (await caches.match(request)) || (await network) || Response.error())(),
  );
});
