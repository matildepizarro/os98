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
const DRAG_THRESHOLD = 6; // px: por debajo de esto, es un click con temblor de mano, no un arrastre
function makeIconDraggable(icon){
  let dragging = false, moved = false, offX = 0, offY = 0, startX = 0, startY = 0;

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
    // OJO: ya NO se llama a toAbsolute() acá. Antes se sacaba el ícono
    // de su posición normal (grid/flex) en cada click, aunque no se
    // arrastrara, lo que hacía que los demás íconos se reacomodaran y
    // terminaran superpuestos con el que se acababa de "soltar". Ahora
    // solo se convierte a posición absoluta cuando hay un arrastre real
    // (ver onMove, que además exige superar DRAG_THRESHOLD px de
    // movimiento real — un click con mouse o dedo casi siempre tiene
    // 1-3px de temblor de la mano, y sin este umbral ESE temblor ya
    // alcanzaba para disparar la conversión y correr los íconos).
    dragging = true; moved = false;
    startX = point.clientX; startY = point.clientY;
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
    const point = e.type === 'touchmove' ? e.touches[0] : e;
    if(!moved){
      const dx = point.clientX - startX, dy = point.clientY - startY;
      if(Math.hypot(dx, dy) < DRAG_THRESHOLD) return; // todavía no es un arrastre real
      if(e.type === 'touchmove') e.preventDefault();
      toAbsolute();
      moved = true;
      icon.classList.add('dragging');
      icon.style.zIndex = 5;
    } else if(e.type === 'touchmove'){
      e.preventDefault();
    }
    const desk = document.getElementById('desktop');
    const deskRect = desk.getBoundingClientRect();
    let nx = point.clientX - deskRect.left - offX;
    let ny = point.clientY - deskRect.top - offY;
    nx = Math.max(0, Math.min(deskRect.width - icon.offsetWidth, nx));
    ny = Math.max(0, Math.min(deskRect.height - icon.offsetHeight, ny));
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
