// ==UserScript==
// @name         YouTube Edit Current Time
// @namespace    https://github.com/Araxeus/userscripts
// @version      1.1.0
// @updateURL    https://github.com/Araxeus/userscripts/raw/main/browser_snippets/youtube_edit_time.user.js
// @downloadURL  https://github.com/Araxeus/userscripts/raw/main/browser_snippets/youtube_edit_time.user.js
// @description  Click current time to edit it
// @author       Araxeus
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// ==/UserScript==

// Keeps the control bar visible while editing, overriding YouTube's autohide
document.head.append(
    Object.assign(document.createElement('style'), {
        textContent:
            '.ytp-editing-time .ytp-chrome-bottom{opacity:1!important;visibility:visible!important}',
    }),
);

// Parses 'H:MM:SS', 'M:SS' or plain seconds; returns null if invalid
const parseTime = str =>
    /^\d+(:\d+){0,2}$/.test(str.trim())
        ? str.trim().split(':').reduce((total, part) => total * 60 + Number(part), 0)
        : null;

// Capture-phase delegated click: survives YouTube SPA navigation, and runs before the
// time wrapper's own click handler (which toggles elapsed/remaining), which we swallow.
// An <input> replaces the span while editing, so YouTube's per-tick text updates can't clobber the input.
document.addEventListener('click', e => {
    if (!e.target.closest?.('.ytp-time-wrapper')) return;
    e.stopPropagation();

    const span = e.target.closest('.ytp-time-current');
    if (!span) return;

    const input = document.createElement('input');
    input.value = span.textContent;
    // Same width/font as the span so the surrounding "/ duration" doesn't shift
    input.style.cssText = `width:${span.offsetWidth}px;font:inherit;color:inherit;background:#fff3;border:0;outline:0;padding:0;margin:0;border-radius:2px`;

    input.addEventListener('keydown', e => {
        e.stopPropagation(); // keep YouTube hotkeys (space, arrows, f...) from firing
        if (e.key === 'Enter') {
            const seconds = parseTime(input.value);
            if (seconds !== null) document.querySelector('video').currentTime = seconds;
        }
        if (e.key === 'Enter' || e.key === 'Escape') input.blur();
    });
    const player = span.closest('.html5-video-player');
    input.addEventListener('blur', () => {
        input.remove();
        span.hidden = false;
        player.classList.remove('ytp-editing-time');
    });

    player.classList.add('ytp-editing-time');
    span.hidden = true;
    span.after(input);
    input.select();
    input.focus();
}, true);
