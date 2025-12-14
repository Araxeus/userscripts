// ==UserScript==
// @name        Imgur Alternative Frontend Redirector inside script
// @namespace   Violentmonkey Scripts
// @match       https://rimgo.pussthecat.org/*
// @match       https://rimgo.bloat.cat/*
// @match       https://rimgo.catsarch.com/*
// @match       https://imgur.artemislena.eu/*
// @match       https://rimgo.lunar.icu/*
// @match       https://rimgo.reallyaweso.me/*
// @match       https://imgur.fsky.io/*
// @match       https://rimgo.totaldarkness.net/*
// @match       https://imgur.010032.xyz/*
// @match       https://i.habedieeh.re/*
// @match       https://ri.nadeko.net/*
// @match       https://rimgo.projectsegfau.lt/*
// @match       https://rimgo.eu.projectsegfau.lt/*
// @match       https://rimgo.us.projectsegfau.lt/*
// @match       https://rimgo.in.projectsegfau.lt/*
// @match       https://rimgo.fascinated.cc/*
// @match       https://rimgo.nohost.network/*
// @match       https://rimgo.drgns.space/*
// @match       https://rimgo.quantenzitrone.eu/*
// @match       https://rimgo.frylo.net/*
// @match       https://rimgo.ducks.party/*
// @match       https://rmgur.com/*
// @match       https://rimgo.privacyredirect.com/*
// @match       https://rimgo.darkness.services/*
// @match       https://rimgo.aketawi.space/*
// @match       https://imgur.nerdvpn.de/*
// @match       https://rimgo.thebunny.zone/*
// @match       https://r.opnxng.com/*
// @match       https://imgur.sudovanilla.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 6/22/2025, 8:26:43 PM
// ==/UserScript==
const images = document.querySelectorAll('img[loading]');
if (images.length === 1) {
    window.location.assign(images[0].src);
}
//window.location.assign(document.querySelector('img[loading]').src);
