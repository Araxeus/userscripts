// ==UserScript==
// @name         YouTube Hide Progress
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/youtube_hide_progress.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/youtube_hide_progress.user.js
// @description  Hides the YouTube video progress bar and total time
// @author       Araxeus
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

class Store {
    /*
    Example structure of store:
    store = {
        videoId: {
            display: 'none',
            timestamp: Date.now()
        }
    };
    */
    store = {};

    constructor() {
        this.store = GM_getValue('store', {});
        this.#cleanOldEntries();
    }

    #get() {
        return this.store[this.videoId];
    }

    #set(display) {
        if (display === 'none') {
            this.store[this.videoId] = { display, timestamp: Date.now() };
        } else {
            delete this.store[this.videoId];
        }
        this.#save();
    }

    #save() {
        GM_setValue('store', this.store);
    }

    #cleanOldEntries() {
        const now = Date.now();
        for (const videoId in this.store) {
            if (now - this.store[videoId].timestamp > ONE_MONTH) {
                delete this.store[videoId];
            }
        }
        this.#save();
    }

    get videoId() {
        return new URL(window.location.href).searchParams.get('v');
    }

    get display() {
        return this.#get()?.display || '';
    }

    set display(value) {
        this.#set(value);
    }

    toggleDisplay() {
        this.display = this.display === 'none' ? '' : 'none';
    }
}

const store = new Store();

const toggleElDisplay = elSelector => {
    const el = document.querySelector(elSelector);
    if (!el) {
        console.warn(`Element not found: ${elSelector}`);
        return;
    }
    el.style.display = store.display;
};

const toggleElDisplays = () => {
    toggleElDisplay('div.ytp-progress-bar-container');
    toggleElDisplay('span.ytp-time-duration');
    toggleElDisplay('span.ytp-time-separator');
};

if (store.display) {
    toggleElDisplays();
}

window.addEventListener('yt-navigate-finish', toggleElDisplays);

GM_registerMenuCommand(
    'Show/Hide Progress',
    () => {
        store.toggleDisplay();
        toggleElDisplays();
    },
    {
        clickedFrame: true,
    },
);
