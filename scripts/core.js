// scripts/core.js — upgraded core: IndexedDB-backed storage with in-memory cache, notifications, multitasking hooks
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

  const DB_NAME = 'wp8_sim_db_v1';
  const STORE_NAME = 'kv';
  let _db = null;
  const CACHE = {}; // in-memory cache to allow synchronous reads for iframe apps

  function idbOpen(){
    return new Promise((resolve, reject)=>{
      if(_db) return resolve(_db);
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = ()=>{ const db = req.result; if(!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME); };
      req.onsuccess = ()=>{ _db = req.result; resolve(_db); };
      req.onerror = ()=> reject(req.error);
    });
  }
  function idbGet(key){
    return idbOpen().then(db=>{
      return new Promise((res,rej)=>{
        const tx = db.transaction(STORE_NAME,'readonly');
        const st = tx.objectStore(STORE_NAME);
        const r = st.get(key);
        r.onsuccess = ()=> res(r.result);
        r.onerror = ()=> rej(r.error);
      });
    });
  }
  function idbSet(key,val){
    return idbOpen().then(db=>{
      return new Promise((res,rej)=>{
        const tx = db.transaction(STORE_NAME,'readwrite');
        const st = tx.objectStore(STORE_NAME);
        const r = st.put(val,key);
        r.onsuccess = ()=> res();
        r.onerror = ()=> rej(r.error);
      });
    });
  }
  function idbGetAllToCache(){
    return idbOpen().then(db=>{
      return new Promise((res,rej)=>{
        const tx = db.transaction(STORE_NAME,'readonly');
        const st = tx.objectStore(STORE_NAME);
        const r = st.openCursor();
        r.onerror = ()=> rej(r.error);
        r.onsuccess = ()=>{
          const cursor = r.result;
          if(cursor){ CACHE[cursor.key] = cursor.value; cursor.continue(); }
          else res();
        };
      });
    });
  }

  // Storage API: synchronous reads from CACHE, async persistence to IndexedDB
  const Storage = {
    get(key, fallback){
      return (key in CACHE)? CACHE[key] : fallback;
    },
    set(key,val){
      CACHE[key] = val;
      idbSet(key,val).catch(err=>{ console.warn('IDB set failed',err); try{ localStorage.setItem(key,JSON.stringify(val)); }catch(e){} });
    }
  };

  // Notifications (toast) inside shell
  function showToast(title, body, timeout=4000){
    const existing = document.getElementById('wp-toast');
    if(existing) existing.remove();
    const t = document.createElement('div'); t.id='wp-toast';
    t.style.position='fixed'; t.style.right='12px'; t.style.bottom='12px'; t.style.background='rgba(0,0,0,0.7)'; t.style.color='#fff'; t.style.padding='12px 16px'; t.style.borderRadius='8px'; t.style.zIndex=9999; t.style.boxShadow='0 6px 20px rgba(0,0,0,0.6)';
    t.innerHTML = `<strong style="display:block;margin-bottom:4px">${title}</strong><div>${body}</div>`;
    document.body.appendChild(t);
    setTimeout(()=>{ t.style.transition='opacity 300ms'; t.style.opacity='0'; setTimeout(()=>t.remove(),350); }, timeout);
  }

  function renderTiles(){
    const grid = document.getElementById('tile-grid'); grid.innerHTML='';
    APPS.forEach(app=>{
      const t = document.createElement('div'); t.className='tile'; t.id='tile-'+app.id;
      t.innerHTML = `<div class="icon"><img src="${app.icon}" alt="${app.name}" width="36"/></div><div class="label">${app.name}</div>`;
      t.addEventListener('click',()=>openApp(app));
      grid.appendChild(t);
    });
    // installed apps from storage
    const installed = Storage.get('installed',[]);
    if(installed && installed.length){ installed.forEach(it=>{ // create simple tiles for installed items
      if(!document.getElementById('tile-'+it.id)){
        const t = document.createElement('div'); t.className='tile'; t.id='tile-'+it.id; t.innerHTML=`<div class="icon"></div><div class="label">${it.name}</div>`; t.onclick=()=> alert(it.name+' — installed app (placeholder)'); document.getElementById('tile-grid').appendChild(t);
      }
    }); }
  }

  function openApp(app){
    const frame = document.getElementById('app-frame');
    const iframe = document.getElementById('app-iframe');
    const title = document.getElementById('app-title');
    frame.classList.remove('hidden');
    title.textContent = app.name;
    // remember last opened app
    Storage.set('lastOpen', app.id);
    iframe.src = app.entry;
    // give iframe some context after load
    iframe.onload = ()=>{
      try{ iframe.contentWindow.postMessage({type:'app-resume', id:app.id, state: Storage.get('appState_'+app.id, {})}, '*'); }catch(e){}
    };
    document.getElementById('app-back').onclick = ()=>{ closeApp(app); };
  }

  function closeApp(app){
    const frame = document.getElementById('app-frame');
    const iframe = document.getElementById('app-iframe');
    // request app to save state via postMessage; allow 300ms for response
    try{ iframe.contentWindow.postMessage({type:'app-suspend-request', id: app && app.id}, '*'); }catch(e){}
    setTimeout(()=>{ frame.classList.add('hidden'); iframe.src='about:blank'; }, 300);
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
    if(Storage.get('startLocked', true)){
      lock.classList.remove('hidden');
    }
  }

  function simulateIncomingCall(from='Unknown'){
    // notification + open phone app and notify iframe
    showToast('Incoming call', from, 6000);
    openApp(APPS.find(a=>a.id==='phone'));
    setTimeout(()=>{
      const iframe = document.getElementById('app-iframe');
      iframe.contentWindow.postMessage({type:'incoming-call',from},'*');
    },500);
  }

  function startLiveTiles(){
    setInterval(()=>{
      const msgs = Storage.get('messages',[]);
      const tile = document.getElementById('tile-messages');
      if(tile){ tile.querySelector('.label').textContent = msgs.length? ('Msgs: '+msgs.length):'Messaging'; }
      const photos = Storage.get('photos',[]);
      const pt = document.getElementById('tile-photos'); if(pt){ pt.querySelector('.label').textContent = photos.length? ('Photos: '+photos.length):'Photos'; }
      const calls = Storage.get('callLog',[]);
      const tcall = document.getElementById('tile-phone'); if(tcall){ tcall.querySelector('.label').textContent = calls.length? ('Calls: '+calls.length):'Phone'; }
    },3000);
  }

  // message handling from iframes (app lifecycle, notifications, save-state)
  window.addEventListener('message', ev=>{
    const d = ev.data; if(!d || typeof d !== 'object') return;
    if(d.type==='notify'){ showToast(d.title||'Notification', d.body||'', d.timeout||4000); }
    if(d.type==='save-state' && d.appId){ Storage.set('appState_'+d.appId, d.state||{}); }
    if(d.type==='simulate-incoming'){ simulateIncomingCall(d.from||'Unknown'); }
    if(d.type==='request-storage'){ // iframe asking for storage snapshot
      ev.source.postMessage({type:'storage-snapshot', snapshot: {}}, '*');
    }
  });

  async function init(){
    // try to initialize persistent DB and load to cache; fallback to localStorage if IDB fails
    try{
      await idbOpen();
      await idbGetAllToCache();
    }catch(e){
      // failure: try to populate CACHE from localStorage
      try{
        for(let i=0;i<localStorage.length;i++){ const k = localStorage.key(i); try{ CACHE[k]=JSON.parse(localStorage.getItem(k)); }catch(e){} }
      }catch(e){}
    }
    renderTiles(); setupDock(); setupLockScreen(); startLiveTiles();
    // keyboard shortcut to simulate incoming call
    window.addEventListener('keydown',e=>{ if(e.key==='c'){ simulateIncomingCall('Test Caller'); } });
  }

  return { init, Storage, simulateIncomingCall, notify:showToast };
})();

window.addEventListener('load', ()=>{ WP.init(); });
