javascript: (()=>{})()

(()=>{
    document.querySelector('pre').childNodes.forEach(n => {
        n.nodeName === '#text'
            ? (n.data = n.data?.slice(n.data.lastIndexOf(' ')) ?? '\n')
            : (n.textContent = decodeURIComponent(n.href).match(/[^\/]+\/?$/)); //.split('/').at(-1));
    });
    (document.querySelector('a').textContent = '../');
})()

javascript: (()=>{document.querySelector('pre').childNodes.forEach(e=>{e.nodeName==='#text'?e.data=e.data?.slice(e.data.lastIndexOf(' '))??'\n':e.textContent=decodeURIComponent(e.href).match(/[^\/]+\/?$/)}),document.querySelector('a').textContent='../';})()

// no text change below

(()=>{
    document.querySelector('pre')?.childNodes.forEach(n => {
        n.nodeName !== '#text' && n.href && (n.textContent = decodeURIComponent(n.href).match(/[^\/]+\/?$/)); //.split('/').at(-1));
    });
    (document.querySelector('a')?.textContent = '../');
})()

javascript: (()=>{document.querySelector("pre").childNodes.forEach(n=>{n.nodeName!=="#text"&&(n.textContent=decodeURIComponent(n.href).match(/[^\/]+\/?$/))});document.querySelector("a").textContent="../";})()


