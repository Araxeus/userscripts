// ==UserScript==
// @name        disable ads mobalytics.gg
// @namespace   Violentmonkey Scripts
// @match       https://mobalytics.gg/poe-2/profile/230cecbd-9040-45f4-b95e-cee490c74641/builds/d384451b-ad37-4b52-bf27-42ebffd2757a*
// @grant       none
// @version     1.0
// @author      -
// @run-at      document-idle
// @description 12/28/2024, 11:15:24 AM
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
