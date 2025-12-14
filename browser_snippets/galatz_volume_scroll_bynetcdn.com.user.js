// ==UserScript==
// @name        GALATZ Volume Scroll bynetcdn.com
// @namespace   Violentmonkey Scripts
// @match       https://glzwizzlv.bynetcdn.com/glz_mp3
// @grant       none
// @version     1.0
// @author      -
// @description 11/1/2023, 5:52:19 PM
// ==/UserScript==

document.querySelector('video').volume = 0.1;

window.addEventListener("wheel", ({deltaY}) => {
            const video = document.querySelector('video');
            video.volume = Math.max(0, Math.min(1, video.volume + deltaY / -10000));
            video.muted = video.volume === 0;
})
