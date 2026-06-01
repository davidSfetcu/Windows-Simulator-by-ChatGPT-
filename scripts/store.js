// store.js — simulated marketplace; install creates a tile locally
(function(){ const Storage=parent.WP.Storage; const list=document.getElementById('list'); const items=[{id:'notes',name:'Notes (extra)'},{id:'weather',name:'Weather (mock)'}]; function render(){ list.innerHTML=''; items.forEach(it=>{ const d=document.createElement('div'); d.className='app'; d.innerHTML=`<strong>${it.name}</strong> <button data-id="${it.id}">Install</button>`; d.querySelector('button').onclick=()=>install(it); list.appendChild(d); }); }
  function install(it){ alert('Installing '+it.name+' (simulated)'); const apps = Storage.get('installed',[]); apps.push(it); Storage.set('installed',apps); }
  render();
})();
