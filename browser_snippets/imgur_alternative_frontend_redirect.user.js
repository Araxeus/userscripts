// ==UserScript==
// @name         Imgur Alternative Frontend Redirector
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  5/24/2025, 8:10:03 AM Automatically redirect Imgur links to working alternative frontends
// @author       Araxeus
// @match        https://imgur.com/*
// @match        https://www.imgur.com/*
// @match        https://i.imgur.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// ==/UserScript==

(async () => {
    // List of alternative Imgur frontends to try
    /**
    const alternatives = [
        'https://rimgo.bloat.cat',
        'https://rimgo.catsarch.com',
        'https://imgur.artemislena.eu',
        //'https://rimgo.lunar.icu',
        'https://rimgo.reallyaweso.me',
        'https://imgur.fsky.io',
        'https://rimgo.totaldarkness.net',
        'https://imgur.010032.xyz',
        'https://i.habedieeh.re',
        'https://ri.nadeko.net',
        'https://rimgo.projectsegfau.lt',
        'https://rimgo.eu.projectsegfau.lt',
        'https://rimgo.us.projectsegfau.lt',
        'https://rimgo.in.projectsegfau.lt',
        'https://rimgo.fascinated.cc',
        'https://rimgo.nohost.network',
        'https://rimgo.drgns.space',
        'https://rimgo.quantenzitrone.eu',
        'https://rimgo.frylo.net',
        'https://rimgo.ducks.party',
        'https://rmgur.com',
        'https://rimgo.privacyredirect.com',
        'https://rimgo.darkness.services',
        'https://rimgo.aketawi.space',
        'https://imgur.nerdvpn.de',
        'https://rimgo.thebunny.zone',
        'https://r.opnxng.com',
        'https://imgur.sudovanilla.org'
    ];
    */
    // https://codeberg.org/rimgo/instances
    // https://rimgo.codeberg.page/api.json (run the code below in console:)
    // JSON.parse($('pre').textContent).clearnet.flatMap(i => i.note.startsWith('✅') ?i.url : []);

    //let alternatives = await GM.xmlHttpRequest({url: 'https://rimgo.codeberg.page/api.json'}).then(r => JSON.parse(r.response)).then(d => d.clearnet.flatMap(i => i.note.startsWith('✅') ?i.url : []));
    const alternatives = await GM.xmlHttpRequest({
        url: 'https://codeberg.org/rimgo/instances/raw/branch/main/README.md',
    }).then(({ responseText: r }) =>
        r
            .slice(r.indexOf('### Clearnet'), r.indexOf('### Tor'))
            .match(/\(https?:\/\/[^)]+\)/g)
            ?.map(url => url.slice(1, -1)),
    );
    // Function to extract the path from current URL
    /**
    const ignoreList = ['pussthecat'];
    alternatives = alternatives.filter(url => {
        for (const ignored of ignoreList) {
            if (url.includes(ignored)) return false;
        }
        return true;
    });
    */
    function getImgurPath() {
        const url = window.location.href;
        const match = url.match(/imgur\.com(.*)$/);
        return match ? match[1] : '';
    }

    // Function to check if a URL is accessible
    async function checkUrl(url) {
        return new Promise(resolve => {
            const timeoutId = setTimeout(() => {
                resolve(false);
            }, 5000); // 5 second timeout

            GM_xmlhttpRequest({
                method: 'HEAD',
                url: url,
                timeout: 5000,
                onload: response => {
                    clearTimeout(timeoutId);
                    // Check if response status indicates success (200-299)
                    resolve(response.status >= 200 && response.status < 300);
                },
                onerror: () => {
                    clearTimeout(timeoutId);
                    resolve(false);
                },
                ontimeout: () => {
                    clearTimeout(timeoutId);
                    resolve(false);
                },
            });
        });
    }

    async function tryAlternatives() {
        const imgurPath = getImgurPath();

        if (!imgurPath) {
            console.log('No valid Imgur path found');
            return;
        }

        console.log('Checking alternatives for path:', imgurPath);

        // Create promises for all alternatives simultaneously
        const checkPromises = alternatives.map(async alternative => {
            const testUrl = alternative + imgurPath;
            console.log('Trying:', testUrl);

            const isWorking = await checkUrl(testUrl);

            if (isWorking) {
                return testUrl;
            } else {
                throw new Error(`${testUrl} not working`);
            }
        });

        try {
            // Race all promises - first successful one wins
            const workingUrl = await Promise.any(checkPromises);
            console.log('Found working alternative:', workingUrl);
            //window.location.href = workingUrl;
            window.location.assign(workingUrl);
        } catch {
            // This will only trigger if ALL promises reject
            console.log('No working alternatives found, staying on Imgur');
        }
    }

    // Function to check if we should redirect (avoid infinite loops)
    function shouldRedirect() {
        // Don't redirect if we're already on an alternative
        const currentHost = window.location.host;
        for (const alt of alternatives) {
            const altHost = new URL(alt).host;
            if (currentHost === altHost) {
                return false;
            }
        }

        // Only redirect for image/album pages, not main imgur.com
        const path = getImgurPath();
        return (
            path &&
            (path.startsWith('/a/') ||
                path.startsWith('/gallery/') ||
                path.match(/^\/[a-zA-Z0-9]+$/))
        );
    }

    // Main execution
    if (shouldRedirect()) {
        // Add a small delay to ensure the page has started loading
        setTimeout(() => {
            tryAlternatives();
        }, 100);
    }
})();
