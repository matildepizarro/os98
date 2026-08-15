/* =====================================================================
   NUEVO: BUSCANDO ACTUALIZACIONES (dialogo falso, humor Win98)
   ===================================================================== */
function spawnUpdateSearch(){
  spawnErrorPopupCustom('Windows Update', 'Buscando actualizaciones... Se encontró 1 actualización crítica: <b>MÁS_GLITTER_98.exe</b>. Se recomienda instalar antes de que termine la canción.');
}

/* ---------------- TOAST (globito de notificación) ---------------- */
function spawnToast(customMsg){
  const msgsNeutral = [
    "Catálogo de Matilde Pizarro cargado correctamente.",
    "Se ha completado la desfragmentación del escritorio.",
    "Recuerda: puedes elegir una fecha en el cartel principal.",
    "Nivel de kawaii-core.dll: óptimo.",
    "Sistema funcionando sin errores críticos.",
    "Actualización disponible: MÁS_APLAUSOS.exe",
  ];
  const msgsLive = currentShow ? [
    `Publicitando: Matilde Pizarro en ${currentShow.lugar}.`,
    `Función confirmada para el ${currentShow.fecha}.`,
    "Se ha detectado un nuevo fan revisando la función.",
    "Sistema funcionando sin errores críticos.",
  ] : [];
  const pool = currentShow ? msgsLive.concat(msgsNeutral) : msgsNeutral;
  const t = document.createElement('div');
  t.className = currentShow ? 'toast98 kawaii' : 'toast98';
  t.textContent = customMsg || pool[Math.floor(Math.random()*pool.length)];
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 6500);
}

/* ---------------- GLITCH DIRECTOR: cicla eventos icónicos cada 2s ---------------- */
const glitchCountEl = document.getElementById('glitchCount');
let glitchCount = 0;

// pesos: los eventos grandes (BSOD, screensaver) deben salir con menos frecuencia
const weightedPool = [
  ...Array(4).fill(triggerScanGlitch),
  ...Array(3).fill(triggerShake),
  ...Array(3).fill(triggerFlash),
  ...Array(2).fill(triggerHourglass),
  ...Array(2).fill(spawnToast),
  ...Array(2).fill(showClippy),
  ...Array(2).fill(triggerResourceDrop),
  ...Array(2).fill(spawnErrorPopup),
  ...Array(3).fill(spawnVirusPopup),
  ...Array(1).fill(triggerScreensaver),
  ...Array(1).fill(flashBSOD),
  ...Array(3).fill(triggerChromaGlitch),
  ...Array(3).fill(spawnSparkleBurst),
  ...Array(2).fill(triggerIconJiggle),
  ...Array(1).fill(spawnInstallProgress),
  ...Array(1).fill(spawnUpdateSearch),
  ...Array(1).fill(spawnVideoErrorPopup),
  ...Array(2).fill(spawnHugGlitch),
  ...Array(2).fill(spawnHeadphonesGlitch),
  ...Array(2).fill(spawnBubbleCheckin),
  ...Array(1).fill(spawnBounceCritter),
];

// ARREGLO/NUEVO: interruptor de efectos de virus/glitch. Antes corrían
// cada 2s sin parar (ventanas de virus, BSOD, screensaver, sacudidas,
// etc.) y podían taparse o robarse el foco justo mientras se está jugando
// al solitario/buscaminas/sudoku, haciendo casi imposible terminar una
// partida. Este ícono del escritorio permite pausarlos para jugar tranquilo.
let glitchEffectsEnabled = true;
try{
  const savedGlitchPref = localStorage.getItem('onceOS_glitchEffectsEnabled');
  if(savedGlitchPref !== null) glitchEffectsEnabled = savedGlitchPref === '1';
}catch(e){}

function runGlitchTick(){
  if(!glitchEffectsEnabled) return;
  const fn = weightedPool[Math.floor(Math.random()*weightedPool.length)];
  fn();
  glitchCount++;
  glitchCountEl.textContent = glitchCount;
}
setInterval(runGlitchTick, 2000);

function updateGlitchToggleIcon(){
  const icon = document.getElementById('iconGlitchToggle');
  if(!icon) return;
  const glyph = icon.querySelector('.glyph');
  if(glitchEffectsEnabled){
    glyph.textContent = '🐛';
    icon.lastChild.textContent = 'Efectos de virus';
  } else {
    glyph.textContent = '🛡️';
    icon.lastChild.textContent = 'Efectos: OFF';
  }
}
function setGlitchEffectsEnabled(on){
  glitchEffectsEnabled = on;
  try{ localStorage.setItem('onceOS_glitchEffectsEnabled', on ? '1' : '0'); }catch(e){}
  updateGlitchToggleIcon();
  spawnToastMessage(on ? '🐛 Efectos de virus/glitch ACTIVADOS' : '🛡️ Efectos de virus/glitch DESACTIVADOS (modo juego tranquilo)');
}
// pequeño helper de toast reutilizando el estilo toast98 ya existente
function spawnToastMessage(text){
  const t = document.createElement('div');
  t.className = 'toast98';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 3200);
}
(function(){
  const iconGlitchToggle = document.getElementById('iconGlitchToggle');
  if(iconGlitchToggle){
    iconGlitchToggle.addEventListener('dblclick', ()=>{
      setGlitchEffectsEnabled(!glitchEffectsEnabled);
    });
  }
  updateGlitchToggleIcon();
})();

/* ---------------- BOOT SPLASH: se oculta tras cargar ----------------
   IMPORTANTE: este bloque va aislado y blindado con try/catch a propósito.
   Si CUALQUIER otra cosa en este archivo (o en el sistema de íconos de
   arriba) llegara a tirar un error, este código de todos modos tiene que
   ejecutarse igual, porque #bootSplash tapa TODA la pantalla con
   z-index:9000. Si esta ventana se queda pegada, ningún clic en el
   escritorio (menú inicio, webcam, íconos, nada) va a funcionar, y encima
   puede pasar sin ningún error visible en consola. */
function hideBootSplashSafely(){
  try{
    const bootSplash = document.getElementById('bootSplash');
    if(!bootSplash) return;
    bootSplash.style.transition = 'opacity .5s ease';
    bootSplash.style.opacity = '0';
    bootSplash.style.pointerEvents = 'none';
    setTimeout(()=>{ try{ bootSplash.remove(); }catch(e){} }, 550);
  }catch(e){
    console.error('No se pudo ocultar #bootSplash:', e);
  }
}
window.addEventListener('load', ()=>{ setTimeout(hideBootSplashSafely, 2200); });
// red de seguridad extra: si por lo que sea 'load' nunca dispara el hide,
// forzamos el cierre a los 6s igual para no dejar el escritorio bloqueado.
setTimeout(hideBootSplashSafely, 6000);
