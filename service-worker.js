'use strict';

const CACHE_ESTATICO = "filmes-app-estatico";

const ARQUIVOS_ESTATICO = [

    'css/bootstrap.min.css',
    'css/styles.css',
    'icons/favicon.ico',
    'icons/152.png',
    'img/bg1.jpg',
    'img/bg2.jpg',
    'img/logo.png',
    'img/offline.png',
    'js/app.js',
    'js/bootstrap.bundle.min.js',
    'offline.html'

];

//Instalação do Service Worker

self.addEventListener('install', (evt) => {

    console.log("Service Worker em instalação.");

    evt.waitUntil(

        caches.open(CACHE_ESTATICO).then((cache) =>{

            console.log("Service Worker fazendo o cache estático.");
            return cache.addAll(ARQUIVOS_ESTATICO);

        })

    );
    
    self.skipWaiting();

});

//Ativação do Service Worker

self.addEventListener('activate', (evt) => {

    console.log("Service Worker em ativação.");
    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) => {

                if(key !== CACHE_ESTATICO){
                    return caches.delete(key);
                }

            }));

        })

    );
    self.clients.claim();

});

//Fetch do Service Worker (respondo uma página offline)

self.addEventListener('fetch', (evt) => {

    if(evt.request.mode !== 'navigate'){

        return;
    }
    evt.respondWith(

        fetch(evt.request).catch(() => {

            return caches.open(CACHE_ESTATICO).then((cache) => {
                return cache.match('offline.html');
            });

        })

    );

});