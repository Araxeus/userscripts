// ==UserScript==
// @name        Twitter: Auto-click the 'news' tab
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     1.0
// @author      Araxeus
// @description 10/28/2023, 7:04:16 PM
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
