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

const $ = document.querySelector.bind(document);

GM_registerMenuCommand(
    'Show/Hide Progress',
    () => {
        const progressBar = $('.ytp-progress-bar-container');
        const display = progressBar.style.display === 'none' ? '' : 'none';
        progressBar.style.display = display;
        $('.ytp-time-duration').style.display = display;
        $('.ytp-time-separator').style.display = display;
    },
    {
        clickedFrame: true,
    },
);
