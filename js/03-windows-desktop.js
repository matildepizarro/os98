/* =====================================================================
   MODULO: js/03-windows-desktop.js
   SISTEMA DE VENTANAS ARRASTRABLES + ÍCONOS DE ESCRITORIO + "REPRODUCIENDO AHORA" + MENÚ CONTEXTUAL
   ===================================================================== */

/* =====================================================================
   NUEVO: SISTEMA DE VENTANAS ARRASTRABLES (draggable, estilo Win98 real)
   ===================================================================== */
let dragZ = 210;
function makeDraggable(winEl, handleEl){
  handleEl = handleEl || winEl.querySelector('.titlebar');
  if(!handleEl) return;
  let offX=0, offY=0, dragging=false;

  function toPixelPos(){
    const r = winEl.getBoundingClientRect();
    winEl.style.position = 'fixed';
    winEl.style.left = r.left + 'px';
    winEl.style.top = r.top + 'px';
    winEl.style.right = 'auto'; winEl.style.margin = '0';
  }

  function onDown(e){
    const isTouch = e.type === 'touchstart';
    const point = isTouch ? e.touches[0] : e;
    // no arrastrar si el clic fue en un botón de la barra de título
    if(point.target && point.target.closest && point.target.closest('.winbtns')) return;
    toPixelPos();
    dragging = true;
    winEl.classList.add('dragging');
    winEl.style.zIndex = ++dragZ;
    const r = winEl.getBoundingClientRect();
    offX = point.clientX - r.left;
    offY = point.clientY - r.top;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, {passive:false});
    document.addEventListener('touchend', onUp);
  }
  function onMove(e){
    if(!dragging) return;
    if(e.type === 'touchmove') e.preventDefault();
    const point = e.type === 'touchmove' ? e.touches[0] : e;
    let nx = point.clientX - offX;
    let ny = point.clientY - offY;
    nx = Math.max(-40, Math.min(window.innerWidth-60, nx));
    ny = Math.max(0, Math.min(window.innerHeight-40, ny));
    winEl.style.left = nx + 'px';
    winEl.style.top = ny + 'px';
  }
  function onUp(){
    dragging = false;
    winEl.classList.remove('dragging');
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
  }
  handleEl.addEventListener('mousedown', onDown);
  handleEl.addEventListener('touchstart', onDown, {passive:true});
}

/* ---- Redimensionado libre: agrega un handle en la esquina inferior derecha
        de cualquier ventana y permite arrastrarlo para ajustar su tamaño. ---- */
function makeResizable(winEl, minW, minH){
  if(!winEl || winEl.querySelector(':scope > .resize-handle')) return;
  minW = minW || 200; minH = minH || 120;
  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  handle.title = 'Cambiar tamaño';
  winEl.appendChild(handle);

  let resizing = false, startX = 0, startY = 0, startW = 0, startH = 0;
  function onDown(e){
    const isTouch = e.type === 'touchstart';
    const p = isTouch ? e.touches[0] : e;
    resizing = true;
    const r = winEl.getBoundingClientRect();
    winEl.style.position = 'fixed';
    winEl.style.left = r.left + 'px';
    winEl.style.top = r.top + 'px';
    winEl.style.right = 'auto'; winEl.style.margin = '0';
    startX = p.clientX; startY = p.clientY;
    startW = r.width; startH = r.height;
    winEl.style.zIndex = ++dragZ;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, {passive:false});
    document.addEventListener('touchend', onUp);
    e.preventDefault(); e.stopPropagation();
  }
  function onMove(e){
    if(!resizing) return;
    if(e.type === 'touchmove') e.preventDefault();
    const p = e.type === 'touchmove' ? e.touches[0] : e;
    const dx = p.clientX - startX, dy = p.clientY - startY;
    const maxW = window.innerWidth - 20, maxH = window.innerHeight - 20;
    winEl.style.width = Math.max(minW, Math.min(maxW, startW + dx)) + 'px';
    winEl.style.height = Math.max(minH, Math.min(maxH, startH + dy)) + 'px';
  }
  function onUp(){
    resizing = false;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
  }
  handle.addEventListener('mousedown', onDown);
  handle.addEventListener('touchstart', onDown, {passive:false});
}
// las ventanas ya existentes en pantalla también se pueden arrastrar, para más autenticidad
makeDraggable(mainWin);
makeDraggable(recWin);
makeResizable(mainWin, 260, 260);
makeResizable(recWin, 260, 180);

