// ==UserScript==
// @name         Claude Artifact Fullscreen
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/claude_artifact_fullscreen.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/claude_artifact_fullscreen.user.js
// @description  Hides the toolbar on Claude artifact pages and expands the artifact to the full page. Hover the top edge to reveal the toolbar.
// @author       Araxeus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @match        https://claude.ai/artifact/*
// @match        https://claude.ai/code/artifact/*
// @grant        GM_addStyle
// ==/UserScript==

const TOOLBAR = 'div[role="toolbar"]';
const HIDE_DELAY = 500;

GM_addStyle(`
    main {
        inset: 0 !important;
    }

    ${TOOLBAR} {
        position: fixed !important;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2147483646;
        transform: translateY(-100%);
        transition: transform 150ms ease;
    }

    html.cat-show ${TOOLBAR} {
        transform: none;
    }

    #cat-hover-zone {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        z-index: 2147483647;
    }
`);
// The artifact iframe swallows mouse events, so this strip catches the top edge

const zone = document.createElement('div');
zone.id = 'cat-hover-zone';
document.body.append(zone);

let hideTimer;

const isHoverTarget = el => el instanceof Element && (el === zone || el.closest(TOOLBAR));

// Delegated listeners survive React re-rendering the toolbar

document.addEventListener('mouseover', e => {
    if (!isHoverTarget(e.target)) return;
    clearTimeout(hideTimer);
    document.documentElement.classList.add('cat-show');
});

document.addEventListener('mouseout', e => {
    if (!isHoverTarget(e.target) || isHoverTarget(e.relatedTarget)) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => document.documentElement.classList.remove('cat-show'), HIDE_DELAY);
});
