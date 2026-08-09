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
