// ==UserScript==
// @name        kan.org.il: Volume Scroll
// @namespace   Violentmonkey Scripts
// @match       https://www.kan.org.il/live/
// @match       https://www.kan.org.il/player
// @match       https://www.kan.org.il/content/kan/kan-11/*
// @grant       none
// @version     1.0
// @author      -
// @description 11/5/2023, 7:02:36 PM
// ==/UserScript==

const observer = new MutationObserver(() => {
    const overlay = document.querySelector('div.redge-player');
    const video = overlay?.querySelector('video');
    console.log('searching');
    if (overlay && video) {
        console.log('found');
        overlay.onwheel = ({ deltaY }) => {
            video.volume = Math.max(0, Math.min(1, video.volume + deltaY / -10000));
            video.muted = video.volume === 0;
            return false;
        };
        observer.disconnect();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