/* ---------------- VENTANA: afiche con glitch constante (se abre al publicitar una fecha con afiche) ---------------- */
(function(){
  const posterWin = document.getElementById('posterWin');
  if(!posterWin) return;
  const posterCloseBtn = document.getElementById('posterCloseBtn');
  const posterMinBtn = document.getElementById('posterMinBtn');
  const posterResizeHandle = document.getElementById('posterResizeHandle');
  const posterImg = document.getElementById('posterImg');
  const posterTitle = document.getElementById('posterTitle');
  const posterCaption = document.getElementById('posterCaption');

  makeDraggable(posterWin);

  function openPosterWin(show){
    if(show && show.poster){
      const data = POSTER_IMAGES[show.id];
      if(data) posterImg.src = data;
      posterTitle.textContent = show.poster.file;
      posterCaption.textContent = show.poster.caption;
    }
    posterWin.style.display = 'flex';
    posterWin.style.zIndex = ++dragZ;
  }
  function closePosterWin(){
    posterWin.style.display = 'none';
  }
  if(posterCloseBtn) posterCloseBtn.addEventListener('click', closePosterWin);
  if(posterMinBtn) posterMinBtn.addEventListener('click', ()=>{
    posterWin.style.display = 'none';
    setTimeout(()=>{ posterWin.style.display = 'flex'; }, 900);
  });

  // redimensionado manual: arrastrar la esquina inferior derecha
  (function(){
    let resizing = false, startX = 0, startY = 0, startW = 0, startH = 0;
    const MIN_W = 220, MIN_H = 220;
    function onDown(e){
      const isTouch = e.type === 'touchstart';
      const p = isTouch ? e.touches[0] : e;
      resizing = true;
      const r = posterWin.getBoundingClientRect();
      posterWin.style.position = 'fixed';
      posterWin.style.left = r.left + 'px';
      posterWin.style.top = r.top + 'px';
      posterWin.style.right = 'auto'; posterWin.style.margin = '0';
      startX = p.clientX; startY = p.clientY;
      startW = r.width; startH = r.height;
      posterWin.style.zIndex = ++dragZ;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, {passive:false});
      document.addEventListener('touchend', onUp);
      e.preventDefault(); e.stopPropagation();
    }
    function onMove(e){
      if(!resizing) return;
      if(e.type === 'touchmove') e.preventDefault();
      const p = e.type === 'touchmove' ? e.touches[0] : e;
      const dx = p.clientX - startX, dy = p.clientY - startY;
      posterWin.style.width = Math.max(MIN_W, startW + dx) + 'px';
      posterWin.style.height = Math.max(MIN_H, startH + dy) + 'px';
    }
    function onUp(){
      resizing = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }
    if(posterResizeHandle){
      posterResizeHandle.addEventListener('mousedown', onDown);
      posterResizeHandle.addEventListener('touchstart', onDown, {passive:false});
    }
  })();

  window.openPosterWin = openPosterWin;
  window.closePosterWin = closePosterWin;
})();

/* =====================================================================
   NUEVO: ÍCONOS DE LETRAS EN EL ESCRITORIO + VENTANAS NOTEPAD
   ===================================================================== */
const songIconsWrap = document.getElementById('songIcons');
const heartsDecor = ['♡','✿','☆','♪','✦'];
let openLyricWindows = {};

SONGS.forEach((song, idx)=>{
  const icon = document.createElement('div');
  icon.className = 'icon songicon';
  icon.dataset.idx = idx;
  icon.innerHTML = `<div class="glyph">📄</div>${song.filename}`;
  songIconsWrap.appendChild(icon);

  let lastTap = 0;
  function activate(){
    document.querySelectorAll('.icon').forEach(i=>i.classList.remove('sel'));
    icon.classList.add('sel');
  }
  icon.addEventListener('click', ()=>{
    const now = Date.now();
    if(now - lastTap < 500){ if(autoPlay) setAutoPlay(false); openLyricWindow(idx); } // doble tap en mobile
    activate();
    lastTap = now;
  });
  icon.addEventListener('dblclick', ()=>{
    if(autoPlay) setAutoPlay(false);
    openLyricWindow(idx);
  });
});

