// Taken from here: https://github.com/igrigorik/hackernews-button
(function(a){"use strict";var b,c=a.document,d=function(a,b){if(c.getElementsByClassName)return c.getElementsByClassName(a);var d=[],e=c.getElementsByTagName(b||"*"),f,g;a=" "+a+" ";for(f=0;f<e.length;f++)g=e[f],(" "+(g.className||g.getAttribute("class"))+" ").indexOf(a)>-1&&d.push(g);return d},e=d("hn-share-button","a"),f=a.addEventListener?"addEventListener":"attachEvent",g=a[f],h=f==="attachEvent"?"onmessage":"message",i="http://hnbutton.appspot.com/";a._gaq||(a._gaq=[]),g(h,function(b){b.origin===i&&(b.data==="vote"||b.data==="submit")&&a._gaq.push(["_trackSocial","Hacker News",b.data])},!1);for(b=e.length-1;b>=0;b--){var j=e[b],k=j.getAttribute("data-title")||c.title,l=j.getAttribute("data-url")||a.location.href,m=c.createElement("iframe");m.src=i+"button?title="+encodeURIComponent(k)+"&url="+encodeURIComponent(l),m.scrolling="auto",m.frameBorder="0",m.width="75px",m.height="20px",m.className="hn-share-iframe",j.parentNode.insertBefore(m,j),j.parentNode.removeChild(j)}})(window)