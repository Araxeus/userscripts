// ==UserScript==
// @name         AMO: Show first published date
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.1
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/amo_first_published.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/amo_first_published.user.js
// @description  Adds a "First published" date above "Last updated" on addons.mozilla.org add-on pages
// @author       Araxeus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=addons.mozilla.org
// @match        https://addons.mozilla.org/*
// @grant        none
// ==/UserScript==

// Firefox blocks extensions on AMO by default. To allow it, in about:config:
// remove addons.mozilla.org from extensions.webextensions.restrictedDomains
// and set privacy.resistFingerprinting.block_mozAddonManager to true

let waiting;

const getSlug = () => location.pathname.match(/\/addon\/([^/]+)\/?$/)?.[1];

async function run() {
    waiting?.disconnect();

    const slug = getSlug();
    if (!slug) return;

    const addon = await fetch(`/api/v5/addons/addon/${slug}/`)
        .then(r => r.json())
        .catch(() => null);
    if (!addon?.created || getSlug() !== slug) return;

    // The id check skips the previous add-on's DOM while React swaps pages
    const selector = `.Addon[data-site-identifier="${addon.id}"] .AddonMoreInfo-last-updated`;

    const tryInsert = () => {
        const lastUpdated = document.querySelector(selector);
        if (!lastUpdated) return;
        waiting.disconnect();
        insert(lastUpdated, addon.created);
    };

    waiting = new MutationObserver(tryInsert);
    waiting.observe(document.body, {
        childList: true,
        subtree: true,
        attributeFilter: ['data-site-identifier'],
    });
    tryInsert();
}

function insert(lastUpdated, created) {
    // React may keep the previous add-on's row when it reuses the list
    const old = document.querySelector('dd.first-published');
    old?.previousElementSibling.remove();
    old?.remove();

    const dt = document.createElement('dt');
    dt.className = 'Definition-dt';
    dt.textContent = 'First published';

    const dd = document.createElement('dd');
    dd.className = 'Definition-dd first-published';
    dd.textContent = new Date(created).toLocaleDateString(document.documentElement.lang, {
        dateStyle: 'medium',
    });

    lastUpdated.previousElementSibling.before(dt, dd);
}

navigation.addEventListener('navigatesuccess', run);
run();