/* ---- Mover libremente los íconos del escritorio (arrastrar y soltar) ---- */
let desktopIconJustDragged = false;
function makeIconDraggable(icon){
  let dragging = false, moved = false, offX = 0, offY = 0;

  function toAbsolute(){
    const desk = document.getElementById('desktop');
    const iconRect = icon.getBoundingClientRect();
    const deskRect = desk.getBoundingClientRect();
    icon.style.position = 'absolute';
    icon.style.left = (iconRect.left - deskRect.left) + 'px';
    icon.style.top = (iconRect.top - deskRect.top) + 'px';
    icon.style.bottom = 'auto';
    icon.style.right = 'auto';
    icon.style.margin = '0';
  }

  function onDown(e){
    if(e.type === 'mousedown' && e.button !== 0) return;
    const isTouch = e.type === 'touchstart';
    const point = isTouch ? e.touches[0] : e;
    toAbsolute();
    dragging = true; moved = false;
    icon.classList.add('dragging');
    icon.style.zIndex = 5;
    const rect = icon.getBoundingClientRect();
    offX = point.clientX - rect.left;
    offY = point.clientY - rect.top;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, {passive:false});
    document.addEventListener('touchend', onUp);
  }
  function onMove(e){
    if(!dragging) return;
    if(e.type === 'touchmove') e.preventDefault();
    const point = e.type === 'touchmove' ? e.touches[0] : e;
    const desk = document.getElementById('desktop');
    const deskRect = desk.getBoundingClientRect();
    let nx = point.clientX - deskRect.left - offX;
    let ny = point.clientY - deskRect.top - offY;
    nx = Math.max(0, Math.min(deskRect.width - icon.offsetWidth, nx));
    ny = Math.max(0, Math.min(deskRect.height - icon.offsetHeight, ny));
    if(Math.abs(nx - parseFloat(icon.style.left || 0)) > 3 || Math.abs(ny - parseFloat(icon.style.top || 0)) > 3){
      moved = true;
    }
    icon.style.left = nx + 'px';
    icon.style.top = ny + 'px';
  }
  function onUp(){
    dragging = false;
    icon.classList.remove('dragging');
    icon.style.zIndex = '';
    if(moved) desktopIconJustDragged = true;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onUp);
  }
  icon.addEventListener('mousedown', onDown);
  icon.addEventListener('touchstart', onDown, {passive:true});
}
// evita que un arrastre termine seleccionando/abriendo el ícono por accidente
document.getElementById('desktop').addEventListener('click', (e)=>{
  if(desktopIconJustDragged){
    e.stopPropagation();
    e.preventDefault();
    desktopIconJustDragged = false;
  }
}, true);
document.querySelectorAll('#desktop .icon').forEach(makeIconDraggable);

/* =====================================================================
   NUEVO: agrupa los íconos de juegos siempre juntos en la esquina
   inferior izquierda del escritorio (Buscaminas, Solitario, Sudoku)
   ===================================================================== */
function arrangeGameIconsBottomLeft(){
  const gameIconIds = ['iconMinesweeper', 'iconSolitario', 'iconSudoku', 'iconPinball', 'iconTetris'];
  const spacing = 84; // alto aproximado de cada ícono + etiqueta
  let i = 0;
  gameIconIds.forEach(id=>{
    const icon = document.getElementById(id);
    if(!icon) return;
    icon.style.position = 'absolute';
    icon.style.left = '10px';
    icon.style.right = 'auto';
    icon.style.top = 'auto';
    icon.style.bottom = (10 + i*spacing) + 'px';
    icon.style.margin = '0';
    i++;
  });
}
arrangeGameIconsBottomLeft();

