// scripts/weather.js — prefer server proxy if available (http://localhost:3000/api/weather?q=...)
(async function(){
  const card = document.getElementById('card'); const refresh = document.getElementById('refresh');
  async function showMock(){ const data = {loc:'Sim City',temp:'18°C',cond:'Partly Cloudy',when:new Date().toLocaleTimeString()}; card.innerHTML = `<strong>${data.loc}</strong><div>${data.temp} — ${data.cond}</div><div class="when">${data.when}</div>`; }
  async function fetchReal(){ try{ const res = await fetch('http://localhost:3000/api/weather?q=London'); if(res.ok){ const j = await res.json(); const data = {loc:j.name,temp:j.main.temp+'°C',cond:j.weather[0].description,when:new Date().toLocaleTimeString()}; card.innerHTML = `<strong>${data.loc}</strong><div>${data.temp} — ${data.cond}</div><div class="when">${data.when}</div>`; return; } }catch(e){ console.warn('Weather proxy not available', e); }
    // fallback to mock or direct OpenWeather if user stored a key in Storage
    const key = parent.WP.Storage.get('weatherApiKey',''); if(key){ try{ const r = await fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid='+key+'&units=metric'); const j=await r.json(); const data={loc:j.name,temp:j.main.temp+'°C',cond:j.weather[0].description,when:new Date().toLocaleTimeString()}; card.innerHTML=`<strong>${data.loc}</strong><div>${data.temp} — ${data.cond}</div><div class="when">${data.when}</div>`; return;}catch(e){} }
    showMock();
  }
  refresh.onclick = fetchReal; fetchReal();
})();
