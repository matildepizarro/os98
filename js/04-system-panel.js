/* =====================================================================
   MODULO: js/04-system-panel.js
   PROPIEDADES DE PANTALLA + MEZCLADOR DE VOLUMEN + WINAMP (reproductor real) + AYUDA
   ===================================================================== */

/* =====================================================================
   NUEVO: PROPIEDADES DE PANTALLA (fondo de escritorio interactivo)
   ===================================================================== */
const wallpapers = [
  { name:'Teal clásico', bg:'#008080', dot:'#00767a' },
  { name:'Kawaii rosa', bg:'#ffb3d9', dot:'#ff8fc7' },
  { name:'Lavanda Y2K', bg:'#b8a6e8', dot:'#9c86d8' },
  { name:'Menta 2000', bg:'#a6e8c9', dot:'#7fd8ab' },
  { name:'Cielo dulce', bg:'#a6d8ff', dot:'#7fc0ff' },
  { name:'Sunset disco', bg:'#ffcf8f', dot:'#ffb35c' },
];
function openDisplayProperties(){
  ctxMenu.style.display = 'none';
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '20%'; win.style.left = '30%'; win.style.width = '300px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Propiedades de pantalla</div>
      <div class="winbtns"><button class="dpClose">✕</button></div>
    </div>
    <div class="win-body">
      <div style="font-size:12px;">Fondo de escritorio:</div>
      <div class="previewscreen" id="dpPreview">MATILDE_OS</div>
      <div class="swatchrow" id="dpSwatches"></div>
      <div style="text-align:right;"><button class="btn98 dpClose">Aceptar</button></div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 160);
  const sw = win.querySelector('#dpSwatches');
  const prev = win.querySelector('#dpPreview');
  wallpapers.forEach(w=>{
    const s = document.createElement('div');
    s.className = 'swatch'; s.style.background = w.bg; s.title = w.name;
    s.addEventListener('click', ()=>{
      prev.style.background = w.bg;
      prev.style.backgroundImage = `radial-gradient(${w.dot} 1px, transparent 1px)`;
      document.body.style.background = w.bg;
      document.body.style.backgroundImage = `radial-gradient(${w.dot} 1px, transparent 1px)`;
    });
    sw.appendChild(s);
  });
  win.querySelectorAll('.dpClose').forEach(b=> b.addEventListener('click', ()=> win.remove()));
}

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

/* =====================================================================
   NUEVO: WINAMP — REPRODUCTOR REAL con las canciones de Matilde Pizarro
   Los archivos .mp3 deben estar en la MISMA carpeta que este .html
   ===================================================================== */
const winampPlaylist = [
  { title: 'Texturas', artist: 'Matilde Pizarro', src: 'assets/audio/TEXTURAS.mp3' },
  { title: 'Vuelo',    artist: 'Matilde Pizarro', src: 'assets/audio/VUELO.mp3' }
];
let winampAudio = null;
let winampIndex = 0;
let winampWinRef = null;

function wa_formatTime(s){
  if(!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s/60), sec = Math.floor(s%60);
  return m + ':' + (sec<10?'0':'') + sec;
}