/* =====================================================================
   NUEVO: fija la posición de los íconos de archivo (canciones) en una
   grilla prolija pegada a la esquina superior derecha del escritorio,
   para que el orden/acomodo sea siempre el mismo al abrir el sistema
   (en vez de depender de que alguien los haya arrastrado a mano).
   ===================================================================== */
function arrangeSongIconsGridTopRight(){
  const cols = 6;
  const colWidth = 84, rowHeight = 84;
  const rightBase = 26, topBase = 232;
  document.querySelectorAll('#songIcons .icon').forEach((icon, idx)=>{
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    icon.style.position = 'absolute';
    icon.style.left = 'auto';
    icon.style.bottom = 'auto';
    icon.style.right = (rightBase + (cols-1-col)*colWidth) + 'px';
    icon.style.top = (topBase + row*rowHeight) + 'px';
    icon.style.margin = '0';
  });
}
arrangeSongIconsGridTopRight();

function openLyricWindow(idx){
  const song = SONGS[idx];
  if(openLyricWindows[idx] && document.body.contains(openLyricWindows[idx].win)){
    // ya existe: solo la trae al frente y la marca como en reproducción
    openLyricWindows[idx].win.style.zIndex = ++dragZ;
    setNowPlaying(idx);
    return;
  }
  const win = document.createElement('div');
  win.className = 'winfloat lyricwin';
  win.style.top = (14 + Math.random()*18) + '%';
  win.style.left = (10 + Math.random()*26) + '%';
  win.style.zIndex = ++dragZ;
  const heart = heartsDecor[idx % heartsDecor.length];
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> ${song.filename} - Notepad</div>
      <div class="winbtns">
        <button class="lyMin" title="Minimizar">_</button>
        <button class="lyMax" title="Maximizar">▢</button>
        <button class="lyClose" title="Cerrar">✕</button>
      </div>
    </div>
    <div class="notepad-menu"><span>Archivo</span><span>Edición</span><span>Buscar</span><span>Ayuda</span></div>
    <div class="notepad-nowplaying">▶ REPRODUCIENDO AHORA</div>
    <div class="notepad-body">
      <div style="text-align:center; font-size:11px; padding-top:6px; color:#000080;">${heart} PISTA ${song.num} ${heart}</div>
      <div class="notepad-text">${song.title}\n${'─'.repeat(Math.max(10,song.title.length))}\n\n${song.lyrics}</div>
      <div class="notepad-foot">
        <span>Ln 1, Col 1</span>
        <span class="notepad-hearts">${heart}${heart}${heart}</span>
      </div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 160);

  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem';
  taskChip.textContent = '📄 ' + song.filename;
  errWrap.appendChild(taskChip);
  taskChip.addEventListener('click', ()=>{ win.style.zIndex = ++dragZ; });

  function close(){
    win.remove(); taskChip.remove(); delete openLyricWindows[idx];
    if(nowPlayingIdx === idx) setNowPlaying(null);
  }
  win.querySelector('.lyClose').addEventListener('click', close);
  win.querySelector('.lyMin').addEventListener('click', ()=>{
    win.style.display = (win.style.display === 'none') ? '' : 'none';
  });
  win.querySelector('.lyMax').addEventListener('click', ()=>{
    win.style.width = (win.style.width === '92vw') ? '360px' : '92vw';
  });
  openLyricWindows[idx] = { win, taskChip };
  setNowPlaying(idx);
}

