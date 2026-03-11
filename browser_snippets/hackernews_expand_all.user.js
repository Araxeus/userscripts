// ==UserScript==
// @name         hackernews expand all
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/hackernews_expand_all.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/hackernews_expand_all.user.js
// @description  Expands all comments on Hacker News
// @author       Araxeus
// @match        https://news.ycombinator.com/item*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        GM_registerMenuCommand
// ==/UserScript==

const expandAll = () =>
    document
        .querySelectorAll('a.togg')
        .forEach(e => (e.textContent.match(/\[\d+ more\]/) ? e.click() : null));

GM_registerMenuCommand('Expand All', expandAll);
