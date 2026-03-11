// ==UserScript==
// @name         x.com/twitter.com Video Download Button
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/twitter_video_download_button.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/twitter_video_download_button.user.js
// @description  Adds a download button to x.com/twitter.com videos
// @author       Araxeus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @match        https://x.com/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==
const $ = document.querySelector.bind(document);
const verbose = false;
const API = hoistAPI();

const downloadButtonHtml = /*html*/ `<div class="css-175oi2r r-18u37iz r-1h0z5md r-1wron08"><button id="downloadButton" aria-label="Download" role="button" class="css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l" data-testid="bookmark" type="button"><div dir="ltr" class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q" style="text-overflow: unset; color: rgb(83, 100, 113); --darkreader-inline-color: #aaa398;" data-darkreader-inline-color=""><div class="css-175oi2r r-xoduu5"><div class="css-175oi2r r-xoduu5 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-1niwhzg r-sdzlij r-xf4iuw r-o7ynqc r-6416eg r-1ny4l3l"></div><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke: currentColor;"></path>
</svg>
</div></div></button></div>`;

GM_registerMenuCommand('Test', async () => {
    const post = $('article:has(video)');
    downloadVideo(post);
});

async function setup(timeline) {
    const observer = new MutationObserver(() => {
        const postsWithVideo = timeline.querySelectorAll(
            'article:has(video):not(.downloadable_video)',
        );
        if (!postsWithVideo.length) return;

        for (const post of postsWithVideo) {
            if (post._canDownload) continue;
            post._canDownload = true;
            post.classList.add('downloadable_video');
            // const postNameClean = post.__postTitle.replaceAll(/[/\\?%*:|"<>]/g, "");
            // const postUrl = `https://reddit.com${post.__permalink}`;
            const shareButton = post.querySelector('button[aria-label="Share post"]');

            if (!shareButton) continue;

            shareButton.insertAdjacentHTML('beforeBegin', downloadButtonHtml);
            const downloadButton = post.querySelector('#downloadButton');
            downloadButton.onclick = async () => {
                downloadVideo(post);
            };
        }
    });

    observer.observe(timeline, {
        subtree: true,
        childList: true,
    });
}

const observer = new MutationObserver(() => {
    const timeline = $('body');
    if (timeline) {
        setup(timeline);
        observer.disconnect();
    }
});

observer.observe(document.body, {
    subtree: true,
    childList: true,
});

async function downloadVideo(post) {
    const link =
        post.querySelector('div[dir="ltr"]>a')?.href ||
        post.querySelector('a[href*="/status/"]')?.href;
    if (!link) {
        throw new Error('No link found');
    }
    const id = link.match(/(?<=\/status\/)\d+/)?.[0];
    const medias = await API.getTweetMedias(id);
    // window.open(medias?.[0].download_url);
    // Inject muted video element
    const newTab = window.open('', '_blank', 'popup');
    newTab.document.body.innerHTML = `
                    <video controls autoplay muted style="
                            margin: auto;
                            position: absolute;
                            top: 0px;
                            right: 0px;
                            bottom: 0px;
                            left: 0px;
                            max-height: 100%;
                            max-width: 100%;">
                        <source src="${medias?.[0].download_url}" type="video/mp4">
                    </video>
                `;
}

function getCookie(name) {
    const regExp = new RegExp(`(?<=${name}=)[^;]+`);
    return document.cookie.match(regExp)?.[0];
}

