// calculator.js — simple calculator logic
(function(){
  const keysOrder = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'];
  const keys = document.getElementById('keys'); const display = document.getElementById('display');
  keysOrder.forEach(k=>{ const b=document.createElement('button'); b.textContent=k; b.onclick=()=> onKey(k); keys.appendChild(b); });
  let expr='';
  function onKey(k){ if(k==='='){ try{ const v=eval(expr); display.textContent = v; expr = ''+v; }catch(e){ display.textContent='Error'; expr=''; } return; }
    if(k==='C'){ expr=''; display.textContent='0'; return; }
    expr += k; display.textContent = expr;
  }
})();
