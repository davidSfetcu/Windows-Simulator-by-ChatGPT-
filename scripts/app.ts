// TypeScript source: scripts/app.ts
// Simple app manager for the Windows Phone Simulator

interface AppDef{
  id:string;
  name:string;
  icon:string;
  url:string; // local path to app html or handler
}

const apps:AppDef[] = [
  {id:'clock', name:'Clock', icon:'icons/app-clock.svg', url:'apps/clock.html'},
  {id:'notes', name:'Notes', icon:'icons/app-notes.svg', url:'apps/notes.html'},
  {id:'settings', name:'Settings', icon:'icons/app-settings.svg', url:'apps/settings.html'}
];

function createGrid(){
  const grid = document.getElementById('grid')!;
  apps.forEach(a=>{
    const tile = document.createElement('div');
    tile.className='tile';
    tile.dataset.app = a.id;
    tile.innerHTML = `<img src="${a.icon}" alt="${a.name}"><span>${a.name}</span>`;
    tile.addEventListener('click',()=> openApp(a));
    grid.appendChild(tile);
  })
}

function openApp(app:AppDef){
  const win = document.getElementById('app-window')!;
  const content = document.getElementById('app-content')!;
  win.classList.remove('hidden');
  // load app via fetch and inject
  fetch(app.url).then(r=>r.text()).then(html=>{
    content.innerHTML = html;
    // if app script is present, load it
    const scriptUrl = app.url.replace('.html','.js');
    const s = document.createElement('script');
    s.src = scriptUrl;
    s.defer = true;
    content.appendChild(s);
  })
}

function closeApp(){
  const win = document.getElementById('app-window')!;
  const content = document.getElementById('app-content')!;
  win.classList.add('hidden');
  content.innerHTML='';
}

window.addEventListener('load',()=>{
  createGrid();
  document.getElementById('btn-close')!.addEventListener('click',closeApp);
})
