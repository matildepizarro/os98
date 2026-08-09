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
