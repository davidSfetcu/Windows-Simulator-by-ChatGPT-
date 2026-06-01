// weather.js — mock weather + optional real API if key stored under 'weatherApiKey'
(async function(){
  const card = document.getElementById('card'); const refresh = document.getElementById('refresh');
  async function showMock(){ const data = {loc:'Sim City',temp:'18°C',cond:'Partly Cloudy',when:new Date().toLocaleTimeString()}; card.innerHTML = `<strong>${data.loc}</strong><div>${data.temp} — ${data.cond}</div><div class="when">${data.when}</div>`; }
  async function fetchReal(){ const key = parent.WP.Storage.get('weatherApiKey', ''); if(!key) return showMock(); try{ const res = await fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid='+key+'&units=metric'); const j = await res.json(); const data = {loc:j.name,temp:j.main.temp+'°C',cond:j.weather[0].description,when:new Date().toLocaleTimeString()}; card.innerHTML = `<strong>${data.loc}</strong><div>${data.temp} — ${data.cond}</div><div class="when">${data.when}</div>`; }catch(e){ showMock(); } }
  refresh.onclick = fetchReal; fetchReal();
})();
