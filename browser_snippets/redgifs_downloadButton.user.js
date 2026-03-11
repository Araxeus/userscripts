// ==UserScript==
// @name         redgifs downloadButton
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/redgifs_downloadButton.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/redgifs_downloadButton.user.js
// @description  Adds a download button to redgifs videos
// @author       Araxeus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redgifs.com
// @match        https://www.redgifs.com/watch/*
// @run-at       document-idle
// @grant        GM_download
// ==/UserScript==

const $ = document.querySelector.bind(document);

const downloadButtonHtml = /* html */ `<li class="SideBar-Item"><button class="QualityButton DownloadButton hd" aria-label="download video"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.6875 13.6125a.6875.6875 0 0 1 .6875.6875v3.4375a1.375 1.375 0 0 0 1.375 1.375h16.5a1.375 1.375 0 0 0 1.375-1.375v-3.4375a.6875.6875 0 0 1 1.375 0v3.4375a2.75 2.75 0 0 1-2.75 2.75H2.75a2.75 2.75 0 0 1-2.75-2.75v-3.4375a.6875.6875 0 0 1 .6875-.6875" fill="white"></path>
<path d="M10.511 16.2995a.6875.6875 0 0 0 .973 0l4.125-4.125a.6875.6875 0 0 0-.973-.973L11.6875 14.1505V2.0625a.6875.6875 0 0 0-1.375 0v12.088L7.364 11.2015a.6875.6875 0 1 0-.973.973z" fill="white"></path></svg></button></li>`;

// changing "watch" in the url to "ifr"

const observer = new MutationObserver(() => {
    const qualityButton = $('li:has(button.QualityButton)');
    if (qualityButton) {
        qualityButton.insertAdjacentHTML('afterEnd', downloadButtonHtml);
        const downloadButton = $('button.DownloadButton');
        downloadButton.onclick = () => {
            const url = $('meta[property="og:video"]').content.replace('-silent', '');
            // Inject muted video element
            const newTab = window.open('', '_blank', 'popup');
            newTab.document.body.innerHTML = `
                    <video controls autoplay muted style="
                            margin: auto;
                            position: absolute;
                            top: 0px;
                            right: 0px;
                            bottom: 0px;
                            left: 0px;
                            max-height: 100%;
                            max-width: 100%;">
                        <source src="${url}" type="video/mp4">
                    </video>
                `;
            //window.location.assign(url);
            // const name = url.match(/\/[a-zA-Z]+\.mp4/)[0];
            // GM_download({ url, name });
        };
        observer.disconnect();
    }
});

observer.observe($('body'), {
    subtree: true,
    childList: true,
});
