/* =====================================================================
   NUEVO: ÍCONOS QUE TIEMBLAN (glitch de "organizar íconos")
   ===================================================================== */
function triggerIconJiggle(){
  desktopEl.classList.remove('jiggle'); void desktopEl.offsetWidth;
  desktopEl.classList.add('jiggle');
  setTimeout(()=> desktopEl.classList.remove('jiggle'), 300);
}
