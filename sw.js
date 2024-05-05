self.addEventListener("fetch", (event) => {
  console.log("WORKER: Fetching", event.request);
});
