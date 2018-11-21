
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../js/service-worker.js')
    .then(() => {console.log('service worker registered')})
    .catch(() => {console.warn('service worker failed') })
}


var CACHE_NAME = 'static-v1';
this.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll([
                '../../',
                '../js/service-worker.js',
                '../manifest.json',
                '../views/index.ejs',
                '../images/header.jpg',
                '../css/creative.css',
                '../css/creative.min.css',
                '../css/index.css',
                '../js/register.js',
                '../js/validar-form.js',
                '../js/creative.js',
                '../js/creative.min.js'
            ]);
        })
    );
})


this.addEventListener('activate', function activator(event) {
    event.waitUntil(caches.keys()
        .then(function (keys) {
            return Promise.all(keys.filter(function (key) {
                return key.indexOf(CACHE_NAME) !== 0}).map(function (key) {
                    return caches.delete(key);
                })
            );
        })
    );
});


this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (cachedResponse) {
            return cachedResponse || fetch(event.request);
        })
    );
});