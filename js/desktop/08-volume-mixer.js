/* =====================================================================
   NUEVO: MEZCLADOR DE VOLUMEN (decorativo, estilo bandeja Win98)
   ===================================================================== */
function openVolumeMixer(){
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '55%'; win.style.left = '55%'; win.style.width = '260px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Control de volumen</div>
      <div class="winbtns"><button class="vmClose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="mixerRow">
        <div class="mixerCol"><input type="range" class="mixerSlider" min="0" max="100" value="88"><span>Principal</span></div>
        <div class="mixerCol"><input type="range" class="mixerSlider" min="0" max="100" value="95"><span>Winamp</span></div>
        <div class="mixerCol"><input type="range" class="mixerSlider" min="0" max="100" value="70"><span>Micrófono</span></div>
        <div class="mixerCol"><input type="range" class="mixerSlider" min="0" max="100" value="100"><span>Aplausos</span></div>
      </div>
      <div style="font-size:10px; text-align:center; color:#404040;">*Mezclador decorativo, no controla audio real.</div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 160);
  win.querySelector('.vmClose').addEventListener('click', ()=> win.remove());
}
document.getElementById('trayVolume').addEventListener('click', openVolumeMixer);
document.getElementById('smMixer').addEventListener('click', ()=>{ openVolumeMixer(); startOpen=false; startMenu.style.display='none'; startBtn.classList.remove('active'); });
