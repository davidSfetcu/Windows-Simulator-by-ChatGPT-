// internet.js
(function(){ const url = document.getElementById('url'); const go = document.getElementById('go'); const frame=document.getElementById('frame'); go.onclick=()=>{ let u=url.value.trim(); if(!/^https?:\/\//.test(u)) u='http://'+u; frame.src=u; }; })();
