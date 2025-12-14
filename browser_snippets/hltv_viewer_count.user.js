// ==UserScript==
// @name         hltv total number of live watchers
// @namespace    http://tampermonkey.net/
// @version      2025-12-14
// @description  try to take over the world!
// @author       You
// @match        https://www.hltv.org/matches/**/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hltv.org
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// ==/UserScript==

if (typeof GM_registerMenuCommand === 'undefined') {
    throw new Error('GM_registerMenuCommand undefined');
}

if (typeof GM_notification === 'undefined') {
    throw new Error('GM_notification undefined');
}

const numWatchersSpans = '.stream-box:not(.hidden) .viewers.left-right-padding.gtSmartphone-only';

const logWatchers = () => {
    const spans = document.querySelectorAll(numWatchersSpans);
    if (spans.length === 0) {
        console.log('No live streams found.');
        notif(0);
        return;
    }
    const num = Array.from(spans).reduce((s, e) => s + +e.textContent, 0);
    const prettyNum = num.toLocaleString('en-US');
    console.log(`Total live watchers: ${prettyNum}`);
    notif(prettyNum);
};

const reg = GM_registerMenuCommand('log total live watchers to console', logWatchers, 'l');

console.log(`HLTV Viewer Count script loaded: $${!!reg}`);

function notif(numWachers) {
    GM_notification({
        text: `There are ${numWachers} concurrent viewers.`,
        title: 'Total Concurrent Viewers',
        silent: true,
        onclick: () => {
            alert('I was clicked!');
        },
    });
}
