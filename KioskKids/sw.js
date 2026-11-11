/*
 * 오프라인용 서비스워커: 네트워크 우선, 실패하면 저장해둔 사본 사용.
 * 한 번 온라인으로 열어 두면 이후에는 인터넷 없이도 동작한다.
 */
var CACHE = 'kiosk-v1';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      if (res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});
