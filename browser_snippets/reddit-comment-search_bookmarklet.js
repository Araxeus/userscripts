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

window.reddit_comment_search ??= {
    loadingIcon:
        '<svg xmlns="http://www.w3.org/2000/svg" style="margin:auto" width="35" height="35" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block"><circle cx="50" cy="50" r="32" stroke-width="8" stroke="#ff4500" stroke-dasharray="50.265 50.265" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.5s" keyTimes="0;1" values="0 50 50;360 50 50"/></circle></svg>',
    ogIconHtml: document.querySelector('[aria-label="Home"] svg').outerHTML,
    regex: (regex = /\d more repl(?:y|ies)/),
    search: [],
    currentIndex: 0,

    // is called after expandAll(), put whatever you want to find here
    afterExpand() {
        const searchTerm = document.querySelector(
            'input#header-search-bar'
        )?.value;
        searchTerm ? this.searchFor(searchTerm) : this.searchForLinks();
        //window.reddit_comment_search.searchForLinks();
        //window.reddit_comment_search.searchFor('reddit');
        console.log(
            `Done searching (${window.reddit_comment_search.search.length} results found)`
        );

        if (!window.reddit_comment_search.rcsLoaded) {
            document.addEventListener(
                'keydown',
                ({ code }) => {
                    if (code === 'Period') this.next();
                    if (code === 'Comma') this.previous();
                },
                { passive: true }
            );
            this.rcsLoaded = true;
        }

        document.querySelector('[aria-label="Home"] svg').outerHTML =
            this.ogIconHtml;
    },

    beforeExpand() {
        document.querySelector('[aria-label="Home"] svg').outerHTML =
            this.loadingIcon;
        this.totalExpanded = 0;
        this.expandAll();
    },

    // ********** Expand All Comments **********
    expandAll() {
        let expanded = 0;
        let hadUnexpended = false;
        [...document.querySelectorAll('p')].forEach(p => {
            if (window.reddit_comment_search.regex.test(p.innerText)) {
                p.click();
                expanded++;
                hadUnexpended = true;
            }
        });
        window.reddit_comment_search.totalExpanded += expanded;
        if (hadUnexpended) {
            console.log(`expanded ${expanded} times, going for another pass`);
            setTimeout(window.reddit_comment_search.expandAll, 3500);
        } else {
            console.log(
                `Done expanding comments (${window.reddit_comment_search.totalExpanded} times)`
            );
            window.reddit_comment_search.afterExpand();
        }
    },

    // ********** Search **********

    // Find all comments that contains a link
    searchForLinks() {
        this.search = [
            ...document.querySelectorAll('[data-testid="comment"]')
        ].filter(c => c.querySelector('a'));
        this.currentIndex = 0;
        this.next();
    },

    // Find all comments that contains "term" (ignore case)
    searchFor(term = '') {
        this.search = [
            ...document.querySelectorAll('[data-testid="comment"]')
        ].filter(c => c.textContent.toLowerCase().includes(term.toLowerCase()));
        this.currentIndex = 0;
        this.next();
    },

    // scroll into next result
    next() {
        if (this.currentIndex < this.search.length && this.currentIndex >= 0) {
            console.log(`(${this.currentIndex + 1}/${this.search.length})`);
            this.scrollToNode(this.search[this.currentIndex]);
            this.currentIndex++;
        } else {
            console.log('No more results');
        }
    },

    // scroll into last result
    previous() {
        this.currentIndex = Math.max(0, this.currentIndex - 2);
        this.next();
    },

    // Utility to scroll to a node
    scrollToNode(node) {
        if (!node) return;
        window.scrollTo({
            top: node.getBoundingClientRect().top + window.pageYOffset - 88,
            behavior: 'smooth'
        });
    }
};

window.reddit_comment_search.beforeExpand();

// made using https://www.digitalocean.com/community/tools/minify
javascript: (() => {})();
javascript: (() => {window.reddit_comment_search??={loadingIcon:'<svg xmlns="http://www.w3.org/2000/svg" style="margin:auto" width="35" height="35" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block"><circle cx="50" cy="50" r="32" stroke-width="8" stroke="#ff4500" stroke-dasharray="50.265 50.265" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.5s" keyTimes="0;1" values="0 50 50;360 50 50"/></circle></svg>',ogIconHtml:document.querySelector('[aria-label="Home"] svg').outerHTML,regex:regex=/\d more repl(?:y|ies)/,search:[],currentIndex:0,afterExpand(){const e=document.querySelector("input#header-search-bar")?.value;e?this.searchFor(e):this.searchForLinks(),console.log(`Done searching (${window.reddit_comment_search.search.length} results found)`),window.reddit_comment_search.rcsLoaded||(document.addEventListener("keydown",(({code:e})=>{"Period"===e&&this.next(),"Comma"===e&&this.previous()}),{passive:!0}),this.rcsLoaded=!0),document.querySelector('[aria-label="Home"] svg').outerHTML=this.ogIconHtml},beforeExpand(){document.querySelector('[aria-label="Home"] svg').outerHTML=this.loadingIcon,this.totalExpanded=0,this.expandAll()},expandAll(){let e=0,t=!1;[...document.querySelectorAll("p")].forEach((o=>{window.reddit_comment_search.regex.test(o.innerText)&&(o.click(),e++,t=!0)})),window.reddit_comment_search.totalExpanded+=e,t?(console.log(`expanded ${e} times, going for another pass`),setTimeout(window.reddit_comment_search.expandAll,3500)):(console.log(`Done expanding comments (${window.reddit_comment_search.totalExpanded} times)`),window.reddit_comment_search.afterExpand())},searchForLinks(){this.search=[...document.querySelectorAll('[data-testid="comment"]')].filter((e=>e.querySelector("a"))),this.currentIndex=0,this.next()},searchFor(e=""){this.search=[...document.querySelectorAll('[data-testid="comment"]')].filter((t=>t.textContent.toLowerCase().includes(e.toLowerCase()))),this.currentIndex=0,this.next()},next(){this.currentIndex<this.search.length&&this.currentIndex>=0?(console.log(`(${this.currentIndex+1}/${this.search.length})`),this.scrollToNode(this.search[this.currentIndex]),this.currentIndex++):console.log("No more results")},previous(){this.currentIndex=Math.max(0,this.currentIndex-2),this.next()},scrollToNode(e){e&&window.scrollTo({top:e.getBoundingClientRect().top+window.pageYOffset-88,behavior:"smooth"})}},window.reddit_comment_search.beforeExpand()})();