// --- Twitter.API --- //
function hoistAPI() {
    // biome-ignore lint/complexity/noStaticOnlyClass: it is a static class
    class API {
        static guestToken = getCookie('gt');
        static csrfToken = getCookie('ct0'); // todo: lazy — not available at the first run
        // Guest/Suspended account Bearer token
        static guestAuthorization =
            'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

        // Seems to be outdated at 2022.05
        static async _requestBearerToken() {
            const scriptSrc = [...document.querySelectorAll('script')].find(el =>
                el.src.match(
                    /https:\/\/abs\.twimg\.com\/responsive-web\/client-web\/main[\w.]*\.js/,
                ),
            ).src;

            let text;
            try {
                text = await (await fetch(scriptSrc)).text();
            } catch (err) {
                /* verbose && */ console.error('[ujs][_requestBearerToken][scriptSrc]', scriptSrc);
                /* verbose && */ console.error('[ujs][_requestBearerToken]', err);
                throw err;
            }

            const authorizationKey = text.match(
                /(?<=")AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D.+?(?=")/,
            )[0];
            const authorization = `Bearer ${authorizationKey}`;

            return authorization;
        }

        static async getAuthorization() {
            if (!API.authorization) {
                API.authorization = await API._requestBearerToken();
            }
            return API.authorization;
        }

        static requestCache = new Map();
        static vacuumCache() {
            if (API.requestCache.size > 16) {
                API.requestCache.delete(API.requestCache.keys().next().value);
            }
        }

        static async apiRequest(url) {
            const _url = url.toString();
            verbose && console.log('[ujs][apiRequest]', _url);

            if (API.requestCache.has(_url)) {
                verbose && console.log('[ujs][apiRequest] Use cached API request', _url);
                return API.requestCache.get(_url);
            }

            // Hm... it is always the same. Even for a logged user.
            // const authorization = API.guestToken ? API.guestAuthorization : await API.getAuthorization();
            const authorization = API.guestAuthorization;

            const headers = new Headers({
                authorization,
                'x-csrf-token': API.csrfToken,
                'x-twitter-client-language': 'en',
                'x-twitter-active-user': 'yes',
            });
            if (API.guestToken) {
                headers.append('x-guest-token', API.guestToken);
            } else {
                // may be skipped
                headers.append('x-twitter-auth-type', 'OAuth2Session');
            }

            let json;
            try {
                const response = await fetch(_url, { headers });
                json = await response.json();
                if (response.ok) {
                    verbose && console.log('[ujs][apiRequest]', 'Cache API request', _url);
                    API.vacuumCache();
                    API.requestCache.set(_url, json);
                }
            } catch (err) {
                /* verbose && */ console.error('[ujs][apiRequest]', _url);
                /* verbose && */ console.error('[ujs][apiRequest]', err);
                throw err;
            }

            verbose && console.log('[ujs][apiRequest][json]', JSON.stringify(json, null, ' '));
            // 429 - [{code: 88, message: "Rate limit exceeded"}] — for suspended accounts

            return json;
        }

        static async getTweetJson(tweetId) {
            const url = API.createTweetJsonEndpointUrl(tweetId);
            const json = await API.apiRequest(url);
            verbose && console.log('[ujs][getTweetJson]', json, JSON.stringify(json));
            return json;
        }

        /** return {tweetResult, tweetLegacy, tweetUser} */
        static parseTweetJson(json, tweetId) {
            const instruction =
                json.data.threaded_conversation_with_injections_v2.instructions.find(
                    ins => ins.type === 'TimelineAddEntries',
                );
            const tweetEntry = instruction.entries.find(ins => ins.entryId === `tweet-${tweetId}`);
            let tweetResult = tweetEntry.content.itemContent.tweet_results.result; // {"__typename": "Tweet"} // or {"__typename": "TweetWithVisibilityResults", tweet: {...}} (1641596499351212033)
            if (tweetResult.tweet) {
                tweetResult = tweetResult.tweet;
            }
            verbose &&
                console.log(
                    '[ujs][parseTweetJson] tweetResult',
                    tweetResult,
                    JSON.stringify(tweetResult),
                );
            const tweetUser = tweetResult.core.user_results.result; // {"__typename": "User"}
            const tweetLegacy = tweetResult.legacy;
            verbose &&
                console.log(
                    '[ujs][parseTweetJson] tweetLegacy',
                    tweetLegacy,
                    JSON.stringify(tweetLegacy),
                );
            verbose &&
                console.log(
                    '[ujs][parseTweetJson] tweetUser',
                    tweetUser,
                    JSON.stringify(tweetUser),
                );
            return { tweetResult, tweetLegacy, tweetUser };
        }

        /**
         * @typedef {Object} TweetMediaEntry
         * @property {string} screen_name - "kreamu"
         * @property {string} tweet_id - "1687962620173733890"
         * @property {string} download_url - "https://pbs.twimg.com/media/FWYvXNMXgAA7se2?format=jpg&name=orig"
         * @property {"photo" | "video"} type - "photo"
         * @property {"photo" | "video" | "animated_gif"} type_original - "photo"
         * @property {number} index - 0
         * @property {number} type_index - 0
         * @property {number} type_index_original - 0
         * @property {string} preview_url - "https://pbs.twimg.com/media/FWYvXNMXgAA7se2.jpg"
         * @property {string} media_id  -   "1687949851516862464"
         * @property {string} media_key - "7_1687949851516862464"
         * @property {string} expanded_url - "https://twitter.com/kreamu/status/1687962620173733890/video/1"
         * @property {string} short_expanded_url - "pic.twitter.com/KeXR8T910R"
         * @property {string} short_tweet_url - "https://t.co/KeXR8T910R"
         * @property {string} tweet_text - "Tracer providing some In-flight entertainment"
         */
        /** @returns {TweetMediaEntry[]} */
        static parseTweetLegacyMedias(tweetResult, tweetLegacy, tweetUser) {
            if (!tweetLegacy.extended_entities || !tweetLegacy.extended_entities.media) {
                return [];
            }

            const medias = [];
            const typeIndex = {}; // "photo", "video", "animated_gif"
            let index = -1;

            for (const media of tweetLegacy.extended_entities.media) {
                index++;
                let type = media.type;
                const type_original = media.type;
                typeIndex[type] = (typeIndex[type] === undefined ? -1 : typeIndex[type]) + 1;
                if (type === 'animated_gif') {
                    type = 'video';
                    typeIndex[type] = (typeIndex[type] === undefined ? -1 : typeIndex[type]) + 1;
                }

                let download_url;
                if (media.video_info) {
                    const videoInfo = media.video_info.variants
                        .filter(el => el.bitrate !== undefined) // if content_type: "application/x-mpegURL" // .m3u8
                        .reduce((acc, cur) => (cur.bitrate > acc.bitrate ? cur : acc));
                    download_url = videoInfo.url;
                } else {
                    if (media.media_url_https.includes('?format=')) {
                        download_url = media.media_url_https;
                    } else {
                        // "https://pbs.twimg.com/media/FWYvXNMXgAA7se2.jpg" -> "https://pbs.twimg.com/media/FWYvXNMXgAA7se2?format=jpg&name=orig"
                        const parts = media.media_url_https.split('.');
                        const ext = parts[parts.length - 1];
                        const urlPart = parts.slice(0, -1).join('.');
                        download_url = `${urlPart}?format=${ext}&name=orig`;
                    }
                }

                const screen_name = tweetUser.legacy.screen_name; // "kreamu"
                const tweet_id = tweetResult.rest_id || tweetLegacy.id_str; // "1687962620173733890"

                const type_index = typeIndex[type]; // 0
                const type_index_original = typeIndex[type_original]; // 0

                const preview_url = media.media_url_https; // "https://pbs.twimg.com/ext_tw_video_thumb/1687949851516862464/pu/img/mTBjwz--nylYk5Um.jpg"
                const media_id = media.id_str; //   "1687949851516862464"
                const media_key = media.media_key; // "7_1687949851516862464"

                const expanded_url = media.expanded_url; // "https://twitter.com/kreamu/status/1687962620173733890/video/1"
                const short_expanded_url = media.display_url; // "pic.twitter.com/KeXR8T910R"
                const short_tweet_url = media.url; // "https://t.co/KeXR8T910R"
                const tweet_text = tweetLegacy.full_text // "Tracer providing some In-flight entertainment https://t.co/KeXR8T910R"
                    .replace(` ${media.url}`, '');

                // {screen_name, tweet_id, download_url, preview_url, type_index}
                /** @type {TweetMediaEntry} */
                const mediaEntry = {
                    screen_name,
                    tweet_id,
                    download_url,
                    type,
                    type_original,
                    index,
                    type_index,
                    type_index_original,
                    preview_url,
                    media_id,
                    media_key,
                    expanded_url,
                    short_expanded_url,
                    short_tweet_url,
                    tweet_text,
                };
                medias.push(mediaEntry);
            }

            verbose && console.log('[ujs][parseTweetLegacyMedias] medias', medias);
            return medias;
        }

        static async getTweetMedias(tweetId) {
            const tweetJson = await API.getTweetJson(tweetId);
            const { tweetResult, tweetLegacy, tweetUser } = API.parseTweetJson(tweetJson, tweetId);

            let result = API.parseTweetLegacyMedias(tweetResult, tweetLegacy, tweetUser);

            if (
                tweetResult.quoted_status_result?.result /* check is the qouted tweet not deleted */
            ) {
                const tweetResultQuoted = tweetResult.quoted_status_result.result;
                const tweetLegacyQuoted = tweetResultQuoted.legacy;
                const tweetUserQuoted = tweetResultQuoted.core.user_results.result;
                result = [
                    ...result,
                    ...API.parseTweetLegacyMedias(
                        tweetResultQuoted,
                        tweetLegacyQuoted,
                        tweetUserQuoted,
                    ),
                ];
            }

            return result;
        }

        /*  // dev only snippet (to extract params):
            a = new URL(`https://x.com/i/api/graphql/VwKJcAd7zqlBOitPLUrB8A/TweetDetail?...`);
            console.log("variables",    JSON.stringify(JSON.parse(Object.fromEntries(a.searchParams).variables),    null, "    "))
            console.log("features",     JSON.stringify(JSON.parse(Object.fromEntries(a.searchParams).features),     null, "    "))
            console.log("fieldToggles", JSON.stringify(JSON.parse(Object.fromEntries(a.searchParams).fieldToggles), null, "    "))
        */

        // todo: keep `queryId` updated
        // https://github.com/fa0311/TwitterInternalAPIDocument/blob/master/docs/json/API.json
        static TweetDetailQueryId = 'VwKJcAd7zqlBOitPLUrB8A'; // TweetDetail      (for videos)
        static UserByScreenNameQueryId = 'qW5u-DAuXpMEG0zA1F7UGQ'; // UserByScreenName (for the direct user profile url)

        static createTweetJsonEndpointUrl(tweetId) {
            const variables = {
                focalTweetId: tweetId,
                with_rux_injections: true,
                includePromotedContent: true,
                withCommunity: true,
                withQuickPromoteEligibilityTweetFields: true,
                withBirdwatchNotes: true,
                withVoice: true,
                withV2Timeline: true,
            };
            const features = {
                rweb_tipjar_consumption_enabled: true,
                responsive_web_graphql_exclude_directive_enabled: true,
                creator_subscriptions_tweet_preview_api_enabled: true,
                verified_phone_label_enabled: false,
                responsive_web_graphql_timeline_navigation_enabled: true,
                responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
                communities_web_enable_tweet_community_results_fetch: true,
                c9s_tweet_anatomy_moderator_badge_enabled: true,
                articles_preview_enabled: true,
                tweetypie_unmention_optimization_enabled: true,
                responsive_web_edit_tweet_api_enabled: true,
                graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
                view_counts_everywhere_api_enabled: true,
                longform_notetweets_consumption_enabled: true,
                responsive_web_twitter_article_tweet_consumption_enabled: true,
                tweet_awards_web_tipping_enabled: false,
                creator_subscriptions_quote_tweet_preview_enabled: false,
                freedom_of_speech_not_reach_fetch_enabled: true,
                standardized_nudges_misinfo: true,
                tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
                rweb_video_timestamps_enabled: true,
                longform_notetweets_rich_text_read_enabled: true,
                longform_notetweets_inline_media_enabled: true,
                responsive_web_enhance_cards_enabled: false,
            };
            const fieldToggles = {
                withArticleRichContentState: true,
                withArticlePlainText: false,
                withGrokAnalyze: false,
            };

            const urlBase = `https://x.com/i/api/graphql/${API.TweetDetailQueryId}/TweetDetail`;
            const urlObj = new URL(urlBase);
            urlObj.searchParams.set('variables', JSON.stringify(variables));
            urlObj.searchParams.set('features', JSON.stringify(features));
            urlObj.searchParams.set('fieldToggles', JSON.stringify(fieldToggles));
            const url = urlObj.toString();
            return url;
        }

        static async getUserInfo(username) {
            const variables = {
                screen_name: username,
                withSafetyModeUserFields: true,
            };
            const features = {
                creator_subscriptions_tweet_preview_api_enabled: true,
                hidden_profile_likes_enabled: true,
                hidden_profile_subscriptions_enabled: true,
                highlights_tweets_tab_ui_enabled: true,
                responsive_web_graphql_exclude_directive_enabled: true,
                responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
                responsive_web_graphql_timeline_navigation_enabled: true,
                responsive_web_twitter_article_notes_tab_enabled: true,
                rweb_tipjar_consumption_enabled: true,
                subscriptions_verification_info_is_identity_verified_enabled: true,
                subscriptions_verification_info_verified_since_enabled: true,
                verified_phone_label_enabled: false,
            };
            const fieldToggles = {
                withAuxiliaryUserLabels: false,
            };

            const urlBase = `https://x.com/i/api/graphql/${API.UserByScreenNameQueryId}/UserByScreenName?`;
            const urlObj = new URL(urlBase);
            urlObj.searchParams.set('variables', JSON.stringify(variables));
            urlObj.searchParams.set('features', JSON.stringify(features));
            urlObj.searchParams.set('fieldToggles', JSON.stringify(fieldToggles));
            const url = urlObj.toString();

            const json = await API.apiRequest(url);
            verbose && console.log('[ujs][getUserInfo][json]', json);
            return json.data.user.result.legacy.entities.url?.urls[0].expanded_url;
        }
    }

    return API;
}
