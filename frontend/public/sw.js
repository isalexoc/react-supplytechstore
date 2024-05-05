self.addEventListener("fetch", (event) => {
  console.log("WORKER: Fetching", event.request);
});

self.addEventListener("install", (event) => {
  console.log("WORKER: install event in progress.");
});

self.addEventListener("activate", (event) => {
  console.log("WORKER: activate event in progress.");
});
