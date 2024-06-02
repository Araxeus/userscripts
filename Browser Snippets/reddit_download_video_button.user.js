// ==UserScript==
// @name        reddit.com Video Download Button
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @run-at      document-idle
// @grant       none
// @version     1.0
// @author      -
// @description 6/1/2024, 2:25:12 AM
// @grant       GM.setClipboard
// @grant       GM.xmlHttpRequest
// ==/UserScript==
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
function xFetch(url) {
	return new Promise((resolve, reject) => {
		GM.xmlHttpRequest({
			url,
			fetch: true,
			onload: resolve,
			onerror: reject,
		});
	});
}

const buttonHtml = `<a rpl="" id="downloadButton" class="button border-md flex flex-row justify-center items-center mr-sm h-xl font-semibold relative text-12 button-secondary inline-flex items-center px-sm hover:text-secondary hover:bg-secondary-background-hover hover:border-secondary-background-hover"
data-post-click-location="comments-button" name="comments-action-button" style="height: var(--size-button-sm-h); font: var(--font-button-sm)" target="_self"><!--?lit$399984767$--><span class="flex items-center"> <!--?lit$399984767$--><span class="flex text-16 mr-[var(--rem6)]" style="margin-right: 0"><!--?lit$399984767$--><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"></path>
</svg>
</span> </span></a>`;

const observer = new MutationObserver(() => {
	const postsWithVideo = $$("shreddit-post:has(shreddit-player)");
	if (!postsWithVideo.length) return;

	for (const post of postsWithVideo) {
		if (post._canDownload) continue;
		const postNameClean = post.__postTitle.replaceAll(/[/\\?%*:|"<>]/g, "");
		const postUrl = `https://reddit.com${post.__permalink}`;
		const shareButton = post.shadowRoot.querySelector(
			'slot[name="share-button"]',
		);

		if (!shareButton) continue;

		post._canDownload = true;
		shareButton.insertAdjacentHTML("afterend", buttonHtml);
		const downloadButton = post.shadowRoot.querySelector("#downloadButton");
		downloadButton.onclick = async () => {
			downloadVideo(postUrl, postNameClean);
		};
	}
});

observer.observe($("shreddit-app"), {
	subtree: true,
	childList: true,
});

async function downloadVideo(postUrl, postName) {
	const json = await xFetch(`${postUrl}.json`);
	const data = JSON.parse(json.responseText)?.[0]?.data?.children?.[0]?.data;

	const videoUrl =
		getVideoUrlFromData(data) ||
		getVideoUrlFromData(data?.crosspost_parent_list?.[0]);
	if (data?.url?.endsWith(".gifv")) {
		window.open(data.url, "_blank");
		return;
	}
	if (!videoUrl) {
		alert("No video found");
		return;
	}

	const audioUrlOld = videoUrl.replace(/(DASH_).+(\.)/, "$1audio$2");
	const audioUrl128 = audioUrlOld.replace("audio", "AUDIO_128");
	const audioUrl64 = audioUrlOld.replace("audio", "AUDIO_64");
	let audioUrl;
	for (const url of [audioUrlOld, audioUrl128, audioUrl64]) {
		const audioResponse = await xFetch(url);
		if (audioResponse.status === 200 && !audioResponse.redirected) {
			audioUrl = url;
			break;
		}
	}

	if (audioUrl) {
		downloadWithFfmpeg(videoUrl, audioUrl, postName);
	} else {
		window.open(videoUrl, "_blank");
	}
}

function getVideoUrlFromData(data) {
	return (
		data?.secure_media?.reddit_video?.fallback_url ||
		data?.media?.reddit_video?.fallback_url
	);
}

async function downloadWithFfmpeg(videoUrl, audioUrl, postName) {
	const ffmpeg = `ffmpeg -i "${videoUrl}" -i "${audioUrl}" -c:v copy -c:a aac -strict experimental "C:/Users/Araxeus/Downloads/${postName}.mp4"`;
	GM.setClipboard(ffmpeg, "text/plain");
	alert(ffmpeg);
	console.log(ffmpeg);
}
