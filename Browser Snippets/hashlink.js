// hashlink.js
// https://github.com/bgrins/devtools-snippets
// Click on an element to print out the closest hash link.

(() => {
    const logHashlink = e => {
        document.removeEventListener('mousedown', logHashlink, true);

        var node = e.target;
        var id = null;
        while (node != null) {
            if (node.tagName === 'A' && node.name) {
                id = node.name;
                break;
            }

            if (node.id) {
                id = node.id;
                break;
            }

            node = node.parentNode;
        }

        e.preventDefault();
        e.stopPropagation();

        var URL =
            window.location.origin +
            window.location.pathname +
            window.location.search;

        console.group('Hashlink');
        console.log('Clicked on ', e.target);
        if (id === null) {
            alert('No ID Found - closest anchor: ' + URL);
        } else {
            console.log('Closest linkable element: ', node);
            alert(URL + '#' + id);
        }
        console.groupEnd('Hashlink');
    };

    const stopClickEvent = e => {
        e.preventDefault();
        e.stopPropagation();

        document.removeEventListener('click', stopClickEvent, true);
    };

    document.addEventListener('mousedown', logHashlink, true);
    document.addEventListener('click', stopClickEvent, true);

    return "hashlink: Click on an element to log it's closest hash link";
})();
