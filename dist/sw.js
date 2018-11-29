importScripts("idb.js"),importScripts("js/idb-utility.js");var static_cache="mws-static-v7",dynamic_cache="mws-dynamic-v9",serverURL="http://127.0.0.1:1337/restaurants",staticAssets=["/","/index.html","/restaurant.html","/js/idb.js","/js/main_bundle.js","/js/restaurant_bundle.js",serverURL,"/worker.js"];self.addEventListener("install",function(e){console.log("sw installing"),e.waitUntil(caches.open(static_cache).then(function(e){return console.log("opened cache"),e.addAll(staticAssets)}))}),self.addEventListener("activate",function(e){return console.log("activated"),e.waitUntil(caches.keys().then(e=>Promise.all(e.map(e=>{if(e!==static_cache&&e!==dynamic_cache)return console.log("Removing old cache",e),caches.delete(e)})))),self.clients.claim()}),self.addEventListener("fetch",function(e){const t=e.request,s=new URL(t.url);if(console.log(t),"1337"===s.port)if(t.url.includes("reviews")&&"POST"!==t.method){var n=s.searchParams.get("restaurant_id");e.respondWith(readByIndex("reviews",n).then(e=>e.length?(console.log("from idb"),e):fetch(t).then(e=>e.json()).then(e=>(e.forEach(e=>{writeData("reviews",e)}),e))).then(e=>new Response(JSON.stringify(e))))}else e.respondWith(readAllData("restaurants").then(e=>e.length?e:fetch(t).then(e=>e.json()).then(e=>(e.forEach(e=>{writeData("restaurants",e)}),e))).then(e=>new Response(JSON.stringify(e))));else e.respondWith(caches.match(t).then(e=>e||fetch(t).then(e=>caches.open(dynamic_cache).then(s=>(s.put(t.url,e.clone()),e)))))}),self.addEventListener("message",e=>{console.log("Message received:",e)});