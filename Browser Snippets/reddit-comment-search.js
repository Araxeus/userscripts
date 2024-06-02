/*
 * easiest way to use this is add the file above as a bookmarklet, then go to a reddit thread, input something in the search bar and launch the bookmarklet
 * Navigate search results by pressing `.`(Period/Dot) for next or `,`(Comma) for previous. (sorry, arrow keys refuse to work with smooth scroll)
 * ADVANCED:
 * modify afterExpand() to search for your query (comment/delete searchForLinks(), uncomment searchFor and replace 'reddit' with your query)
 * Paste the contents of this file into devtools (by default it expand all comments and then search for links)
 * Call next() / previous() to navigate search results
 * Call searchFor("TERM") to search for TERM
 * Call searchForLinks() to search for all links
 */

// is called after expandAll(), put whatever you want to find here
function afterExpand() {
    const searchTerm = document.querySelector('input#header-search-bar')?.value;
    searchTerm ? searchFor(searchTerm) : searchForLinks();
    //searchForLinks();
    //searchFor('reddit');
    console.log(`Done searching (${search.length} results found)`);

    if (!document.rcsLoaded) {
        document.addEventListener(
            'keydown',
            ({ code }) => {
                if (code === 'Period') next();
                if (code === 'Comma') previous();
            },
            { passive: true }
        );
        document.rcsLoaded = true;
    }

    document.querySelector('[aria-label="Home"] svg').outerHTML = ogIconHtml;
}

function beforeExpand() {
    document.querySelector('[aria-label="Home"] svg').outerHTML = loadingIcon;
    totalExpanded = 0;
    expandAll();
}

const loadingIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" style="margin:auto" width="35" height="35" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block"><circle cx="50" cy="50" r="32" stroke-width="8" stroke="#ff4500" stroke-dasharray="50.265 50.265" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.5s" keyTimes="0;1" values="0 50 50;360 50 50"/></circle></svg>';
const ogIconHtml = document.querySelector('[aria-label="Home"] svg').outerHTML;

// Utility to scroll to a node
function scrollToNode(node) {
    if (!node) return;
    window.scrollTo({
        top: node.getBoundingClientRect().top + window.pageYOffset - 88,
        behavior: 'smooth'
    });
}

// ********** Expand All Comments **********
const regex = /\d more repl(?:y|ies)/;
let totalExpanded = 0;

function expandAll() {
    let expanded = 0;
    let hadUnexpended = false;
    [...document.querySelectorAll('p')].forEach(p => {
        if (regex.test(p.innerText)) {
            p.click();
            expanded++;
            hadUnexpended = true;
        }
    });
    totalExpanded += expanded;
    if (hadUnexpended) {
        console.log(`expanded ${expanded} times, going for another pass`);
        setTimeout(expandAll, 3500);
    } else {
        console.log(`Done expanding comments (${totalExpanded} times)`);
        afterExpand();
    }
}

// ********** Search **********
let search = [];
let currentIndex = 0;

// Find all comments that contains a link
const searchForLinks = () => {
    search = [...document.querySelectorAll('[data-testid="comment"]')].filter(
        c => c.querySelector('a')
    );
    currentIndex = 0;
    next();
};

// Find all comments that contains "term" (ignore case)
const searchFor = (term = '') => {
    search = [...document.querySelectorAll('[data-testid="comment"]')].filter(
        c => c.textContent.toLowerCase().includes(term.toLowerCase())
    );
    currentIndex = 0;
    next();
};

// scroll into next result
const next = () => {
    if (currentIndex < search.length && currentIndex >= 0) {
        console.log(`(${currentIndex + 1}/${search.length})`);
        scrollToNode(search[currentIndex]);
        currentIndex++;
    } else {
        console.log('No more results');
    }
};

// scroll into last result
const previous = () => {
    currentIndex = Math.max(0, currentIndex - 2);
    next();
};

beforeExpand();
