/* global workbox:false */
importScripts('/node_modules/workbox-sw/build/workbox-sw.js')

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`)
} else {
    console.log(`Boo! Workbox didn't load 😬`)
}
