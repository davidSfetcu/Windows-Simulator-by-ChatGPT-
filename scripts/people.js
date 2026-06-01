// scripts/people.js — add notification on contact add
(function(){
  const Storage = parent.WP.Storage; const list = document.getElementById('list');
  function load(){ const c = Storage.get('contacts',[]); list.innerHTML=''; c.forEach((p,idx)=>{ const d=document.createElement('div'); d.className='item'; d.innerHTML=`<strong>${p.name}</strong><div>${p.phone||''}</div>`; d.onclick=()=>edit(idx); list.appendChild(d); }); }
  function edit(i){ const c = Storage.get('contacts',[]); const p = c[i]; const name = prompt('Name',p.name); if(!name) return; const phone = prompt('Phone',p.phone||''); p.name=name; p.phone=phone; Storage.set('contacts',c); parent.WP.notify('Contact updated', name); load(); }
  function add(){ const c = Storage.get('contacts',[]); const name = prompt('Name'); if(!name) return; const phone = prompt('Phone'); c.push({name,phone}); Storage.set('contacts',c); parent.WP.notify('Contact added', name); load(); }
  document.getElementById('add').onclick=add; load();
})();
