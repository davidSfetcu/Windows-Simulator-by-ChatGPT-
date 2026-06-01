// scripts/phone.js — improved phone using parent.WP.notify
const PhoneApp = (function(){
  const keypad='123456789*0#'.split('');
  const display = document.getElementById('display');
  const dial = document.getElementById('dial');
  const logList = document.getElementById('loglist');
  let cur='';
  function renderKeypad(){ keypad.forEach(k=>{ const d=document.createElement('div'); d.className='digit'; d.textContent=k; d.onclick=()=>{ cur+=k; display.textContent=cur; }; dial.appendChild(d); }) }
  function loadLog(){ const log = (parent.WP?parent.WP.Storage.get('callLog',[]): JSON.parse(localStorage.getItem('callLog')||'[]')); logList.innerHTML=''; log.forEach(it=>{ const li=document.createElement('li'); li.textContent = `${it.when} - ${it.type} - ${it.number}`; logList.appendChild(li); }); }
  function saveCall(type,number){ const log = parent.WP.Storage.get('callLog',[]); log.unshift({when:new Date().toLocaleString(),type,number}); parent.WP.Storage.set('callLog',log); loadLog(); }
  document.getElementById('call').onclick = ()=>{ if(!cur) return alert('Enter number'); saveCall('outgoing',cur); parent.WP.notify('Calling', cur); setTimeout(()=>{ parent.WP.notify('Call ended', cur); }, 2500); };
  document.getElementById('hang').onclick = ()=>{ cur=''; display.textContent=''; parent.WP.notify('Call', 'Hung up'); };
  document.getElementById('simulate').onclick = ()=>{ window.parent.postMessage({type:'simulate-incoming', from:'Sim User'},'*'); };
  window.addEventListener('message',ev=>{ if(ev.data && ev.data.type==='incoming-call'){ const from = ev.data.from||'Unknown'; saveCall('incoming',from); parent.WP.notify('Incoming call', from, 6000); alert('Incoming call from '+from+' (simulated)'); }
  });
  renderKeypad(); loadLog();
})();
