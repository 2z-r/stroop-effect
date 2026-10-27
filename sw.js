var CACHE="stroop-v4";
var FILES=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}));
  }));
  self.clients.claim();
});
// ネットワーク優先: オンラインなら常に最新を取得し、オフラインのときだけキャッシュを使う
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request).then(function(r){
    if(r&&r.ok&&new URL(e.request.url).origin===location.origin){
      var copy=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy)});
    }
    return r;
  }).catch(function(){return caches.match(e.request)}));
});
