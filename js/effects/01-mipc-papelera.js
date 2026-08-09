/* =====================================================================
   NUEVO: "MI PC" y "PAPELERA" — chistes rápidos, y Winamp abre el mixer
   ===================================================================== */
document.getElementById('iconMiPC').addEventListener('dblclick', ()=>{
  spawnErrorPopupCustom('Propiedades de Mi PC', 'Procesador: <b>Pentium 98</b><br>Memoria RAM: 100% disponible<br>Disco duro: 1 disco debut + 2 singles<br>Sistema: MATILDE_OS 98');
});
document.getElementById('iconPapelera').addEventListener('dblclick', ()=>{
  spawnErrorPopupCustom('Papelera de reciclaje', 'La papelera está vacía.');
});
document.getElementById('iconWinamp').addEventListener('dblclick', openWinampPlayer);

