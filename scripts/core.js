// core.js — app registry, storage helper, app loader, notifications, live tile updater
const WP = (function(){
  const APPS = [
    {id:'phone', name:'Phone', icon:'icons/app-phone.svg', entry:'apps/phone/index.html'},
    {id:'messages', name:'Messaging', icon:'icons/app-messages.svg', entry:'apps/messaging/index.html'},
    {id:'people', name:'People', icon:'icons/app-people.svg', entry:'apps/people/index.html'},
    {id:'camera', name:'Camera', icon:'icons/app-camera.svg', entry:'apps/camera/index.html'},
    {id:'photos', name:'Photos', icon:'icons/app-photos.svg', entry:'apps/photos/index.html'},
    {id:'internet', name:'Internet', icon:'icons/app-internet.svg', entry:'apps/internet/index.html'},
    {id:'calendar', name:'Calendar', icon:'icons/app-calendar.svg', entry:'apps/calendar/index.html'},
    {id:'music', name:'Music', icon:'icons/app-music.svg', entry:'apps/music/index.html'},
    {id:'store', name:'Store', icon:'icons/app-store.svg', entry:'apps/store/index.html'},
    {id:'settings', name:'Settings', icon:'icons/app-settings.svg', entry:'apps/settings/index.html'},
    {id:'clock', name:'Clock', icon:'icons/app-clock.svg', entry:'apps/clock/index.html'}
  ];

  // Simple storage wrapper (localStorage-based) — can be extended to IndexedDB
  const Storage = {
    get(key, fallback){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; }catch(e){return fallback} },
    set(key,val){ localStorage.setItem(key,JSON.stringify(val)); }
  };

  function renderTiles(){
    const grid = document.getElementById('tile-grid'); grid.innerHTML='';
    APPS.forEach(app=>{
      const t = document.createElement('div'); t.className='tile'; t.id='tile-'+app.id;
      t.innerHTML = `<div class="icon"><img src="${app.icon}" alt="${app.name}" width="36"/></div><div class="label">${app.name}</div>`;
      t.addEventListener('click',()=>openApp(app));
      grid.appendChild(t);
    });
  }

  function openApp(app){
    const frame = document.getElementById('app-frame');
    const iframe = document.getElementById('app-iframe');
    const title = document.getElementById('app-title');
    frame.classList.remove('hidden');
    title.textContent = app.name;
    iframe.src = app.entry;
    document.getElementById('app-back').onclick = ()=>{ closeApp(); };
  }

  function closeApp(){
    const frame = document.getElementById('app-frame');
    const iframe = document.getElementById('app-iframe');
    frame.classList.add('hidden'); iframe.src='about:blank';
  }

  function setupDock(){
    document.getElementById('btn-phone').addEventListener('click',()=> document.getElementById('tile-phone')?.click());
    document.getElementById('btn-messages').addEventListener('click',()=> document.getElementById('tile-messages')?.click());
    document.getElementById('btn-people').addEventListener('click',()=> document.getElementById('tile-people')?.click());
    document.getElementById('btn-internet').addEventListener('click',()=> document.getElementById('tile-internet')?.click());
  }

  function setupLockScreen(){
    const lock = document.getElementById('lock-screen');
    const unlock = document.getElementById('unlock-btn');
    unlock.onclick = ()=> lock.classList.add('hidden');
    setInterval(()=>{
      const d=new Date(); document.getElementById('lock-time').textContent = d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    },1000);
    // start locked first time
    if(!Storage.get('sim_unlocked',false)){
      lock.classList.remove('hidden');
      Storage.set('sim_unlocked',true);
    }
  }

  // Simulated incoming call for demo/testing
  function simulateIncomingCall(from='Unknown'){
    // create notification and launch Phone app with special query
    alert('Incoming call from '+from+' (simulated)');
    openApp(APPS.find(a=>a.id==='phone'));
    // postMessage to iframe to show incoming state
    setTimeout(()=>{
      const iframe = document.getElementById('app-iframe');
      iframe.contentWindow.postMessage({type:'incoming-call',from},'*');
    },500);
  }

  // Live tile updater (simple): rotate tile labels with sample data
  function startLiveTiles(){
    setInterval(()=>{
      const msgs = Storage.get('messages',[]);
      const tile = document.getElementById('tile-messages');
      if(tile){ tile.querySelector('.label').textContent = msgs.length? ('Msgs: '+msgs.length):'Messaging'; }
      const photos = Storage.get('photos',[]);
      const pt = document.getElementById('tile-photos'); if(pt){ pt.querySelector('.label').textContent = photos.length? ('Photos: '+photos.length):'Photos'; }
    },3000);
  }

  function init(){ renderTiles(); setupDock(); setupLockScreen(); startLiveTiles();
    // keyboard shortcut to simulate incoming call
    window.addEventListener('keydown',e=>{ if(e.key==='c'){ simulateIncomingCall('Test Caller'); } });
  }

  return { init, Storage, simulateIncomingCall };
})();

window.addEventListener('load',()=>{ WP.init(); });
