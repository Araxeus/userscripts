// ==UserScript==
// @name        cloudeflare domain finder
// @namespace   Violentmonkey Scripts
// @match       https://dash.cloudflare.com/*/domains/register
// @run-at      document-idle
// @grant       none
// @version     1.0
// @author      Araxeus
// @description 8/10/2024, 10:22:36 AM
// ==/UserScript==

if (!window.search) window.search = run;
else window.searchForDomain = run;
run();

async function run(domainName) {
    await waitFor('button[type="submit"]');
    domainName ??= prompt('domain name?');
    if (!domainName) {
        return;
    }

    const accountId = document.location.pathname.match(/\/([^/]+)\/domains\/register/)[1];

    const supportedTldsNames = await fetch(
        `https://dash.cloudflare.com/api/v4/accounts/${accountId}/registrar/domains/supported_tlds`,
    )
        .then(r => r.json())
        .then(r => r.result.tlds);

    const supportedTlds = Object.fromEntries(
        supportedTldsNames.map(tld => [`${domainName}.${tld}`, undefined]),
    );

    const total = supportedTldsNames.length;

    let count = 0;
    for (const nextTlds of get()) {
        const res = await Promise.all(
            nextTlds.map(tld =>
                fetch(
                    `https://dash.cloudflare.com/api/v4/accounts/${accountId}/registrar/domains/search`,
                    {
                        method: 'POST',
                        body: JSON.stringify({ query: tld }),
                        headers: {
                            'content-type': 'application/json',
                            'X-Cross-Site-Security': 'dash',
                        },
                    },
                )
                    .then(r => r.json())
                    .then(({ result }) => [
                        ...result.domains.flatMap(({ name, price, availability }) =>
                            name.startsWith(`${domainName}.`)
                                ? [{ name, price, availability }]
                                : [],
                        ),
                        {
                            name: result.check_result.name,
                            price: result.check_result.fees?.registration_fee ?? 0,
                            availability:
                                result.check_result.can_register && result.check_result.available
                                    ? 'available'
                                    : 'nope',
                        },
                    ]),
            ),
        );

        for (const domain of res.flat()) {
            if (supportedTlds[domain.name] === undefined) {
                supportedTlds[domain.name] =
                    domain.availability === 'available' ? domain.price : null;
                count++;
            }
        }
        console.log({
            count,
            total,
            nextTlds: JSON.stringify(nextTlds),
        });
    }

    const orderedByPrice = Object.fromEntries(
        Object.entries(supportedTlds).sort((a, b) => {
            const valA = a[1] == null ? Number.POSITIVE_INFINITY : a[1];
            const valB = b[1] == null ? Number.POSITIVE_INFINITY : b[1];
            return valB - valA;
        }),
    );

    console.table(orderedByPrice);

    function* get() {
        const res = [];
        while (supportedTldsNames.length > 0) {
            const tld = `${domainName}.${supportedTldsNames.pop()}`;
            if (supportedTlds[tld] === undefined) res.push(tld);
            if (res.length === 25 || supportedTldsNames.length === 0) {
                yield res;
                res.length = 0; // Clear the array for the next batch
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const t = 100; // delay
function waitFor(selector) {
    return new Promise(resolve => {
        const element = document.querySelector(selector);
        if (element) return resolve(element);
        new MutationObserver(async (mutations, observer) => {
            for (const mutation of mutations) {
                if (mutation.type !== 'childList') continue;
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;
                    if (node.matches(selector)) {
                        observer.disconnect();
                        return sleep(t).then(() => resolve(node));
                    }
                    const found = node.querySelector(selector);
                    if (!found) continue;
                    observer.disconnect();
                    return sleep(t).then(() => resolve(found));
                }
            }
        }).observe(document.body, { childList: true, subtree: true });
    });
}
