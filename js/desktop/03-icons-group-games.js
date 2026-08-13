/* =====================================================================
   NUEVO: agrupa los íconos de juegos siempre juntos en la esquina
   inferior izquierda del escritorio (Buscaminas, Solitario, Sudoku...)
   ---------------------------------------------------------------------
   Usa columnas/filas de la grilla de #desktop (ver css/01-desktop.css)
   en vez de coordenadas en píxeles: así el navegador reserva esas
   celdas de verdad y ningún ícono normal del flujo puede "pisarlas".

   No se usan índices negativos de CSS (grid-row:-1, etc.) porque en
   ventanas angostas/bajas hay MENOS filas reales de las esperadas, y
   "-1" deja de significar "la última fila de abajo". Todo se calcula
   acá con JS, midiendo el tamaño real del escritorio.

   Este script corre ANTES que 04-icons-fixed-position.js (ver orden
   en index.html) y publica en window.__gamesReservedCols cuántas
   columnas de la izquierda terminó usando (normalmente 1, más si la
   ventana es muy baja y no entran las 6 filas en una sola columna),
   para que el grupo de canciones sepa cuánto espacio dejarle libre y
   nunca terminen pidiendo la misma celda.
   ===================================================================== */
function arrangeGameIconsBottomLeft(){
  const gameIconIds = ['iconMinesweeper', 'iconSolitario', 'iconSudoku', 'iconPinball', 'iconTetris', 'iconAjedrez'];
  const desk = document.getElementById('desktop');
  const cell = 88; // 84px de celda + 4px de gap

  function apply(){
    const cs = getComputedStyle(desk);
    const availH = desk.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const totalRows = Math.max(1, Math.floor((availH + 4) / cell));
    const rowsPerCol = totalRows;
    const neededCols = Math.max(1, Math.ceil(gameIconIds.length / rowsPerCol));
    window.__gamesReservedCols = neededCols;

    gameIconIds.forEach((id, i)=>{
      const icon = document.getElementById(id);
      if(!icon) return;
      const colOffset = Math.floor(i / rowsPerCol);
      const rowInCol = i % rowsPerCol;
      icon.style.position = '';
      icon.style.left = '';
      icon.style.right = '';
      icon.style.top = '';
      icon.style.bottom = '';
      icon.style.margin = '';
      icon.style.gridColumn = String(1 + colOffset); // columna 1 = la de más a la izquierda
      icon.style.gridRow = String(totalRows - rowInCol); // última fila real = totalRows
    });
  }
  apply();
  let resizeTimer = null;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=>{
      apply();
      if(typeof window.__reflowSongIcons === 'function') window.__reflowSongIcons();
    }, 130);
  });
}
arrangeGameIconsBottomLeft();
