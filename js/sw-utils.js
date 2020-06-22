function cleanCache(cacheName, maxItems) {
    caches.open(cacheName)
        .then(cache => {
            return cache.keys().then(keys => {
                if (keys.length > maxItems) {
                    cache.delete(keys[0]).then(cleanCache(cacheName, maxItems))
                }
            })
        });
}

function updateCache(cacheName, request, resource) {
    if (resource.ok) {
        return caches.open(cacheName).then(async cache => {
            await cache.put(request, resource.clone());
            return resource.clone();
        });
    } else {
        console.log(event.request.url);
        return resource;
    }
}