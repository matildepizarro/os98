/* =====================================================================
   NUEVO: agrupa los íconos de juegos siempre juntos en la esquina
   inferior izquierda del escritorio (Buscaminas, Solitario, Sudoku)
   ===================================================================== */
function arrangeGameIconsBottomLeft(){
  const gameIconIds = ['iconMinesweeper', 'iconSolitario', 'iconSudoku', 'iconPinball', 'iconTetris', 'iconAjedrez'];
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
