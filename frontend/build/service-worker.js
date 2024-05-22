// Names of the caches used in this version of the service worker.
const PRECACHE = "precache-v11";
const RUNTIME = "runtime-v11";

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  "/",
  "index.html",
  "https://res.cloudinary.com/isaacdev/image/upload/v1713383695/boqdc63psvzlomzgliqc.jpg",
  "https://res.cloudinary.com/isaacdev/video/upload/v1715140806/intro_nubfsz.mp4",
];

const PRECACHE_API_URLS = [];

const getAllProductImages = async () => {
  const response = await fetch("/api/products/getImages");
  const data = await response.json();
  return data.allImages;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      const images = await getAllProductImages();
      const allFiles = [...new Set([...PRECACHE_URLS, ...images])];

      // Add all static URLs to the cache
      await cache.addAll(allFiles);

      // Fetch and cache URLs from PRECACHE_API_URLS
      const responses = await fetchAll(PRECACHE_API_URLS);
      responses.forEach(async (response, index) => {
        if (response.ok) {
          const cache = await caches.open(RUNTIME);
          await cache.put(PRECACHE_API_URLS[index], response);
        } else {
          console.error(
            "Failed to fetch",
            PRECACHE_API_URLS[index],
            response.statusText
          );
        }
      });

      // Immediately update and control the page
      self.skipWaiting();
    })()
  );
});

function fetchAll(urls) {
  return Promise.all(urls.map((url) => fetch(url)));
}

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", (event) => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  console.log(url);
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }
          var responseToCache = response.clone();
          caches.open(RUNTIME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
  } else if (url.pathname.startsWith("/api/")) {
    // Adjust this path to match your API request URLs
    event.respondWith(
      caches.open(RUNTIME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request.url, response.clone());
            return response;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      })
    );
  } // Check if the fetch request is for an image or video from Cloudinary
  else if (event.request.destination === "image") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If the network fetch is successful, update the cache
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(RUNTIME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch((error) => {
          // On network error, try to serve the image from the cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Optionally return a default/fallback image if not in cache
            return caches.match("/fallback-image.png");
          });
        })
    );
  } else {
    // Handle non-image fetch events normally
    event.respondWith(fetch(event.request));
  }
});
