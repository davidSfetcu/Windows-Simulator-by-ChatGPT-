// photos.js — upload and show photos from Storage
(function(){
  const Storage = parent.WP.Storage; const grid = document.getElementById('grid'); const file = document.getElementById('file');
  function render(){ const photos = Storage.get('photos',[]); grid.innerHTML=''; photos.forEach((p,i)=>{ const img=document.createElement('img'); img.src=p.data; img.onclick=()=>{ if(confirm('Delete photo?')){ photos.splice(i,1); Storage.set('photos',photos); render(); } }; grid.appendChild(img); }); }
  file.onchange = ()=>{ const f=file.files[0]; const r=new FileReader(); r.onload=()=>{ const photos=Storage.get('photos',[]); photos.unshift({data:r.result,when:new Date().toLocaleString()}); Storage.set('photos',photos); render(); }; r.readAsDataURL(f); };
  render();
})();
