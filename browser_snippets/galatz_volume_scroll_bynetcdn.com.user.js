// ==UserScript==
// @name         GALATZ Volume Scroll bynetcdn.com
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/galatz_volume_scroll_bynetcdn.com.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/galatz_volume_scroll_bynetcdn.com.user.js
// @description  Adds volume scroll functionality to GALATZ bynetcdn.com
// @author       Araxeus
// @match        https://glzwizzlv.bynetcdn.com/glz_mp3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glz.co.il
// @grant        none
// ==/UserScript==

document.querySelector('video').volume = 0.1;

window.addEventListener('wheel', ({ deltaY }) => {
    const video = document.querySelector('video');
    video.volume = Math.max(0, Math.min(1, video.volume + deltaY / -10000));
    video.muted = video.volume === 0;
});
