// camera.js — capture photo via getUserMedia and save to Storage
(async function(){
  const video = document.getElementById('preview'); const canvas=document.getElementById('c'); const snap=document.getElementById('snap'); const Storage = parent.WP.Storage;
  try{
    const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false}); video.srcObject=stream;
  }catch(e){ alert('Camera access requires HTTPS or localhost'); }
  snap.onclick = ()=>{ canvas.width=video.videoWidth; canvas.height=video.videoHeight; const ctx=canvas.getContext('2d'); ctx.drawImage(video,0,0); const data = canvas.toDataURL('image/png'); const photos = Storage.get('photos',[]); photos.unshift({data,when:new Date().toLocaleString()}); Storage.set('photos',photos); alert('Photo saved to Photos'); };
})();
