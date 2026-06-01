// scripts/mail.js — send via server mail endpoint when available
(function(){
  const Storage = parent.WP.Storage; const folders = document.getElementById('folders');
  function render(){ const boxes = Storage.get('mailboxes', {Inbox:[],Sent:[]}); folders.innerHTML=''; Object.keys(boxes).forEach(box=>{ const div=document.createElement('div'); div.innerHTML=`<h4>${box} (${boxes[box].length})</h4>`; boxes[box].forEach((m,i)=>{ const it=document.createElement('div'); it.className='mail'; it.innerHTML=`<strong>${m.from||'me'}</strong> <div>${m.subject}</div>`; it.onclick=()=> view(box,i); div.appendChild(it); }); folders.appendChild(div); }); }
  function view(box,i){ const boxes = Storage.get('mailboxes', {Inbox:[],Sent:[]}); const m=boxes[box][i]; alert(`From: ${m.from}\nSubject: ${m.subject}\n\n${m.body}`); }
  async function sendViaServer(to, subject, body){ try{ const res = await fetch('http://localhost:3000/api/mail/send', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({to, subject, body}) }); if(res.ok){ parent.WP.notify('Mail sent via server', to); return true;} }catch(e){ console.warn('Mail server send failed', e); } return false; }
  document.getElementById('compose').onclick = async ()=>{ const to=prompt('To'); if(!to) return; const subj=prompt('Subject'); const body=prompt('Body'); const boxes = Storage.get('mailboxes', {Inbox:[],Sent:[]}); boxes.Sent.push({to,subject:subj,body,when:new Date().toLocaleString()}); Storage.set('mailboxes',boxes); const ok = await sendViaServer(to,subj,body); if(!ok) parent.WP.notify('Mail saved locally', to); render(); };
  render();
})();
