const CACHE_NAME = "basefc-cache-v1.0.4"; // Mude a versão a cada atualização
const urlsToCache = [
  "./",
  "./index.html?v=1.0.4",
  "./assets/css/style.css",
  "./assets/images/4.png",
  "./assets/images/5.png",
  "./assets/images/6.png",
  "./manifest.json"
];

// ============================
// INSTALL - cache inicial
// ============================
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Instalando e cacheando arquivos...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// ============================
// ACTIVATE - remove caches antigos
// ============================
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Ativando...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// ============================
// FETCH - retorna do cache ou busca online
// ============================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Atualiza cache dinamicamente
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => {
        // Opcional: página offline
        // return caches.match('./offline.html');
      });
    })
  );
});

// ============================
// UPDATE NOTIFICATION - opcional
// ============================
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
