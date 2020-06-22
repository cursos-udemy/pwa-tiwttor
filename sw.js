importScripts('js/sw-utils.js');

const STATIC_CACHE_NAME = 'tw-static-cache-v1.0';
const INMUTABLE_CACHE_NAME = 'tw-inmutable-cache-v1.0';
const DYNAMIC_CACHE_NAME = 'tw-dynamic-cache-v1.0';

const DYNAMIC_CACHE_LIMIT = 50;

const STATIC_APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const INMUTABLE_APP_SHELL = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'js/libs/jquery.js',
    'css/animate.css'
];

function cleanCacheDynamic() {
    cleanCache(STATIC_CACHE_NAME, DYNAMIC_CACHE_LIMIT);
}

self.addEventListener('install', event => {
    const staticCache = caches.open(STATIC_CACHE_NAME).then(cache => cache.addAll(STATIC_APP_SHELL));
    const inmutableCache = caches.open(INMUTABLE_CACHE_NAME).then(cache => cache.addAll(INMUTABLE_APP_SHELL));
    event.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', event => {
    const cleanOldVersionCache = caches.keys()
        .then(keys => {
            keys.forEach(async key => {
                if (key !== STATIC_CACHE_NAME && key.includes('static-cache')) {
                    await caches.delete(key);
                }
            });
        });
    event.waitUntil(cleanOldVersionCache);
});

self.addEventListener('fetch', event => {

    const resource = caches.match(event.request).then(cacheResource => {
        if (cacheResource) return cacheResource;
        return fetch(event.request).then(httpResource => updateCache(DYNAMIC_CACHE_NAME, event.request, httpResource));
    });

    event.respondWith(resource);

});