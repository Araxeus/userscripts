// ==UserScript==
// @name         disable ads mobalytics.gg
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/disable_ads_mobalytics.gg.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/disable_ads_mobalytics.gg.user.js
// @description  Disables ads on mobalytics.gg
// @author       Araxeus
// @match        https://mobalytics.gg/poe-2/profile/230cecbd-9040-45f4-b95e-cee490c74641/builds/d384451b-ad37-4b52-bf27-42ebffd2757a*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mobalytics.gg
// @grant        none
// @run-at       document-idle
// ==/UserScript==

setTimeout(hide, 1000);

function hide() {
    Array.from(document.querySelectorAll('div>span'))
        .filter(e => e.textContent === 'Advertisement')
        .forEach(e => {
            const parent = getNthParent(e, 4);
            parent.style.display = 'none';
        });
}

function getNthParent(el, n) {
    return n === 0 ? el : getNthParent(el.parentElement, n - 1);
}
