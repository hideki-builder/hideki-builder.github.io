(()=>{
  const key='hideki-builder-appearance',modes=['system','light','dark'];
  let mode='system';try{const saved=localStorage.getItem(key);if(modes.includes(saved))mode=saved}catch{}
  const button=document.querySelector('.appearance');
  const apply=()=>{if(mode==='system')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=mode;if(button)button.textContent='Appearance: '+mode[0].toUpperCase()+mode.slice(1)};
  apply();if(!button)return;button.hidden=false;
  button.addEventListener('click',()=>{mode=modes[(modes.indexOf(mode)+1)%modes.length];apply();try{if(mode==='system')localStorage.removeItem(key);else localStorage.setItem(key,mode)}catch{}});
})();
