// notifications.js — persists notifications and exposes a small API
(function(){
  // Patch WP.notify to store notifications in Storage and show them in a center
  if(!window.WP) return;
  const oldNotify = window.WP.notify;
  window.WP.notify = function(title, body, timeout){
    // store notification
    try{
      const list = window.WP.Storage.get('notifications', []) || [];
      list.unshift({title, body, when: new Date().toLocaleString()});
      // keep only recent 50
      if(list.length>50) list.length=50;
      window.WP.Storage.set('notifications', list);
    }catch(e){ console.warn('Notify store failed', e); }
    // update notification center UI
    const center = document.getElementById('notification-center');
    if(center){ center.classList.remove('hidden'); center.innerHTML = listToHtml(window.WP.Storage.get('notifications',[])); }
    // call original toast
    oldNotify(title, body, timeout);
  }
  function listToHtml(list){ if(!list || !list.length) return '<div class="none">No notifications</div>'; return list.map(n=>`<div class="notify"><strong>${n.title}</strong><div>${n.body}</div><div class="when">${n.when}</div></div>`).join(''); }
  // expose a method to open the center
  window.WP.openNotifications = function(){ const center=document.getElementById('notification-center'); if(center){ center.classList.toggle('hidden'); center.innerHTML = listToHtml(window.WP.Storage.get('notifications',[])); }};
})();
