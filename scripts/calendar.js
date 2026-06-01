// calendar.js — simple events list
(function(){ const Storage=parent.WP.Storage; const el=document.getElementById('events'); function render(){ const e=Storage.get('events',[]); el.innerHTML=''; e.forEach((it,idx)=>{ const d=document.createElement('div'); d.className='event'; d.textContent=`${it.when} — ${it.title}`; d.onclick=()=>{ if(confirm('Delete?')){ e.splice(idx,1); Storage.set('events',e); render(); } }; el.appendChild(d); }); }
  document.getElementById('add').onclick=()=>{ const title=prompt('Title'); const when=prompt('When'); if(title && when){ const e=Storage.get('events',[]); e.unshift({title,when}); Storage.set('events',e); render(); } };
  render();
})();
