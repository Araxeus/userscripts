function sortElements(parentSelector, selector, ascendingOrder = false, isNumeric = true) {
    // 2 - Detemine the selector
    const selector = element => Number(element.querySelector(compareSelector)?.innerText.split(' ')[0].replace(',', '') ?? 0);

    const parentElement = document.querySelector(parentSelector);//elements[0].parentNode;

    const elements = [...parentElement.childNodes];//[...document.querySelectorAll('.tag-card')];

    const collator = new Intl.Collator(undefined, { numeric: isNumeric, sensitivity: 'base' });

    elements
        .sort((elementA, elementB) => {
            const [firstElement, secondElement] = ascendingOrder ? [elementA, elementB] : [elementB, elementA];
            return collator.compare(selector(firstElement), selector(secondElement))
        })
        .forEach(element => parentElement.appendChild(element));
}

sortElements('.plugins-container', element => Number(element.querySelector('div.u-center-text p.u-muted')?.innerText.split(' ')[0].replace(',', '') ?? 0));
