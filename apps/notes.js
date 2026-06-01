// apps/notes.js — uses localStorage for persistence
(function(){
  const KEY='sim_notes_v1';
  const ta = document.getElementById('note');
  const btnSave = document.getElementById('save');
  const btnClear = document.getElementById('clear');

  function load(){
    const v = localStorage.getItem(KEY)||'';
    ta.value = v;
  }
  function save(){
    localStorage.setItem(KEY, ta.value);
    alert('Saved locally');
  }
  function clearNote(){
    if(confirm('Clear notes?')){ ta.value=''; localStorage.removeItem(KEY); }
  }
  btnSave.addEventListener('click',save);
  btnClear.addEventListener('click',clearNote);
  load();
})();
