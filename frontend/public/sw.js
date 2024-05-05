const CACHE_NAME = "sts-cache";
// The list of static files your app needs to start.
const PRE_CACHED_RESOURCES = ["/"];

self.addEventListener("fetch", event => {
  async function returnCachedResource() {
    // Open the app's cache.
    const cache = await caches.open(CACHE_NAME);
    // Find the response that was pre-cached during the `install` event.
    const cachedResponse = await cache.match(event.request.url);

    if (cachedResponse) {
      // Return the resource.
      return cachedResponse;
    } else {
      // The resource wasn't found in the cache, so fetch it from the network.
      const fetchResponse = await fetch(event.request.url);
      // Put the response in cache.
      cache.put(event.request.url, fetchResponse.clone());
      // And return the response.
      return fetchResponse.
    }
  }

  event.respondWith(returnCachedResource());
});



// Listen to the `install` event.
self.addEventListener("install", (event) => {
  async function preCacheResources() {
    // Open the app's cache.
    const cache = await caches.open(CACHE_NAME);
    // Cache all static resources.
    cache.addAll(PRE_CACHED_RESOURCES);
  }

  event.waitUntil(preCacheResources());
});

self.addEventListener("activate", (event) => {
  console.log("WORKER: activate event in progress.");
});
