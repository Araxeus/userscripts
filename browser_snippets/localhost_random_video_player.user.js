// ==UserScript==
// @name        Localhost Random Video Player
// @namespace   Violentmonkey Scripts
// @match       http://127.0.0.1:3000/random*
// @match       http://localhost:3000/random*
// @run-at      document-idle
// @grant       none
// @version     1.0
// @author      -
// @description 6/3/2024, 12:36:37 AM
// ==/UserScript==

console.info('UserScript loaded');

const video = document.querySelector('video');
if (!video) throw new Error('Video not found');
const url = new URL(window.location.href);

video.loop = true;
video.volume = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        navigateTo('/random/previous', e);
    } else if (e.key === 'ArrowRight') {
        navigateTo('/random/next', e);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'r') {
        navigateTo('/random', e);
    } else if (e.key === 'f' || e.key === 'F') {
		if (!document.fullscreenElement) {
			video.requestFullscreen().catch((err) => {
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
    const data = await fetch(url, { cache: 'no-store' }).then((res) =>
        res.json(),
    );
    console.log(data);
    url.pathname = `random/[${data.index}]-${data.name}`;
    window.history.replaceState(null, null, url.href);
}

refreshCurrentUrl();

