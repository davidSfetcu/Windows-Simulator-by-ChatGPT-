// scripts/messaging.js — try server SMS endpoint if available, fallback to local storage
(function(){
  const Storage = parent.WP.Storage;
  const threadsEl = document.getElementById('threads');
  async function sendToServer(to, text){
    try{
      const res = await fetch('http://localhost:3000/api/sms/send', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({to, body:text}) });
      if(res.ok){ const j=await res.json(); parent.WP.notify('SMS sent (via server)', to); return true; }
    }catch(e){ console.warn('Server SMS failed', e); }
    return false;
  }
  function load(){ const threads = Storage.get('messages',[]); threadsEl.innerHTML=''; threads.forEach(t=>{ const d=document.createElement('div'); d.className='thread'; d.innerHTML=`<strong>${t.with}</strong><div>${t.last}</div>`; d.onclick=()=>openThread(t.with); threadsEl.appendChild(d); }); }
  async function openThread(withWho){ const txt = prompt('Type message to '+withWho); if(txt){ await send(withWho,txt);} }
  async function send(withWho, text){ let threads = Storage.get('messages',[]); let t = threads.find(x=>x.with===withWho); if(!t){ t={with:withWho, msgs:[]}; threads.unshift(t);} t.msgs.push({out:true, text, when:new Date().toLocaleString()}); t.last = text; Storage.set('messages',threads); // try server
    const ok = await sendToServer(withWho, text);
    if(ok) parent.WP.notify('Message sent via server', 'To: '+withWho); else parent.WP.notify('Message saved locally', 'To: '+withWho);
    load(); }
  document.getElementById('new').onclick = ()=>{ const to = prompt('To:'); if(!to) return; const txt = prompt('Message:'); if(txt) send(to,txt); }
  load();
})();
