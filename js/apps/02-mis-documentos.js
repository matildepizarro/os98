/* =====================================================================
   NUEVO: "MIS DOCUMENTOS" — carpeta con accesos a todas las letras
   ===================================================================== */
function openDocsFolder(){
  const win = document.createElement('div');
  win.className = 'winfloat folderwin';
  win.style.top = '20%'; win.style.left = '32%';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Mis documentos</div>
      <div class="winbtns"><button class="fdClose">✕</button></div>
    </div>
    <div class="menubar"><span>Archivo</span><span>Edición</span><span>Ver</span><span>Ayuda</span></div>
    <div class="folder-grid" id="folderGrid"></div>
    <div style="font-size:10px; padding:4px 10px 8px; color:#404040;">${SONGS.length} objeto(s)</div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 160);
  const grid = win.querySelector('#folderGrid');
  SONGS.forEach((song, idx)=>{
    const item = document.createElement('div');
    item.className = 'folder-item';
    item.innerHTML = `<div class="fglyph">📄</div>${song.filename}`;
    item.addEventListener('dblclick', ()=>{
      if(autoPlay) setAutoPlay(false);
      openLyricWindow(idx);
    });
    grid.appendChild(item);
  });
  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem';
  taskChip.textContent = '📁 Mis documentos';
  errWrap.appendChild(taskChip);
  function close(){ win.remove(); taskChip.remove(); }
  win.querySelector('.fdClose').addEventListener('click', close);
}
document.getElementById('iconDocs').addEventListener('dblclick', openDocsFolder);
