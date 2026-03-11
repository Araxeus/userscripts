// ==UserScript==
// @name         Twitter: Auto-click the 'news' tab
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/twitter_x_start_on_news_tab.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/twitter_x_start_on_news_tab.user.js
// @description  Automatically clicks the 'news' tab on Twitter
// @author       Araxeus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @match        https://x.com/*
// @grant        none
// ==/UserScript==

// THIS INITIAL VERSION JUST CLICK THE 3rd TAB

// console.log('waiting for "news" tab');
// let counter = 0;
// const observer = new MutationObserver(() => {
//     const targetElement = document.body.querySelector('div[aria-label="Home timeline"] div[role="presentation"]:nth-child(3) a');
//     counter++;
//     if (targetElement) {
//         observer.disconnect();
//         targetElement.click();
//         console.log(`"news" tab found and clicked after ${counter} mutations`);
//     }
// });

const TABNAME = 'news';

let timeout;

console.log(`waiting for "${TABNAME}" tab`);
let counter = 0;
const observer = new MutationObserver(() => {
    const targetElement = document.body.querySelector(
        'div[aria-label="Home timeline"] div[role="tablist"]',
    );
    counter++;
    if (targetElement) {
        for (const element of targetElement.querySelectorAll('div[role="presentation"]>div[role="tab"]')) {
            if (element.querySelector('span')?.textContent?.toLowerCase() === TABNAME) {
                element.click();
                console.log(`"${TABNAME}" tab found and clicked after ${counter} mutations`);
                observer.disconnect();
                clearTimeout(timeout);
            }
        }
    }
});

timeout = setTimeout(() => {
    observer.disconnect();
    console.log(`timed out waiting for "${TABNAME}" tab`);
}, 6000);

observer.observe(document.body, { childList: true, subtree: true });
