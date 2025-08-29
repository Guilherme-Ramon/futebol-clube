const CACHE_NAME = "basefc-cache-v1.0.5"; // Atualizar a versão a cada mudança
const urlsToCache = [
  "./",
  "./index.html?v=1.0.5",
  "./assets/css/style.css",
  // imagens 1 a 22
  "./assets/images/1.png",
  "./assets/images/2.png",
  "./assets/images/3.png",
  "./assets/images/4.png",
  "./assets/images/5.png",
  "./assets/images/6.png",
  "./assets/images/7.png",
  "./assets/images/8.png",
  "./assets/images/9.png",
  "./assets/images/10.png",
  "./assets/images/11.png",
  "./assets/images/12.png",
  "./assets/images/13.png",
  "./assets/images/14.png",
  "./assets/images/15.png",
  "./assets/images/16.png",
  "./assets/images/17.png",
  "./assets/images/18.png",
  "./assets/images/19.png",
  "./assets/images/20.png",
  "./assets/images/21.png",
  "./assets/images/22.png",
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
  const url = new URL(event.request.url);

  // Só cacheia HTTP ou HTTPS
  if (url.protocol === "http:" || url.protocol === "https:") {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request).then((response) => {
          // Só cacheia respostas básicas (evita cross-origin)
          if (response && response.type === "basic") {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }
          return response;
        }).catch(() => {
          // Opcional: fallback offline
          // return caches.match('./offline.html');
        });
      })
    );
  } else {
    // Se não for http/https, apenas busca normalmente
    event.respondWith(fetch(event.request));
  }
});

// ============================
// UPDATE NOTIFICATION - opcional
// ============================
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
