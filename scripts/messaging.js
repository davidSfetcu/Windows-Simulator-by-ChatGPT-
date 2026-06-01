// messaging.js — threads and messages using Storage
(function(){
  const Storage = parent.WP.Storage;
  const threadsEl = document.getElementById('threads');
  function load(){ const threads = Storage.get('messages',[]); threadsEl.innerHTML=''; threads.forEach(t=>{ const d=document.createElement('div'); d.className='thread'; d.innerHTML=`<strong>${t.with}</strong><div>${t.last}</div>`; d.onclick=()=>openThread(t.with); threadsEl.appendChild(d); }); }
  function openThread(withWho){ const txt = prompt('Type message to '+withWho); if(txt){ send(withWho,txt);} }
  function send(withWho, text){ let threads = Storage.get('messages',[]); let t = threads.find(x=>x.with===withWho); if(!t){ t={with:withWho, msgs:[]}; threads.unshift(t);} t.msgs.push({out:true, text, when:new Date().toLocaleString()}); t.last = text; Storage.set('messages',threads); load(); }
  document.getElementById('new').onclick = ()=>{ const to = prompt('To:'); if(!to) return; const txt = prompt('Message:'); if(txt) send(to,txt); }
  load();
})();
