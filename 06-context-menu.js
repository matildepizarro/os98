/* =====================================================================
   NUEVO: MENÚ CONTEXTUAL DEL ESCRITORIO (click derecho)
   ===================================================================== */
const desktopEl = document.getElementById('desktop');
const ctxMenu = document.getElementById('ctxMenu');
desktopEl.addEventListener('contextmenu', (e)=>{
  e.preventDefault();
  ctxMenu.style.display = 'block';
  ctxMenu.style.left = Math.min(e.clientX, window.innerWidth-200) + 'px';
  ctxMenu.style.top = Math.min(e.clientY, window.innerHeight-160) + 'px';
});
document.addEventListener('click', (e)=>{
  if(!ctxMenu.contains(e.target)) ctxMenu.style.display = 'none';
});
document.getElementById('ctxRefresh').addEventListener('click', ()=>{
  triggerHourglass(); triggerScanGlitch();
});
/* NOTA: se envuelven en funciones anónimas a propósito. triggerIconJiggle y
   openDisplayProperties se definen en archivos que cargan MÁS TARDE que este
   (effects/06-iconos-temblando.js y desktop/07-display-properties.js). Si se
   pasan directo como referencia acá, en este momento todavía no existen y
   tiran ReferenceError, cortando el resto de este script (rompe el menú
   contextual completo). Envueltas en () => ... recién se resuelven al hacer
   click, cuando ya están definidas. */
document.getElementById('ctxArrange').addEventListener('click', ()=> triggerIconJiggle());
document.getElementById('ctxProps').addEventListener('click', ()=> openDisplayProperties());
document.getElementById('ctxAbout').addEventListener('click', ()=>{
  spawnErrorPopupCustom('Acerca de MATILDE_OS', 'MATILDE_OS 98<br>Sistema operativo dedicado al catálogo y las fechas de <b>Matilde Pizarro</b>. Todos los derechos reservados al escenario.');
});
