// ==UserScript==
// @name         13tv.co.il Volume Scroll
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/13tv.co.il_volume_scroll.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/13tv.co.il_volume_scroll.user.js
// @description  Adds volume scroll functionality to 13tv.co.il live streams
// @author       Araxeus
// @match        https://13tv.co.il/live/12/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=13tv.co.il
// @grant        none
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
