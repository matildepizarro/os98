/* =====================================================================
   NUEVO: fija la posición de los íconos de archivo (canciones) en una
   grilla prolija pegada a la esquina superior derecha del escritorio,
   para que el orden/acomodo sea siempre el mismo al abrir el sistema
   (en vez de depender de que alguien los haya arrastrado a mano).
   ---------------------------------------------------------------------
   Se ancla usando columnas/filas reales de la grilla de #desktop,
   calculadas con JS a partir del ancho real (no índices negativos de
   CSS, que en ventanas angostas dejan de corresponder a "la columna
   de más a la derecha"). Se recalcula si la ventana cambia de tamaño.

   Corre DESPUÉS de 03-icons-group-games.js y lee cuántas columnas de
   la izquierda reservó el grupo de juegos (window.__gamesReservedCols)
   para nunca usar esas mismas columnas: así ambos grupos jamás piden
   la misma celda, sin importar el tamaño de ventana.
   ===================================================================== */
function arrangeSongIconsGridTopRight(){
  const maxCols = 6;
  const desk = document.getElementById('desktop');
  const cell = 88; // 84px de celda + 4px de gap
  const songIcons = document.querySelectorAll('#songIcons .icon');

  function apply(){
    if(songIcons.length === 0) return;
    const cs = getComputedStyle(desk);
    const availW = desk.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const totalCols = Math.max(1, Math.floor((availW + 4) / cell));
    const gamesCols = window.__gamesReservedCols || 0;
    // columnas libres para las canciones, sin invadir las que ya
    // reservó el grupo de juegos a la izquierda (dejamos al menos 1
    // aunque técnicamente se pise en un caso extremo sin espacio: en
    // ese punto ya no entran ambos grupos completos en pantalla y
    // #desktop tiene scroll de respaldo, ver css/01-desktop.css)
    const songCols = Math.max(1, Math.min(maxCols, totalCols - gamesCols));

    songIcons.forEach((icon, idx)=>{
      const col = idx % songCols; // 0 = más a la derecha
      const row = Math.floor(idx / songCols); // 0 = fila de más arriba del grupo
      icon.style.position = '';
      icon.style.left = '';
      icon.style.right = '';
      icon.style.top = '';
      icon.style.bottom = '';
      icon.style.margin = '';
      icon.style.gridColumn = String(totalCols - col); // última columna real = totalCols
      icon.style.gridRow = String(3 + row); // deja las primeras 2 filas para íconos fijos de arriba
    });
  }
  apply();
  window.__reflowSongIcons = apply;
  let resizeTimer = null;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(apply, 140);
  });
}
arrangeSongIconsGridTopRight();
