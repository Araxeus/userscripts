// ==UserScript==
// @name         YouTube Edit Current Time
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.0.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/youtube_edit_time.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/youtube_edit_time.user.js
// @description  Click current time to edit it
// @author       Araxeus
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// ==/UserScript==

let activeObserver = null;
let isEditing = false;
let cachedTime = '';

// Converts 'HH:MM:SS' or 'MM:SS' string into total raw seconds
function parseTimestampToSeconds(timeStr) {
    // Strip any accidental negative signs or weird characters typed by user
    const cleanStr = timeStr.replace(/[^0-9:]/g, '');
    const parts = cleanStr.split(':').map(Number);

    if (parts.some(Number.isNaN)) return null;

    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1]; // MM:SS
    } else if (parts.length === 1) {
        return parts[0]; // Raw seconds
    }
    return null;
}

function initTimestampEditor() {
    const timeSpan = document.querySelector('.ytp-time-current');
    const videoElement = document.querySelector('video');

    // Guard clause: Ensure both the DOM node and video hook exist, and prevent double initialization
    if (!timeSpan || !videoElement || timeSpan.dataset.seekInitialized === 'true') return;
    timeSpan.dataset.seekInitialized = 'true';

    // Style the element to give the user visual feedback that it's an interactive input
    timeSpan.style.cursor = 'text';
    timeSpan.style.padding = '0 4px';
    timeSpan.style.borderRadius = '3px';
    timeSpan.style.transition = 'background-color 0.2s, border 0.2s';

    // Make element editable natively
    timeSpan.contentEditable = 'true';

    // Intercept YouTube's mutation loop while user edits text
    activeObserver = new MutationObserver(() => {
        if (isEditing && timeSpan.innerText !== cachedTime) {
            activeObserver.disconnect();
            // Retain user's current input text string against YouTube's background ticker updates
            timeSpan.innerText = cachedTime;
            startObserving(timeSpan);
        }
    });

    function startObserving(target) {
        activeObserver.observe(target, { childList: true, characterData: true, subtree: true });
    }
    startObserving(timeSpan);

    // Capture keystroke buffer during user edit cycle
    timeSpan.addEventListener('input', () => {
        if (isEditing) {
            cachedTime = timeSpan.innerText;
        }
    });

    // Freeze YouTube loop on element focus
    timeSpan.addEventListener('focus', () => {
        isEditing = true;
        cachedTime = timeSpan.innerText;
        timeSpan.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        timeSpan.style.outline = '1px solid #fff';
    });

    // Listen for execution commands (Enter/Escape)
    timeSpan.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();

            const targetSeconds = parseTimestampToSeconds(cachedTime);
            if (targetSeconds !== null && !Number.isNaN(targetSeconds)) {
                videoElement.currentTime = targetSeconds;
            }

            isEditing = false;
            timeSpan.blur();
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            isEditing = false;
            timeSpan.blur();
        }
    });

    // Restore clean player styling on blur state
    timeSpan.addEventListener('blur', () => {
        timeSpan.style.backgroundColor = '';
        timeSpan.style.outline = '';
        // Delay disabling editing flag slightly to let internal execution loops clear safely
        setTimeout(() => {
            isEditing = false;
        }, 150);
    });
}

// Re-verify engine initialization safely across SPAs (Single Page Applications) like YouTube page navigation
const targetNode = document.body;
const config = { childList: true, subtree: true };

const pageObserver = new MutationObserver(() => {
    initTimestampEditor();
});

pageObserver.observe(targetNode, config);
initTimestampEditor();
