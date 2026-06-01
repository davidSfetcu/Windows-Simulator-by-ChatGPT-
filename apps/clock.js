// apps/clock.js
(function(){
  const el = document.getElementById('clock');
  function tick(){
    const d=new Date();
    el.textContent = d.toLocaleTimeString();
  }
  tick();
  setInterval(tick,1000);
})();
