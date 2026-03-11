// ==UserScript==
// @name         Localhost Random Video Player
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/localhost_random_video_player.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/localhost_random_video_player.user.js
// @description  Play random videos on localhost
// @author       Araxeus
// @match        http://127.0.0.1:3000/random*
// @match        http://localhost:3000/random*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

console.info('UserScript loaded');

const video = document.querySelector('video');
if (!video) throw new Error('Video not found');
const url = new URL(window.location.href);

video.loop = true;
video.volume = 0;

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
        navigateTo('/random/previous', e);
    } else if (e.key === 'ArrowRight') {
        navigateTo('/random/next', e);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'r') {
        navigateTo('/random', e);
    } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
            video.requestFullscreen().catch(err => {
                console.log(err);
            });
        } else {
            document.exitFullscreen();
        }
    }
});

async function navigateTo(
    path,
    event, // event not required
) {
    url.pathname = path;
    video.src = url.href;
    event?.preventDefault();
    setTimeout(() => refreshCurrentUrl(), 50);
}

async function refreshCurrentUrl() {
    url.pathname = 'api/random/index';
    const data = await fetch(url, { cache: 'no-store' }).then(res => res.json());
    console.log(data);
    url.pathname = `random/[${data.index}]-${data.name}`;
    window.history.replaceState(null, null, url.href);
}

refreshCurrentUrl();
