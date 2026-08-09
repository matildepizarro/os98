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
