// ==UserScript==
// @name         redgifs downloadButton
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/redgifs_downloadButton.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/redgifs_downloadButton.user.js
// @description  Adds a download button to redgifs videos
// @author       Araxeus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redgifs.com
// @match        https://www.redgifs.com/*
// @run-at       document-idle
// @grant        GM_download
// ==/UserScript==

const $ = document.querySelector.bind(document);

const downloadButtonHtml = /* html */ `
<li class="sideBarItem">
    <button class="FSButton DownloadButton hd" aria-label="download video">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M.6875 13.6125a.6875.6875 0 0 1 .6875.6875v3.4375a1.375 1.375 0 0 0 1.375 1.375h16.5a1.375 1.375 0 0 0 1.375-1.375v-3.4375a.6875.6875 0 0 1 1.375 0v3.4375a2.75 2.75 0 0 1-2.75 2.75H2.75a2.75 2.75 0 0 1-2.75-2.75v-3.4375a.6875.6875 0 0 1 .6875-.6875" fill="white">
            </path>
            <path d="M10.511 16.2995a.6875.6875 0 0 0 .973 0l4.125-4.125a.6875.6875 0 0 0-.973-.973L11.6875 14.1505V2.0625a.6875.6875 0 0 0-1.375 0v12.088L7.364 11.2015a.6875.6875 0 1 0-.973.973z" fill="white">
            </path>
        </svg>
    </button>
</li>`;

// changing "watch" in the url to "ifr"

function setup(watchPage) {
    const feedObserver = new MutationObserver(() => {
        handleGifs(watchPage);
    });

    feedObserver.observe(watchPage, {
        subtree: true,
        childList: true,
    });
}

const bodyObserver = new MutationObserver(() => {
    const watchPage =
        $('div.watchFeed') || $('div.nicheGifList') || $('div.ProfileGifList') || $('div.gifList');
    if (watchPage) {
        setup(watchPage);
        bodyObserver.disconnect();
    }
});

bodyObserver.observe(document.body, {
    subtree: true,
    childList: true,
});

function handleGifs(watchPage) {
    const unprocessedGif = watchPage.querySelectorAll(
        'div.GifPreview_isVideo:not(:has(button.DownloadButton))',
    );
    if (unprocessedGif.length === 0) return;

    unprocessedGif.forEach(gif => {
        const qualityButton = gif.querySelector('li:has(button.FSButton)');
        if (qualityButton) {
            qualityButton.insertAdjacentHTML('beforebegin', downloadButtonHtml);
            const downloadButton = gif.querySelector('button.DownloadButton');
            downloadButton.onclick = () => {
                //const url = $('meta[property="og:video"]').content.replace('-silent', '');
                const url = qualityButton.parentElement.parentElement.parentElement.parentElement
                    .querySelector('img.Player-Poster')
                    .src.replace('-mobile.jpg', '.mp4');
                //window.location.assign(url);
                window.open(url, '_blank');
                // const name = url.match(/\/[a-zA-Z]+\.mp4/)[0];
                // GM_download({ url, name });
            };
        }
    });
}

// function _openInNewWindow(url) {
//     // Inject muted video element
//     const newWindow = window.open('', '_blank', 'popup');
//     newWindow.document.body.innerHTML = `
//                     <video controls autoplay muted style="
//                             margin: auto;
//                             position: absolute;
//                             top: 0px;
//                             right: 0px;
//                             bottom: 0px;
//                             left: 0px;
//                             max-height: 100%;
//                             max-width: 100%;">
//                         <source src="${url}" type="video/mp4">
//                     </video>
//                 `;
// }
