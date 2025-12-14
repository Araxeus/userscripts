// ==UserScript==
// @name        reddit.com Video Download Button
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @run-at      document-idle
// @version     1.0
// @author      -
// @description 6/1/2024, 2:25:12 AM
// @grant       GM.setClipboard
// @grant       GM.xmlHttpRequest
// ==/UserScript==
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
function xFetch(urlOrOptions) {
    let url;
    let options;
    if (typeof urlOrOptions === 'string') {
        url = urlOrOptions;
        options = {};
    } else {
        url = urlOrOptions.url;
        options = urlOrOptions;
    }
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            url,
            fetch: true,
            timeout: 10000,
            onload: resolve,
            onerror: reject,
            onabort: reject,
            ontimeout: reject,
            ...options,
        });
    });
}

const buttonHtml = /*html*/ `<a rpl="" id="downloadButton" class="button border-md flex flex-row justify-center items-center mr-sm h-xl font-semibold relative text-12 button-secondary inline-flex items-center px-sm hover:text-secondary hover:bg-secondary-background-hover hover:border-secondary-background-hover"
data-post-click-location="comments-button" name="comments-action-button" style="height: var(--size-button-sm-h); font: var(--font-button-sm)" target="_self"><!--?lit$399984767$--><span class="flex items-center"> <!--?lit$399984767$--><span class="flex text-16 mr-[var(--rem6)]" style="margin-right: 0"><!--?lit$399984767$--><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"></path>
</svg>
</span> </span></a>`;

const observer = new MutationObserver(() => {
    const postsWithVideo = new Set([
        ...$$('shreddit-post:has(shreddit-player)'),
        ...$$('shreddit-post:has(shreddit-player-2)'),
    ]);
    if (!postsWithVideo.size) return;

    for (const post of postsWithVideo) {
        if (post._canDownload) continue;
        const postNameClean = post.__postTitle.replaceAll(/[/\\?%*:|"<>]/g, '');
        const postUrl = `https://reddit.com${post.__permalink}`;
        const shareButton = post.shadowRoot.querySelector('slot[name="share-button"]');

        if (!shareButton) continue;

        post._canDownload = true;
        shareButton.insertAdjacentHTML('afterend', buttonHtml);
        const downloadButton = post.shadowRoot.querySelector('#downloadButton');
        downloadButton.onclick = async () => {
            //downloadVideoWithCobalt(postUrl);
            downloadVideo(postUrl, postNameClean);
        };
    }
});

observer.observe($('shreddit-app'), {
    subtree: true,
    childList: true,
});

async function downloadVideo(postUrl, postName) {
    const json = await xFetch(`${postUrl}.json`);
    const data = JSON.parse(json.responseText)?.[0]?.data?.children?.[0]?.data;

    const videoUrl =
        getVideoUrlFromData(data) || getVideoUrlFromData(data?.crosspost_parent_list?.[0]);
    if (data?.url?.endsWith('.gifv')) {
        window.open(data.url, '_blank');
        return;
    }
    if (!videoUrl) {
        alert('No video found');
        return;
    }

    const audioUrlOld = videoUrl.replace(/(DASH_).+(\.)/, '$1audio$2');
    const audioUrl128 = audioUrlOld.replace('audio', 'AUDIO_128');
    const audioUrl64 = audioUrlOld.replace('audio', 'AUDIO_64');
    let audioUrl;
    for (const url of [audioUrlOld, audioUrl128, audioUrl64]) {
        const audioResponse = await xFetch(url);
        if (audioResponse.status === 200 && !audioResponse.redirected) {
            audioUrl = url;
            break;
        }
    }

    if (audioUrl) {
        downloadWithLocalServer(videoUrl, audioUrl, postName).catch(() => {
            downloadWithFfmpeg(videoUrl, audioUrl, postName);
        });
    } else {
        window.open(videoUrl, '_blank');
    }
}

function getVideoUrlFromData(data) {
    return (
        data?.secure_media?.reddit_video?.fallback_url || data?.media?.reddit_video?.fallback_url
    );
}

async function downloadWithFfmpeg(videoUrl, audioUrl, postName) {
    const ffmpeg = `ffmpeg -i "${videoUrl}" -i "${audioUrl}" -c:v copy -c:a aac -strict experimental "C:/Users/Araxeus/Downloads/${postName}.mp4"`;
    GM.setClipboard(ffmpeg, 'text/plain');
    //alert(ffmpeg);
    console.log(ffmpeg);
}

async function downloadWithLocalServer(videoUrl, audioUrl, postName) {
    const res = await xFetch({
        method: 'POST',
        url: 'http://localhost:3000/api/reddit_video_download',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            videoUrl,
            audioUrl,
            title: postName,
        }),
    }).catch(err => {
        console.log(err);
        alert('Failed to start download, check the console for more info');
        throw err;
    });
    if (!res) return;
    //console.log(res); // DELETE
    const data = JSON.parse(res.response);
    if (data.success === true && res.status === 200) {
        console.log('Download started');
        alert('Download started, check Local Server');
    } else {
        console.log('Failed to start download:');
        console.log(data.error);
        alert('Failed to start download, check the console for more info');
        throw new Error(data.error);
    }
}

async function downloadVideoWithCobalt(postUrl) {
    console.log(`Downloading video from ${postUrl}`); // DELETE
    const res = await xFetch({
        method: 'POST',
        url: 'https://api.cobalt.tools/api/json',
        headers: {
            'Cache-Control': 'no-cache',
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            url: encodeURI(postUrl), // video url
            vQuality: 'max', // always max quality
            filenamePattern: 'basic', // file name = video title
            disableMetadata: true, // privacy
        }),
    });
    console.log(res); // DELETE
    const str = JSON.parse(res.responseText);
    console.log(str); // DELETE
    if (str.status === 'stream') {
        //success
        window.open(str.url, '_blank');
    } else {
        alert(`Failed to download video: ${str.error}`);
    }
}
