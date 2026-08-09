/* =====================================================================
   NUEVO: PROGRESO DE "INSTALACIÓN" DE CODEC KAWAII
   ===================================================================== */
const installMessages = [
  'kawaii-core.dll',
  'sparkle-shader.sys',
  'winamp-groove.drv',
  'lunar-reverb.dll',
  'tocata.sys',
  'discoball_98.vxd',
];
function spawnInstallProgress(){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  const name = installMessages[Math.floor(Math.random()*installMessages.length)];
  const win = document.createElement('div');
  win.className = 'win errwin';
  win.style.width = '300px';
  win.style.top = (22 + Math.random()*30) + '%';
  win.style.left = (14 + Math.random()*30) + '%';
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Instalando componentes</div>
    </div>
    <div class="win-body">
      <div style="font-size:12px; margin-bottom:8px;">Copiando <b>${name}</b>...</div>
      <div class="progressOuter"><div class="progressInner" id="pinner"></div></div>
      <div style="font-size:10px; text-align:right; margin-top:4px;" id="pctText">0%</div>
    </div>
  `;
  document.body.appendChild(win);
  const bar = win.querySelector('#pinner');
  const pctText = win.querySelector('#pctText');
  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem';
  taskChip.textContent = '📀 Instalando ' + name;
  errWrap.appendChild(taskChip);
  let pct = 0;
  const iv = setInterval(()=>{
    pct += 8 + Math.random()*14;
    if(pct >= 100){ pct = 100; clearInterval(iv); setTimeout(close, 500); }
    bar.style.width = pct + '%';
    pctText.textContent = Math.floor(pct) + '%';
  }, 220);
  function close(){ win.remove(); taskChip.remove(); openHeavyPopups--; }
  setTimeout(close, 6000);
}
