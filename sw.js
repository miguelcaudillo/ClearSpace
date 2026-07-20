/* ClearSpace — self-retiring service worker.
   The offline cache caused stale pages after every update, so it's been removed.
   This version clears all old caches and unregisters itself, then reloads open
   tabs with fresh content. Safe to delete this file once every device has loaded
   the site at least once after this change. */
self.addEventListener("install", function () { self.skipWaiting(); });

self.addEventListener("activate", function (e) {
  e.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    await self.registration.unregister();
    var clients = await self.clients.matchAll({ type: "window" });
    clients.forEach(function (c) { c.navigate(c.url); });
  })());
});
