const CACHE = "todo-v7";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./check-tick.svg",

    "./icons/duotone-checkmark-v6-large.svg",
    "./icons/design-one/icon-192.png",
    "./icons/design-one/icon-512.png",
    "./icons/design-two/icon-512.png",
    "./icons/design-two/icon-192.png",

    "./fonts/DMMono-Regular.ttf",
    "./fonts/SpaceMono-BoldItalic.ttf",
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