/* ---- Lista desplegable de letras (debajo de "Lugar" en Publicitando) ---- */
const lyricsSelect = document.getElementById('lyricsSelect');
if(lyricsSelect){
  SONGS.forEach((song, idx)=>{
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${song.num} — ${song.title}`;
    lyricsSelect.appendChild(opt);
  });
  lyricsSelect.addEventListener('change', ()=>{
    if(lyricsSelect.value === '') return;
    const idx = parseInt(lyricsSelect.value, 10);
    if(autoPlay) setAutoPlay(false);
    openLyricWindow(idx);
    lyricsSelect.value = '';
  });
}

/* =====================================================================
   NUEVO: "REPRODUCIENDO AHORA" — una sola fuente de verdad para todo el sistema.
   setNowPlaying() es la única función que cambia qué canción está sonando;
   así el cartel principal, la marquesina, el ícono del escritorio y la
   ventana de letras abierta siempre coinciden entre sí.
   ===================================================================== */
let nowPlayingIdx = null;
let autoPlay = false;
let autoPlayHandle = null;
const nowPlayingField = document.getElementById('nowPlayingField');
const marqueeSpan = document.getElementById('marqueeSpan');

function refreshMarquee(){
  const showPart = currentShow
    ? `MATILDE PIZARRO EN VIVO — ${currentShow.fecha} — ${currentShow.lugar}`
    : 'MATILDE_OS — SELECCIONA UNA FECHA PARA PUBLICITAR EL SHOW';
  const songPart = (nowPlayingIdx !== null)
    ? ` · REPRODUCIENDO: ${SONGS[nowPlayingIdx].num} ${SONGS[nowPlayingIdx].title}`
    : '';
  marqueeSpan.textContent = `*** ${showPart}${songPart} ***     `;
}

function setNowPlaying(idx){
  nowPlayingIdx = idx;

  document.querySelectorAll('.songicon').forEach(i=>i.classList.remove('nowplaying'));
  Object.entries(openLyricWindows).forEach(([i, entry])=>{
    const isPlaying = Number(i) === idx;
    entry.win.classList.toggle('playing', isPlaying);
    entry.taskChip.textContent = (isPlaying ? '▶ ' : '📄 ') + SONGS[i].filename;
  });

  if(idx === null){
    nowPlayingField.textContent = 'Ningún archivo abierto';
  } else {
    const iconEl = songIconsWrap.children[idx];
    if(iconEl) iconEl.classList.add('nowplaying');
    const song = SONGS[idx];
    nowPlayingField.textContent = `${song.num}_${song.title}.txt — abierto ahora`;
    spawnToast(`Reproduciendo ahora: ${song.num} ${song.title}`);
  }
  refreshMarquee();
}

function advanceAutoPlay(){
  const next = (nowPlayingIdx === null) ? 0 : (nowPlayingIdx + 1) % SONGS.length;
  setNowPlaying(next);
}
function setAutoPlay(on){
  autoPlay = on;
  clearInterval(autoPlayHandle);
  autoPlayToggleBtn.textContent = autoPlay ? '⏸ Reproducción automática: ON' : '▶ Reproducción automática: OFF';
  if(autoPlay){
    autoPlayHandle = setInterval(advanceAutoPlay, 26000);
    if(nowPlayingIdx === null) advanceAutoPlay();
  }
}
const autoPlayToggleBtn = document.getElementById('autoPlayToggle');
autoPlayToggleBtn.addEventListener('click', ()=> setAutoPlay(!autoPlay));
refreshMarquee();

/* =====================================================================
   NUEVO: MENÚ CONTEXTUAL DEL ESCRITORIO (click derecho)
   ===================================================================== */
const desktopEl = document.getElementById('desktop');
const ctxMenu = document.getElementById('ctxMenu');
desktopEl.addEventListener('contextmenu', (e)=>{
  e.preventDefault();
  ctxMenu.style.display = 'block';
  ctxMenu.style.left = Math.min(e.clientX, window.innerWidth-200) + 'px';
  ctxMenu.style.top = Math.min(e.clientY, window.innerHeight-160) + 'px';
});
document.addEventListener('click', (e)=>{
  if(!ctxMenu.contains(e.target)) ctxMenu.style.display = 'none';
});
document.getElementById('ctxRefresh').addEventListener('click', ()=>{
  triggerHourglass(); triggerScanGlitch();
});
document.getElementById('ctxArrange').addEventListener('click', triggerIconJiggle);
document.getElementById('ctxProps').addEventListener('click', openDisplayProperties);
document.getElementById('ctxAbout').addEventListener('click', ()=>{
  spawnErrorPopupCustom('Acerca de MATILDE_OS', 'MATILDE_OS 98<br>Sistema operativo dedicado al catálogo y las fechas de <b>Matilde Pizarro</b>. Todos los derechos reservados al escenario.');
});
