const CACHE_NAME = "sts-cache-v7";

const PRE_CACHED_RESOURCES = ["/", "/index.html"];

// Listener for the install event - precaches our assets list on service worker for install.
self.addEventListener("install", (event) => {
  /* try {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        cache.addAll(PRE_CACHED_RESOURCES);
      })
    );
  } catch (error) {
    console.error("Error during service worker installation:", error);
  } */
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Listener for fetch events - serves cached assets in case of no network or slow network.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data.action === "CACHE_ASSETS") {
    console.log("Caching additional assets as instructed by the app");
    try {
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          cache.addAll(PRE_CACHED_RESOURCES);
        })
      );
    } catch (error) {
      console.error("Error during service worker installation:", error);
    }
  }
});
