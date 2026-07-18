const CACHE = "todo-v3";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./check-tick.svg",

    "./icons/duotone-checkmark-v6-large.svg",
    "./icons/icon-192.png",
    "./icons/icon-512.png",

    "./fonts/DMMono-Regular.ttf",
    "./fonts/SpaceMono-Bolditalic.ttf",
    "./fonts/SpaceMono-Italic.ttf"
];

self.addEventListener("install", event => {
    self.skipWaiting()
    event.waitUntil(
        caches.open(CACHE)
            .then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {

                    if (key !== CACHE) {
                        return caches.delete(key);
                    }

                })
            )
        )
    );

    self.clients.claim();

});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});