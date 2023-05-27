// this file exists so that we can run the app OFFLINE

//Constraints
const APP_PREFIX = 'FoodFest-';   // name of app  
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION; // string combination of the above, a reference to the new version for us to know when we see the cache in the devtools

console.log("service worker loading")

// the files in our project that will run without internet
const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
];

// self instead of window because for service workers, they are activated before the window object is created, use self instead
//THE CODE WE USED BEFORE, DURING THE INSTALL PHASE
self.addEventListener('install', function (e) {
    e.waitUntil(// telling browser to wait until enclosed code is finished executing
        caches.open(CACHE_NAME).then(function (cache) {
          console.log('installing cache : ' + CACHE_NAME)
          return cache.addAll(FILES_TO_CACHE) // will add all files to cache storage
        })
    )
})
// We use e.waitUntil to tell the browser to wait until the work is complete before terminating the service worker. This ensures that the service worker doesn't move on from the installing phase until it's finished executing all of its code.

// We use caches.open to find the specific cache by name, then add every file in the FILES_TO_CACHE array to the cache.

// ONCE WE ARE READY TO ACTIVATE, WE CLEAR OUT ANY OLD DATA FROM CACHE, AND TELL SERVICE WORKER HOW TO MANAGE CACHES
self.addEventListener('activate', function(e){
  e.waitUntil(
    // .KEYS() RETURNS AN ARRAY OF ALL CACHE NAMES AND KEYLIST IS THE PARAMETER THAT CONTAINS ALL CACHE NAMES UNDER username.github.io
    caches.keys().then(function(keylist){ //this method will return promise with an array of the cache keys
      // filters the cache from other links in our username we don't neeed
      let cacheKeeplist = keylist.filter(function(key){
        return key.indexOf(APP_PREFIX) // any key with an index value that matches app prefix will be inserted in the keep list
      })
      //pushes the files we are actually using, CACHE_NAME is a global constant we used to keep track of which cache we are using.
      cacheKeeplist.push(CACHE_NAME)

      // deletes all old versions of the cache that have been deleted
      return Promise.all(keyList.map(function (key, i) { // promise all will not return into all promises are fulfilled
        if (cacheKeeplist.indexOf(key) === -1) { //only return a value of -1 if item is not in keeplist
          console.log('deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i]); //delete from cache
        }
      }));
    })
  )
})
// .keys() returns an array of all cache names, which we're calling keyList. keyList is a parameter that contains all cache names under <username>.github.io. Because we may host many sites from the same URL, we should filter out caches that have the app prefix. We'll capture the ones that have that prefix, stored in APP_PREFIX, and save them to an array called cacheKeeplist using the .filter() method.

// This last bit of the activate listener returns a Promise that resolves once all old versions of the cache have been deleted.
// The following code shows the activate listener as it should appear now:

// to finally retrieve information from the cache after we have managed old caches, cleared out old service workers, and added thee necessary files to the cache
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)

  e.respondWith( // send resources from service worker to https, this method will intercept the http responce in order to send resources from the service worker
      // will check if request is stored in the cache or not, if it is, respondWith will grab the resource from the cache
      caches.match(e.request).then(function (request) { //match with same resource in cache
        if (request) {  // if cache is available, respond with cache if it already exists 
          console.log('responding with cache : ' + e.request.url)
          return request
        } else {  // if there are no cache, try fetching request
          console.log('file is not cached, fetching : ' + e.request.url)
          return fetch(e.request)
      }
//         You can omit if/else for console.log & put one line below like this too.
// return request || fetch(e.request)
// if the file isn't stored in the cache, the service worker will make a normal request for the resource
      })
  )
})

// Here, we listen for the fetch event, log the URL of the requested resource, and then begin to define how we will respond to the request.
// Notice that we're using a method on the event object called respondWith to intercept the fetch request. In the code that we'll be writing next, the following lines will check to see if the request is stored in the cache or not. If it is stored in the cache, e.respondWith will deliver the resource directly from the cache; otherwise the resource will be retrieved normally.





