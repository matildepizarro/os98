/* =====================================================================
   NUEVO: EFECTO ABERRACIÓN CROMÁTICA
   ===================================================================== */
const chromaOverlay = document.getElementById('chromaOverlay');
function triggerChromaGlitch(){
  chromaOverlay.classList.remove('on'); void chromaOverlay.offsetWidth;
  chromaOverlay.classList.add('on');
  setTimeout(()=>chromaOverlay.classList.remove('on'), 200);
}
