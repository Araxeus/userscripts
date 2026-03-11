// ==UserScript==
// @name        kan.org.il: Volume Scroll
// @namespace   Violentmonkey Scripts
// @match       https://www.mako.co.il/mako-vod-keshet/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=co.il
// @grant       none
// @version     1.0
// @author      Araxeus
// @description 2026-01-29
// ==/UserScript==

const observer = new MutationObserver(() => {
    const overlay = document.querySelector('div#playerWrapper');
    console.log('searching');
    if (overlay) {
        console.log('found');
        const video = overlay.querySelector('video');
        video.volume = 0.5;
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
