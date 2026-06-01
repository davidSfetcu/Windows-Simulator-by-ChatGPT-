// mail.js — simple local mailboxes
(function(){
  const Storage = parent.WP.Storage; const folders = document.getElementById('folders');
  function render(){ const boxes = Storage.get('mailboxes', {Inbox:[],Sent:[]}); folders.innerHTML=''; Object.keys(boxes).forEach(box=>{ const div=document.createElement('div'); div.innerHTML=`<h4>${box} (${boxes[box].length})</h4>`; boxes[box].forEach((m,i)=>{ const it=document.createElement('div'); it.className='mail'; it.innerHTML=`<strong>${m.from||'me'}</strong> <div>${m.subject}</div>`; it.onclick=()=> view(box,i); div.appendChild(it); }); folders.appendChild(div); }); }
  function view(box,i){ const boxes = Storage.get('mailboxes', {Inbox:[],Sent:[]}); const m=boxes[box][i]; alert(`From: ${m.from}\nSubject: ${m.subject}\n\n${m.body}`); }
  document.getElementById('compose').onclick = ()=>{ const to=prompt('To'); if(!to) return; const subj=prompt('Subject'); const body=prompt('Body'); const boxes = Storage.get('mailboxes', {Inbox:[],Sent:[]}); boxes.Sent.push({to,subject:subj,body,when:new Date().toLocaleString()}); Storage.set('mailboxes',boxes); parent.WP.notify('Mail sent', to); render(); };
  render();
})();
