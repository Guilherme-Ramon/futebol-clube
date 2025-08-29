const CACHE_NAME = "basefc-cache-v1";
const urlsToCache = [
    "./",
    "./index.html",
    "./assets/css/style.css",
    "./assets/images/4.png",
    "./assets/images/5.png",
    "./assets/images/6.png",
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            for (const url of urlsToCache) {
                try {
                    await cache.add(url);
                } catch (err) {
                    console.warn(
                        "Não foi possível adicionar ao cache:",
                        url,
                        err
                    );
                }
            }
        })()
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) return caches.delete(cache);
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
