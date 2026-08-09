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
