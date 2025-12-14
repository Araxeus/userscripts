// ==UserScript==
// @name        hackernews expand all
// @namespace   Violentmonkey Scripts
// @match       https://news.ycombinator.com/item*
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      -
// @description 9/18/2024, 12:31:29 AM
// ==/UserScript==

const expandAll = () =>
    document
        .querySelectorAll('a.togg')
        .forEach(e => (e.textContent.match(/\[\d+ more\]/) ? e.click() : null));

GM_registerMenuCommand('Expand All', expandAll);
