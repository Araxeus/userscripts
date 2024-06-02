// ==UserScript==
// @name        clips.twitch.tv download button
// @namespace   Violentmonkey Scripts
// @match       https://clips.twitch.tv/*
// @run-at      document-idle
// @grant       none
// @version     1.0
// @author      -
// @description 6/1/2024, 2:25:12 AM
// @grant       GM_download
// ==/UserScript==

const $ = document.querySelector.bind(document);

const html = `<div class="Layout-sc-1xcs6mc-0 bMOhzu"><button id="download-button" aria-expanded="false" class="ScCoreButton-sc-ocjdkq-0 ScCoreButtonSecondary-sc-ocjdkq-2 bTXTVH cegTsp"><div class="ScCoreButtonLabel-sc-s7h2b7-0 hLLag"><div class="Layout-sc-1xcs6mc-0 iyOCUH" style="margin-right: 0 !important"><div class="ScCoreButtonIcon-sc-ypak37-0 evnVIg tw-core-button-icon"><div class="ScFigure-sc-wkgzod-0 fewniq tw-svg" data-a-selector="tw-core-button-icon"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" data-darkreader-inline-fill="" style="--darkreader-inline-fill: currentColor;">
  <path fill-rule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clip-rule="evenodd"></path>
  <path fill-rule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clip-rule="evenodd"></path>
</svg></div></div></div><div data-a-target="tw-core-button-label-text" class="Layout-sc-1xcs6mc-0 bFxzAY"></div></div></button></div>`;

const observer = new MutationObserver(() => {
	const button = $("button:has(div[data-a-selector])");
	if (button) {
		button.parentElement.insertAdjacentHTML("afterend", html);
		setup();
		observer.disconnect();
	}
});

observer.observe($(".simplebar-content"), {
	subtree: true,
	childList: true,
});

function setup() {
	const button = $("#download-button");
	button.onclick = () => {
		const video = $("video");
		const url = video.src;

		const name = `${$(".tw-title").textContent} - ${$(
			'[data-a-target="stream-title"]',
		).textContent.replaceAll(/[/\\?%*:|"<>]/g, "")}.mp4`;

		GM_download({
			url,
			name,
		});
	};
}
