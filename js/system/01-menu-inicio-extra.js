/* =====================================================================
   NUEVO: ítems del menú Inicio que faltaban por conectar
   (Programas, Documentos, Buscar, Ejecutar, Apagar el sistema)
   ===================================================================== */
function closeStartMenu(){
  startOpen = false;
  startMenu.style.display = 'none';
  startBtn.classList.remove('active');
  programsMenu.style.display = 'none';
}

// --- Documentos: abre la misma carpeta que el ícono "Mis documentos" ---
document.getElementById('smDocs').addEventListener('click', ()=>{
  openDocsFolder(); closeStartMenu();
});

// --- Ejecutar...: abre la ventana principal MATILDE_PIZARRO.EXE ---
document.getElementById('smRun').addEventListener('click', ()=>{
  openMainWin();
  closeStartMenu();
});

/* ---------------- Programas: submenú con accesos directos ---------------- */
const programsMenu = document.getElementById('programsMenu');
const smProgramas = document.getElementById('smProgramas');
smProgramas.addEventListener('click', (e)=>{
  e.stopPropagation();
  const isOpen = programsMenu.style.display === 'block';
  programsMenu.style.display = isOpen ? 'none' : 'block';
});
document.getElementById('pmMain').addEventListener('click', ()=>{
  openMainWin(); closeStartMenu();
});
document.getElementById('pmGrabadora').addEventListener('click', ()=>{
  recWin.style.display = ''; recWin.style.zIndex = ++dragZ; closeStartMenu();
});
document.getElementById('pmWebcam').addEventListener('click', ()=>{
  const wc = document.getElementById('webcamWin');
  if(wc){ wc.style.display = ''; wc.style.zIndex = ++dragZ; }
  closeStartMenu();
});
document.getElementById('pmMixer').addEventListener('click', ()=>{
  openVolumeMixer(); closeStartMenu();
});
document.getElementById('pmIE').addEventListener('click', ()=>{
  openIEWindow(); closeStartMenu();
});
document.getElementById('pmNotepad').addEventListener('click', ()=>{
  openNotepadWindow(); closeStartMenu();
});
document.getElementById('pmCalc').addEventListener('click', ()=>{
  openCalcWindow(); closeStartMenu();
});
document.getElementById('pmPaint').addEventListener('click', ()=>{
  openPaintWindow(); closeStartMenu();
});
document.getElementById('pmMinesweeper').addEventListener('click', ()=>{
  openMinesweeperWindow(); closeStartMenu();
});
document.getElementById('pmSolitario').addEventListener('click', ()=>{
  openSolitarioWindow(); closeStartMenu();
});
document.getElementById('pmSudoku').addEventListener('click', ()=>{
  openSudokuWindow(); closeStartMenu();
});
document.getElementById('pmPinball').addEventListener('click', ()=>{
  openPinballWindow(); closeStartMenu();
});
document.getElementById('pmCalendar').addEventListener('click', ()=>{
  openCalendarWindow(); closeStartMenu();
});
document.getElementById('pmDocs').addEventListener('click', ()=>{
  openDocsFolder(); closeStartMenu();
});
// si se cierra el menú Inicio (clic fuera), cerrar también el submenú
document.addEventListener('mousedown', (e)=>{
  if(programsMenu.style.display === 'block' &&
     !programsMenu.contains(e.target) && e.target !== smProgramas){
    programsMenu.style.display = 'none';
  }
});

/* ---------------- Buscar: filtra letras/canciones por nombre ---------------- */
const searchWin = document.getElementById('searchWin');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
makeDraggable(searchWin);
makeResizable(searchWin, 240, 160);

function renderSearchResults(query){
  const q = query.trim().toLowerCase();
  searchResults.innerHTML = '';
  if(!q){
    searchResults.innerHTML = '<div class="searchNoResults">Escribe un nombre para buscar…</div>';
    return;
  }
  const matches = SONGS.filter(s =>
    s.filename.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)
  );
  if(matches.length === 0){
    searchResults.innerHTML = '<div class="searchNoResults">No se encontraron archivos.</div>';
    return;
  }
  matches.forEach(song=>{
    const item = document.createElement('div');
    item.className = 'searchResultItem';
    item.textContent = '📄 ' + song.filename;
    item.addEventListener('click', ()=>{
      if(autoPlay) setAutoPlay(false);
      openLyricWindow(SONGS.indexOf(song));
    });
    searchResults.appendChild(item);
  });
}
searchInput.addEventListener('input', ()=> renderSearchResults(searchInput.value));
document.getElementById('smBuscar').addEventListener('click', ()=>{
  searchWin.style.display = 'flex';
  searchWin.style.zIndex = ++dragZ;
  renderSearchResults(searchInput.value);
  searchInput.focus();
  closeStartMenu();
});
document.getElementById('searchCloseBtn').addEventListener('click', ()=>{
  searchWin.style.display = 'none';
});
