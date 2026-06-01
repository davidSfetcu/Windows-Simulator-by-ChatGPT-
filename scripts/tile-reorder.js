// tile-reorder.js — client-side drag & drop for tiles; saves order to Storage via WP.Storage
(function(){
  function enable(){
    const grid = document.getElementById('tile-grid'); if(!grid) return;
    let dragging = null;
    grid.addEventListener('dragstart', e=>{
      const t = e.target.closest('.tile'); if(!t) return; dragging = t; e.dataTransfer.setData('text/plain', t.id);
      t.classList.add('dragging');
    });
    grid.addEventListener('dragover', e=>{ e.preventDefault(); const over = e.target.closest('.tile'); if(!over || !dragging || over === dragging) return; const rect = over.getBoundingClientRect(); const after = (e.clientY - rect.top) > rect.height/2; if(after) over.parentNode.insertBefore(dragging, over.nextSibling); else over.parentNode.insertBefore(dragging, over);
    });
    grid.addEventListener('dragend', e=>{ if(dragging){ dragging.classList.remove('dragging'); saveOrder(); dragging = null; }});
    // make tiles draggable
    function makeDraggable(){ document.querySelectorAll('.tile').forEach(t=>{ t.setAttribute('draggable', 'true'); }); }
    // save order to Storage
    function saveOrder(){ const ids = Array.from(document.querySelectorAll('#tile-grid .tile')).map(t=>t.id.replace('tile-','')); window.WP.Storage.set('tileOrder', ids); window.dispatchEvent(new CustomEvent('tile-order-changed',{detail:ids})); }
    // watch for tiles re-render
    const obs = new MutationObserver(()=>{ makeDraggable(); }); obs.observe(document.getElementById('tile-grid'), {childList:true, subtree:false});
    makeDraggable();
  }
  window.addEventListener('load', enable);
})();
