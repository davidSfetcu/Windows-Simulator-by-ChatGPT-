// phone.js — simple dialer and call log
const PhoneApp = (function(){
  const keypad='123456789*0#'.split('');
  const display = document.getElementById('display');
  const dial = document.getElementById('dial');
  const logList = document.getElementById('loglist');
  let cur='';
  function renderKeypad(){ keypad.forEach(k=>{ const d=document.createElement('div'); d.className='digit'; d.textContent=k; d.onclick=()=>{ cur+=k; display.textContent=cur; }; dial.appendChild(d); }) }
  function loadLog(){ const log = (parent.WP?parent.WP.Storage.get('callLog',[]): JSON.parse(localStorage.getItem('callLog')||'[]')); logList.innerHTML=''; log.forEach(it=>{ const li=document.createElement('li'); li.textContent = `${it.when} - ${it.type} - ${it.number}`; logList.appendChild(li); }); }
  function saveCall(type,number){ const log = parent.WP.Storage.get('callLog',[]); log.unshift({when:new Date().toLocaleString(),type,number}); parent.WP.Storage.set('callLog',log); loadLog(); }
  document.getElementById('call').onclick = ()=>{ if(!cur) return alert('Enter number'); saveCall('outgoing',cur); alert('Calling '+cur+' (simulated)'); };
  document.getElementById('hang').onclick = ()=>{ cur=''; display.textContent=''; };
  document.getElementById('simulate').onclick = ()=>{ window.parent.postMessage({type:'simulate-incoming'},'*'); };
  window.addEventListener('message',ev=>{ if(ev.data && ev.data.type==='incoming-call'){ // show incoming UI
      const from = ev.data.from||'Unknown'; saveCall('incoming',from); alert('Incoming call from '+from+' (simulated)'); }
  });
  renderKeypad(); loadLog();
})();
