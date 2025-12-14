// hashlink.js
// https://github.com/bgrins/devtools-snippets
// Click on an element to print out the closest hash link.

(() => {
    const findClosestLinkableElement = (node) => {
        while (node != null) {
            if (node.tagName === 'A' && node.name) return node.name;
            if (node.id) return node.id;
            node = node.parentNode;
        }
        return null;
    };

    const logHashlink = (e) => {
        document.removeEventListener('mousedown', logHashlink, true);
        e.preventDefault();
        e.stopPropagation();

        const id = findClosestLinkableElement(e.target);
        const url = `${window.location.origin}${window.location.pathname}${window.location.search}`;

        console.group('Hashlink');
        console.log('Clicked on ', e.target);

        if (id === null) {
            alert(`No ID Found - closest anchor: ${url}`);
        } else {
            console.log('Closest linkable element: ', e.target);
            alert(`${url}#${id}`);
        }
        console.groupEnd('Hashlink');
    };

    const stopClickEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.removeEventListener('click', stopClickEvent, true);
    };

    document.addEventListener('mousedown', logHashlink, true);
    document.addEventListener('click', stopClickEvent, true);

    return "hashlink: Click on an element to log it's closest hash link";
})();
