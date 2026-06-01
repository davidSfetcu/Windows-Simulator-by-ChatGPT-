// clock.js
(function(){ const el=document.getElementById('time'); function tick(){ const d=new Date(); el.textContent=d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); } tick(); setInterval(tick,1000); })();
