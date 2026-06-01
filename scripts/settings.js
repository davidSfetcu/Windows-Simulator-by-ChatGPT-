// settings.js
(function(){ const Storage=parent.WP.Storage; const theme=document.getElementById('theme'); const lock=document.getElementById('lock'); theme.value='blue'; lock.checked = Storage.get('startLocked',true); theme.onchange=()=>{ /* for demo */ alert('Theme change simulated'); }; lock.onchange=()=>{ Storage.set('startLocked',lock.checked); alert('Setting saved'); }; })();
