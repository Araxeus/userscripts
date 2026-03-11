// ==UserScript==
// @name         kan.org.il: Volume Scroll
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/kan.org.il_volume_scroll.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/kan.org.il_volume_scroll.user.js
// @description  Adjust volume using scroll wheel on kan.org.il player
// @author       Araxeus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kan.org.il
// @match        https://www.kan.org.il/live/
// @match        https://www.kan.org.il/player
// @match        https://www.kan.org.il/content/kan/kan-11/*
// @grant        none
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
