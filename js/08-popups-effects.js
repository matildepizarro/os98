/* =====================================================================
   MODULO: js/08-popups-effects.js
   POPUPS Y EFECTOS — Mi PC/Papelera, popup genérico, codec, aberración cromática, sparkles, iconos temblando, buscando actualizaciones
   ===================================================================== */

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


/* =====================================================================
   NUEVO: POPUP GENÉRICO REUTILIZABLE (para about / estado / etc.)
   ===================================================================== */
function spawnErrorPopupCustom(title, msg){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  const win = document.createElement('div');
  win.className = 'win errwin';
  win.style.top = (18 + Math.random()*30) + '%';
  win.style.left = (10 + Math.random()*40) + '%';
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> ${title}</div>
      <div class="winbtns"><button class="errclose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="errbody">
        <div class="icoerr" style="color:#c2185b; border-color:#c2185b;">✿</div>
        <div class="errtext">${msg}</div>
      </div>
      <div class="errbtnrow"><button class="btn98 errok">Aceptar</button></div>
    </div>
  `;
  document.body.appendChild(win);
  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem blink';
  taskChip.textContent = '✿ ' + title;
  errWrap.appendChild(taskChip);
  function close(){ win.remove(); taskChip.remove(); openHeavyPopups--; }
  win.querySelector('.errclose').addEventListener('click', close);
  win.querySelector('.errok').addEventListener('click', close);
  setTimeout(close, 9000);
}

/* =====================================================================
   NUEVO: PROGRESO DE "INSTALACIÓN" DE CODEC KAWAII
   ===================================================================== */
const installMessages = [
  'kawaii-core.dll',
  'sparkle-shader.sys',
  'winamp-groove.drv',
  'lunar-reverb.dll',
  'tocata.sys',
  'discoball_98.vxd',
];
function spawnInstallProgress(){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  const name = installMessages[Math.floor(Math.random()*installMessages.length)];
  const win = document.createElement('div');
  win.className = 'win errwin';
  win.style.width = '300px';
  win.style.top = (22 + Math.random()*30) + '%';
  win.style.left = (14 + Math.random()*30) + '%';
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Instalando componentes</div>
    </div>
    <div class="win-body">
      <div style="font-size:12px; margin-bottom:8px;">Copiando <b>${name}</b>...</div>
      <div class="progressOuter"><div class="progressInner" id="pinner"></div></div>
      <div style="font-size:10px; text-align:right; margin-top:4px;" id="pctText">0%</div>
    </div>
  `;
  document.body.appendChild(win);
  const bar = win.querySelector('#pinner');
  const pctText = win.querySelector('#pctText');
  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem';
  taskChip.textContent = '📀 Instalando ' + name;
  errWrap.appendChild(taskChip);
  let pct = 0;
  const iv = setInterval(()=>{
    pct += 8 + Math.random()*14;
    if(pct >= 100){ pct = 100; clearInterval(iv); setTimeout(close, 500); }
    bar.style.width = pct + '%';
    pctText.textContent = Math.floor(pct) + '%';
  }, 220);
  function close(){ win.remove(); taskChip.remove(); openHeavyPopups--; }
  setTimeout(close, 6000);
}

/* =====================================================================
   NUEVO: EFECTO ABERRACIÓN CROMÁTICA
   ===================================================================== */
const chromaOverlay = document.getElementById('chromaOverlay');
function triggerChromaGlitch(){
  chromaOverlay.classList.remove('on'); void chromaOverlay.offsetWidth;
  chromaOverlay.classList.add('on');
  setTimeout(()=>chromaOverlay.classList.remove('on'), 200);
}

/* =====================================================================
   NUEVO: SPARKLE BURST (confeti kawaii siguiendo el cursor / aleatorio)
   ===================================================================== */
const sparkleChars = ['✨','💖','⭐','🌸','♡','💫'];
function spawnSparkleBurst(){
  const cx = window.innerWidth * (0.15 + Math.random()*0.7);
  const cy = window.innerHeight * (0.15 + Math.random()*0.6);
  const count = 6 + Math.floor(Math.random()*5);
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = sparkleChars[Math.floor(Math.random()*sparkleChars.length)];
    s.style.left = (cx + (Math.random()*60-30)) + 'px';
    s.style.top = (cy + (Math.random()*60-30)) + 'px';
    s.style.animationDelay = (Math.random()*0.2) + 's';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(), 1400);
  }
}

/* =====================================================================
   NUEVO: ÍCONOS QUE TIEMBLAN (glitch de "organizar íconos")
   ===================================================================== */
function triggerIconJiggle(){
  desktopEl.classList.remove('jiggle'); void desktopEl.offsetWidth;
  desktopEl.classList.add('jiggle');
  setTimeout(()=> desktopEl.classList.remove('jiggle'), 300);
}

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
document.getElementById('iconGlitchToggle').addEventListener('dblclick', ()=>{
  setGlitchEffectsEnabled(!glitchEffectsEnabled);
});
updateGlitchToggleIcon();

/* ---------------- BOOT SPLASH: se oculta tras cargar ---------------- */
const bootSplash = document.getElementById('bootSplash');
window.addEventListener('load', ()=>{
  setTimeout(()=>{
    bootSplash.style.transition = 'opacity .5s ease';
    bootSplash.style.opacity = '0';
    setTimeout(()=> bootSplash.remove(), 550);
  }, 2200);
});
