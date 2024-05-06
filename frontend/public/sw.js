const CACHE_NAME = "sts-cache";
const PRE_CACHED_RESOURCES = [
  "/",
  "/cart",
  "/login",
  "/register",
  "/contact",
  "/forgotpassword",
  "/shipping",
  "/payment",
  "/placeorder",
  "/profile",
  "/products",
  "/products/todos%20los%20productos/page/1",
  "/products/todos%20los%20productos/page/2",
  "/products/todos%20los%20productos/page/3",
  "/products/todos%20los%20productos/page/4",
  "/products/todos%20los%20productos/page/5",
  "/products/todos%20los%20productos/page/6",
  "/products/todos%20los%20productos/page/7",
  "/products/todos%20los%20productos/page/8",
  "/products/todos%20los%20productos/page/9",
  "/products/todos%20los%20productos/page/10",
  "/products/todos%20los%20productos/page/11",
  "/products/todos%20los%20productos/page/12",
  "/products/todos%20los%20productos/page/13",
  "/products/todos%20los%20productos/page/14",
  "/products/todos%20los%20productos/page/15",
  "/products/todos%20los%20productos/page/16",
];

self.addEventListener("install", (event) => {
  console.log("WORKER: install event in progress.");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("WORKER: caching resources");
        return cache.addAll(PRE_CACHED_RESOURCES);
      })
      .catch((error) => {
        console.error("Failed to open cache or cache resources:", error);
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("WORKER: activate event in progress.");
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log("WORKER: deleting cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log(`Fetching: ${event.request.url}`);
  event.respondWith(
    fetch(event.request)
      .then((fetchResponse) => {
        if (!fetchResponse.ok) {
          throw new Error(`Request failed: network response was not ok`);
        }
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      })
      .catch((error) => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          // Optionally provide a fallback response here if a request fails both in the network and cache
          console.error(
            `Network request failed: ${error.message}`,
            event.request.url
          );
          return new Response(
            JSON.stringify({
              message: "Offline or network error occurred",
              status: "error",
            }),
            {
              headers: { "Content-Type": "application/json" },
              status: 404,
              statusText: "Network error",
            }
          );
        });
      })
  );
});