function openWinampPlayer(){
  if(winampWinRef){
    winampWinRef.style.zIndex = ++dragZ;
    return;
  }
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.id = 'winampWin';
  win.style.top = '20%'; win.style.left = '40%';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Winamp — MATILDE PIZARRO</div>
      <div class="winbtns"><button class="waClose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="wa-screen">
        <span class="wa-title" id="waTitle">Sin pista</span>
        <span class="wa-time" id="waTime">0:00 / 0:00</span>
      </div>
      <div class="wa-progress" id="waProgress"><div class="wa-progress-fill" id="waProgressFill"></div></div>
      <div class="wa-controls">
        <button id="waPrev" title="Anterior">⏮</button>
        <button id="waPlay" title="Reproducir/Pausar">▶</button>
        <button id="waStop" title="Detener">⏹</button>
        <button id="waNext" title="Siguiente">⏭</button>
      </div>
      <div class="wa-vol">🔊<input type="range" id="waVolume" min="0" max="100" value="80"></div>
      <div class="wa-playlist" id="waPlaylist"></div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  winampWinRef = win;

  if(!winampAudio){
    winampAudio = new Audio();
    winampAudio.volume = 0.8;
  }

  const titleEl = win.querySelector('#waTitle');
  const timeEl = win.querySelector('#waTime');
  const progressEl = win.querySelector('#waProgress');
  const progressFill = win.querySelector('#waProgressFill');
  const playBtn = win.querySelector('#waPlay');
  const volumeEl = win.querySelector('#waVolume');
  const playlistEl = win.querySelector('#waPlaylist');

  function renderPlaylist(){
    playlistEl.innerHTML = '';
    winampPlaylist.forEach((t, i)=>{
      const row = document.createElement('div');
      row.textContent = (i+1) + '. ' + t.artist + ' — ' + t.title;
      if(i === winampIndex) row.classList.add('playing');
      row.addEventListener('click', ()=> loadTrack(i, true));
      playlistEl.appendChild(row);
    });
  }

  function loadTrack(i, autoplay){
    winampIndex = (i + winampPlaylist.length) % winampPlaylist.length;
    const t = winampPlaylist[winampIndex];
    winampAudio.src = t.src;
    titleEl.textContent = t.artist + ' — ' + t.title;
    renderPlaylist();
    if(autoplay){
      winampAudio.play().catch(()=>{});
    }
  }

  function updatePlayBtn(){
    playBtn.textContent = (winampAudio && !winampAudio.paused) ? '⏸' : '▶';
  }

  playBtn.addEventListener('click', ()=>{
    if(!winampAudio.src){ loadTrack(winampIndex, true); return; }
    if(winampAudio.paused){ winampAudio.play().catch(()=>{}); }
    else { winampAudio.pause(); }
  });
  win.querySelector('#waStop').addEventListener('click', ()=>{
    winampAudio.pause();
    winampAudio.currentTime = 0;
    updatePlayBtn();
  });
  win.querySelector('#waPrev').addEventListener('click', ()=> loadTrack(winampIndex - 1, true));
  win.querySelector('#waNext').addEventListener('click', ()=> loadTrack(winampIndex + 1, true));

  progressEl.addEventListener('click', (e)=>{
    if(!winampAudio.duration) return;
    const rect = progressEl.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    winampAudio.currentTime = ratio * winampAudio.duration;
  });

  volumeEl.addEventListener('input', ()=>{
    winampAudio.volume = volumeEl.value / 100;
  });
  volumeEl.value = Math.round(winampAudio.volume * 100);

  winampAudio.addEventListener('play', updatePlayBtn);
  winampAudio.addEventListener('pause', updatePlayBtn);
  winampAudio.addEventListener('timeupdate', ()=>{
    if(!document.body.contains(win)) return;
    const dur = winampAudio.duration || 0;
    const cur = winampAudio.currentTime || 0;
    progressFill.style.width = (dur ? (cur/dur*100) : 0) + '%';
    timeEl.textContent = wa_formatTime(cur) + ' / ' + wa_formatTime(dur);
  });
  winampAudio.addEventListener('ended', ()=> loadTrack(winampIndex + 1, true));

  if(winampAudio.src){
    titleEl.textContent = winampPlaylist[winampIndex].artist + ' — ' + winampPlaylist[winampIndex].title;
    updatePlayBtn();
  }
  renderPlaylist();

  win.querySelector('.waClose').addEventListener('click', ()=>{
    win.remove();
    winampWinRef = null;
  });
}

/* =====================================================================
   NUEVO: VENTANA DE AYUDA KAWAII
   ===================================================================== */
function openHelpWindow(){
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '18%'; win.style.left = '38%'; win.style.width = '320px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Ayuda de MATILDE_OS</div>
      <div class="winbtns"><button class="hpClose">✕</button></div>
    </div>
    <div class="win-body" style="font-size:12px; line-height:1.6;">
      <b>Sobre este sistema</b><br>
      MATILDE_OS está dedicado al catálogo y las fechas de <b>Matilde Pizarro</b>.<br><br>
      · Selecciona una fecha en el menú "Publicitando" del cartel principal para activar los mensajes de esa función.<br>
      · Haz doble clic en los archivos 📄 del escritorio para abrir la letra completa; esa canción queda marcada como en reproducción.<br>
      · El ícono que brilla es la canción que está abierta en este momento.<br>
      · Click derecho en el escritorio para más opciones.<br>
      · Puedes arrastrar cualquier ventana desde su barra de título.
      <div style="text-align:right; margin-top:10px;"><button class="btn98 hpClose">Cerrar</button></div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 160);
  win.querySelectorAll('.hpClose').forEach(b=>b.addEventListener('click', ()=> win.remove()));
}
document.getElementById('trayHelp').addEventListener('click', openHelpWindow);
document.getElementById('smHelp').addEventListener('click', ()=>{ openHelpWindow(); startOpen=false; startMenu.style.display='none'; startBtn.classList.remove('active'); });
document.getElementById('smProps').addEventListener('click', ()=>{ openDisplayProperties(); startOpen=false; startMenu.style.display='none'; startBtn.classList.remove('active'); });
document.getElementById('trayHeart').addEventListener('click', ()=>{
  const statusMsg = currentShow
    ? `Estado del sistema: <b>OK</b>.<br>Función publicitada: Matilde Pizarro — ${currentShow.fecha} — ${currentShow.lugar}.`
    : 'Estado del sistema: <b>OK</b>.<br>No hay ninguna función seleccionada para publicitar.';
  spawnErrorPopupCustom('Estado del sistema', statusMsg);
});
