// ==UserScript==
// @name         YouTube Hide Progress
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/youtube_hide_progress.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/youtube_hide_progress.user.js
// @description  Hides the YouTube video progress bar and total time
// @author       Araxeus
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// ==/UserScript==

const toggleDisplay = elSelector => {
    const el = document.querySelector(elSelector);
    el.style.display = el.style.display === 'none' ? '' : 'none';
};

GM_registerMenuCommand(
    'Show/Hide Progress',
    () => {
        toggleDisplay('div.ytp-progress-bar-container');
        toggleDisplay('span.ytp-time-duration');
        toggleDisplay('span.ytp-time-separator');
    },
    {
        clickedFrame: true,
    },
);
