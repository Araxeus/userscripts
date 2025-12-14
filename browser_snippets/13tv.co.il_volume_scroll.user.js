// ==UserScript==
// @name        13tv.co.il Volume Scroll
// @namespace   Violentmonkey Scripts
// @match       https://13tv.co.il/live/12/
// @grant       none
// @version     1.0
// @author      -
// @description 11/7/2023, 10:24:28 PM
// ==/UserScript==

const observer = new MutationObserver(() => {
    const overlay = document.querySelector('.kaltura-player-container');
    if (overlay) {
        overlay.addEventListener('wheel', e => {
            const video = document.querySelector('video');
            video.volume = Math.max(0, Math.min(1, video.volume + e.deltaY / -10000));
            video.muted = video.volume === 0;
            e.preventDefault();
            return false;
        });
        observer.disconnect();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
