/* =====================================================================
   NUEVO: POPUP GENÉRICO REUTILIZABLE (para about / estado / etc.)
   ===================================================================== */
function spawnErrorPopupCustom(title, msg){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  const win = document.createElement('div');
  win.className = 'win errwin';
  win.style.top = (18 + Math.random()*30) + '%';
  win.style.left = (10 + Math.random()*40) + '%';
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> ${title}</div>
      <div class="winbtns"><button class="errclose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="errbody">
        <div class="icoerr" style="color:#c2185b; border-color:#c2185b;">✿</div>
        <div class="errtext">${msg}</div>
      </div>
      <div class="errbtnrow"><button class="btn98 errok">Aceptar</button></div>
    </div>
  `;
  document.body.appendChild(win);
  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem blink';
  taskChip.textContent = '✿ ' + title;
  errWrap.appendChild(taskChip);
  function close(){ win.remove(); taskChip.remove(); openHeavyPopups--; }
  win.querySelector('.errclose').addEventListener('click', close);
  win.querySelector('.errok').addEventListener('click', close);
  setTimeout(close, 9000);
}
