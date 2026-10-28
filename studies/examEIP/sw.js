// 앱 파일은 캐시 우선(오프라인 지원), 문제 데이터는 네트워크 우선(수정 즉시 반영).
// 앱 파일(index.html 등)을 수정했다면 VERSION 을 올려야 기존 캐시가 갱신된다.
const VERSION = "v1";
const CACHE = "exam2027-" + VERSION;
const SHELL = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const networkFirst = req.url.includes("questions.json");
  e.respondWith(
    networkFirst
      ? fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })
          .catch(() => caches.match(req))
      : caches.match(req).then(hit => hit || fetch(req).then(r => {
          const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r;
        }))
  );
});
