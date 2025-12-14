javascript: (async ()=>{})()

// INSTANT VERSION

(async ()=>{
    // 1. Get the current url and remove queries.
    const url = window.location.href.split('?')[0];
    // 2. Fetch the JSON data of the post.
    const data = await fetch(`${url}.json`)
        .then(res => res.json())
        .then(json => json?.[0]?.data?.children?.[0]?.data);
    // 3. Try to get the video URL.
    const videoUrl =
        data?.secure_media?.reddit_video?.fallback_url ||
        data?.media?.reddit_video?.fallback_url;
    // 4. Get the audio URL from the video URL.
    const audioUrlOld = videoUrl.replace(/(DASH_).+(\.)/, '$1audio$2');
    const audioUrl128 = audioUrlOld.replace('audio', 'AUDIO_128');
    const audioUrl64 = audioUrlOld.replace('audio', 'AUDIO_64');
    let audioUrl;
    let audioResponse;
    // try fetching each audio url
    for (const url of [audioUrlOld, audioUrl128, audioUrl64]) {
        audioResponse = await fetch(url);
        if (audioResponse.ok && !audioResponse.redirected) {
            audioUrl = url;
            break;
        }
    }
    // 6. If the audio URL is valid, add the audio stream to the video stream.
    if (audioUrl) {
        // 7. Get the post name and replace the spaces with underscores.
        const postName = data?.title.replaceAll(' ', '_').replaceAll(/[/\\?%*:|"<>]/g, '');
        // 8. Define the ffmpeg command.
        const ffmpeg = `ffmpeg -i "${videoUrl}" -i "${audioUrl}" -c:v copy -c:a aac -strict experimental "${postName}.mp4"`;
        // 9. Log the command to the console.
        console.log(ffmpeg);
        // 10. Copy the command to the clipboard and add an alert.
        navigator.clipboard.writeText(ffmpeg).catch(()=>{}).finally(()=>{alert(ffmpeg)});
    // 11. If the audio URL is not valid, open the video URL in a new tab.
    } else {
        window.open(videoUrl, '_blank');
    }
})()

// biome-ignore lint/style/useSingleVarDeclarator: <explanation>
// biome-ignore lint/style/useTemplate: <explanation>
javascript: (async ()=>{(async()=>{(async()=>{let e=window.location.href.split("?")[0],a=await fetch(e+".json").then(e=>e.json()).then(e=>e?.[0]?.data?.children?.[0]?.data),l=a?.secure_media?.reddit_video?.fallback_url||a?.media?.reddit_video?.fallback_url,i=l.replace(/(DASH_).+(\.)/,"$1audio$2"),t=i.replace("audio","AUDIO_128"),c=i.replace("audio","AUDIO_64"),r,d;for(let o of[i,t,c])if((d=await fetch(o)).ok&&!d.redirected){r=o;break}if(r){let p=a?.title.replaceAll(" ","_").replaceAll(/[/\\?%*:|"<>]/g,""),n=`ffmpeg -i "${l}" -i "${r}" -c:v copy -c:a aac -strict experimental "${p}.mp4"`;console.log(n),navigator.clipboard.writeText(n).catch(()=>{}).finally(()=>{alert(n)})}else window.open(l,"_blank")})()})();})()


// OLD VERSION

const selectors = ['secure_media', 'media'];

const getVideoUrl = async url => {
    url = url.split('?')[0]; // Remove queries
    const data = await fetch(url + '.json')
        .then(res => res.json())
        .then(json => json?.[0]?.data?.children?.[0]?.data);
    const postName = data?.title.replaceAll(' ', '_');
    const videoUrl = data?.secure_media?.reddit_video?.fallback_url || data?.media?.reddit_video?.fallback_url;
    const audioUrl = videoUrl.replace(/(DASH_).+(\.)/, '$1audio$2');

    return [postName, videoUrl, audioUrl];
};

document.body.addEventListener(
    'mousedown',
    async e => {
        if (e.button === 1) {
            const video =
                e.target.localName === 'video'
                    ? e.target
                    : Array.from(e.target.parentElement.childNodes).find(
                          e => e.localName === 'video'
                      );
            if (video) {
                const pageUrl =
                    video.parentElement.querySelector('a')?.href ||
                    video.baseURI;
                const [postName, videoUrl, audioUrl] = await getVideoUrl(pageUrl);
                const audioResponse = await fetch(audioUrl);
                if (audioResponse.ok) {
                    const ffmpeg = `ffmpeg -i "${videoUrl}" -i "${audioUrl}" -c:v copy -c:a aac -strict experimental ${postName}.mp4`
                    console.log(ffmpeg)
                    navigator.clipboard.writeText(ffmpeg)
                } else {
                    window.open(videoUrl, '_blank');
                }
            }
        }
    },
    false
);

javascript: (() => {const selectors=["secure_media","media"],getVideoUrl=async e=>{e=e.split("?")[0];const t=await fetch(e+".json").then((e=>e.json())).then((e=>e?.[0]?.data?.children?.[0]?.data)),a=t?.title.replaceAll(" ","_"),o=t?.secure_media?.reddit_video?.fallback_url||t?.media?.reddit_video?.fallback_url,i=o.replace(/(DASH_).+(\.)/,"$1audio$2");return[a,o,i]};document.body.addEventListener("mousedown",(async e=>{if(1===e.button){const t="video"===e.target.localName?e.target:Array.from(e.target.parentElement.childNodes).find((e=>"video"===e.localName));if(t){const e=t.parentElement.querySelector("a")?.href||t.baseURI,[a,o,i]=await getVideoUrl(e);if((await fetch(i)).ok){const e=`ffmpeg -i "${o}" -i "${i}" -c:v copy -c:a aac -strict experimental ${a}.mp4`;console.log(e),navigator.clipboard.writeText(e)}else window.open(o,"_blank")}}}),!1);})()
