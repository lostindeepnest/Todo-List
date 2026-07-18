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
    event.waitUntil(
        caches.open(CACHE)
            .then(cache => cache.addAll(FILES))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});