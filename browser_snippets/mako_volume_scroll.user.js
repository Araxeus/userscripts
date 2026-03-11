// ==UserScript==
// @name         mako.co.il: Volume Scroll
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/mako_volume_scroll.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/mako_volume_scroll.user.js
// @description  Adjust volume using scroll wheel on mako.co.il player
// @author       Araxeus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mako.co.il
// @match        https://www.mako.co.il/mako-vod-keshet/*
// @grant        none
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
