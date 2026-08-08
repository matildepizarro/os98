/* =====================================================================
   MODULO: js/02-glitches.js
   GLITCHES CON FORMAS NO CUADRADAS (gifs de Pompompurin)
   ===================================================================== */

/* =====================================================================
   NUEVO: GLITCHES CON FORMAS NO CUADRADAS (gifs de Pompompurin)
   ===================================================================== */
const hugMsgs = [
  'Matilde extraña tu clic... vuelve pronto 🥺',
  'kawaii-core.dll se quedó esperando un abrazo',
  'Error emocional: falta un abrazo para continuar',
  'Se perdió una función en camino... un abrazo la trae de vuelta',
];
function spawnHugGlitch(){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  const win = document.createElement('div');
  win.className = 'glitch-blob';
  win.style.setProperty('--tilt', (Math.random()*10-5).toFixed(1)+'deg');
  win.style.top = (14 + Math.random()*55) + '%';
  win.style.left = (8 + Math.random()*60) + '%';
  win.innerHTML = `
    <button class="gb-close">✕</button>
    <img src="${GIF_HUG}" alt="">
    <div class="gb-text">${hugMsgs[Math.floor(Math.random()*hugMsgs.length)]}</div>
  `;
  document.body.appendChild(win);
  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem blink';
  taskChip.textContent = '🤍 Abrazo pendiente';
  errWrap.appendChild(taskChip);
  function close(){ win.remove(); taskChip.remove(); openHeavyPopups--; }
  win.querySelector('.gb-close').addEventListener('click', close);
  setTimeout(close, 7000);
}

const headphoneMsgs = [
  'winamp-groove.drv sigue bailando sin ti',
  'Códec kawaii cargando la próxima canción...',
  'VOL98.SYS: el groove nunca se detiene',
  'Reproduciendo un demo que nadie más ha escuchado',
];
function spawnHeadphonesGlitch(){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  const win = document.createElement('div');
  win.className = 'glitch-diamond';
  win.style.top = (12 + Math.random()*50) + '%';
  win.style.left = (10 + Math.random()*55) + '%';
  win.innerHTML = `
    <button class="gd-close">✕</button>
    <img src="${GIF_HEADPHONES}" alt="">
    <div class="gd-text">${headphoneMsgs[Math.floor(Math.random()*headphoneMsgs.length)]}</div>
  `;
  document.body.appendChild(win);
  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem blink';
  taskChip.textContent = '🎧 Winamp glitch';
  errWrap.appendChild(taskChip);
  function close(){ win.remove(); taskChip.remove(); openHeavyPopups--; }
  win.querySelector('.gd-close').addEventListener('click', close);
  setTimeout(close, 7000);
}

function spawnBubbleCheckin(){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  const win = document.createElement('div');
  win.className = 'glitch-bubble';
  win.style.top = (16 + Math.random()*55) + '%';
  win.style.left = (10 + Math.random()*60) + '%';
  win.innerHTML = `<img src="${GIF_BUBBLE}" alt="">だいじょうぶ？<br>¿todo bien por ahí?`;
  document.body.appendChild(win);
  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem';
  taskChip.textContent = '💬 ¿Todo bien?';
  errWrap.appendChild(taskChip);
  function close(){ win.remove(); taskChip.remove(); openHeavyPopups--; }
  win.addEventListener('click', close);
  setTimeout(close, 5000);
}

/* pompompurin saltarín rebotando por la pantalla, estilo logo DVD */
function spawnBounceCritter(){
  const el = document.createElement('img');
  el.src = GIF_JUMP;
  el.className = 'bounce-critter';
  let x = Math.random()*(window.innerWidth-56);
  let y = Math.random()*(window.innerHeight*0.5);
  let vx = (Math.random()>0.5?1:-1) * (2.4 + Math.random()*2);
  let vy = (Math.random()>0.5?1:-1) * (2.4 + Math.random()*2);
  el.style.left = x+'px'; el.style.top = y+'px';
  document.body.appendChild(el);
  let frames = 0;
  const maxFrames = 220 + Math.floor(Math.random()*140);
  function step(){
    x += vx; y += vy;
    if(x<=0 || x>=window.innerWidth-56) vx*=-1;
    if(y<=0 || y>=window.innerHeight-90) vy*=-1;
    el.style.left = x+'px'; el.style.top = y+'px';
    frames++;
    if(frames < maxFrames && el.isConnected){ requestAnimationFrame(step); }
    else{ el.remove(); }
  }
  requestAnimationFrame(step);
}

/* ---------------- CLIPPY ---------------- */
const clippy = document.getElementById('clippy');
const clippyText = document.getElementById('clippyText');
const clippyMsgsNeutral = [
  "Este sistema está dedicado al catálogo de Matilde Pizarro.",
  "Consejo: selecciona una fecha en el cartel principal para publicitar un show.",
  "Haz doble clic en los archivos de letras para leerlas completas.",
  "Puedes arrastrar cualquier ventana desde su barra de título.",
  "Consejo: usa la grabadora de sonido para dejar un registro de audio.",
  "Este es el disco debut de Matilde Pizarro, once canciones en total.",
];
const clippyMsgsLive = (show) => [
  `Función publicitada: Matilde Pizarro en ${show.lugar}, ${show.fecha}.`,
  "Sugerencia: abre una canción del escritorio para verla en el reproductor.",
  `Consejo: si quieres asistir, revisa los datos de ${show.lugar} en el cartel.`,
  "¿Quieres grabar un recuerdo de esta función con la grabadora de sonido?",
  "Haz doble clic en los archivos de letras para cantar junto a Matilde.",
  "Este show fue registrado en MATILDE_OS como función en publicidad activa.",
  show.organiza ? `Organiza: ${show.organiza}.` : "Puedes arrastrar cualquier ventana desde su barra de título.",
];
function showClippy(){
  const cpool = currentShow ? clippyMsgsLive(currentShow) : clippyMsgsNeutral;
  clippyText.textContent = cpool[Math.floor(Math.random()*cpool.length)];
  clippy.style.display = 'block';
  setTimeout(()=>{ clippy.style.display = 'none'; }, 7500);
}

/* ---------------- BSOD (varios mensajes, elegidos al azar) ---------------- */
const bsod = document.getElementById('bsod');
function bsodVariants(show){
  if(show){
    return [
`:-)

Se ha producido un error en MATILDE_OS

EL SISTEMA ESTÁ PUBLICITANDO UNA FUNCIÓN EN VIVO (0x0000005A)

Matilde Pizarro — ${show.fecha} — ${show.lugar}.
${show.organiza ? `Organiza ${show.organiza}.` : ''}

Presiona cualquier tecla para continuar...

_`,
`:-)

MATILDE_OS ha encontrado un problema y necesita reiniciar kawaii-core.dll

La función publicitada actualmente no se ve afectada:
Matilde Pizarro en ${show.lugar}, ${show.fecha}.

Presiona cualquier tecla para continuar...

_`,
`:-)

STOP: 0x0000BEBE — DISCO_DEBUT_COMPLETO.MP3

El sistema no pudo cargar el disco completo a tiempo.
Función publicitada: ${show.lugar}, ${show.fecha}.

Presiona cualquier tecla para continuar...

_`,
    ];
  }
  return [
`:-)

Se ha producido un error en MATILDE_OS

NO HAY NINGUNA FUNCIÓN SELECCIONADA (0x0000005A)

Este sistema está dedicado al catálogo de Matilde Pizarro.
Selecciona una fecha en el cartel principal para publicitar un show.

Presiona cualquier tecla para continuar...

_`,
`:-)

MATILDE_OS ha encontrado un problema y necesita reiniciar kawaii-core.dll

Esto no afecta el catálogo de Matilde Pizarro guardado en el sistema.

Presiona cualquier tecla para continuar...

_`,
`:-)

STOP: 0x0000BEBE — DISCO_DEBUT_COMPLETO.MP3

El sistema no pudo cargar el disco completo a tiempo.
Vuelve a intentarlo desde el escritorio.

Presiona cualquier tecla para continuar...

_`,
  ];
}
function flashBSOD(){
  const variants = bsodVariants(currentShow);
  bsod.innerHTML = variants[Math.floor(Math.random()*variants.length)];
  bsod.style.display = 'block';
  setTimeout(()=>{ bsod.style.display = 'none'; }, 3800);
}

/* ---------------- SCREEN FLASH / SHAKE ---------------- */
const screenflash = document.getElementById('screenflash');
function triggerFlash(){
  screenflash.classList.remove('hit'); void screenflash.offsetWidth; screenflash.classList.add('hit');
}
function triggerShake(){
  mainWin.classList.remove('shake'); void mainWin.offsetWidth; mainWin.classList.add('shake');
  setTimeout(()=>mainWin.classList.remove('shake'), 160);
}

/* ---------------- GLITCH SCANLINE OVERLAY ---------------- */
const glitchOverlay = document.getElementById('glitchOverlay');
function triggerScanGlitch(){
  glitchOverlay.classList.add('on');
  setTimeout(()=>glitchOverlay.classList.remove('on'), 140);
}

/* ---------------- HOURGLASS CURSOR ---------------- */
function triggerHourglass(){
  document.body.classList.add('wait');
  setTimeout(()=>document.body.classList.remove('wait'), 700);
}

/* ---------------- FAKE DEFRAG / RESOURCE DROP ---------------- */
const resPct = document.getElementById('resPct');
function triggerResourceDrop(){
  const val = 20 + Math.floor(Math.random()*40);
  resPct.textContent = val + '%';
  setTimeout(()=>{ resPct.textContent = '100%'; }, 1800);
}

/* ---------------- 3D PIPES SCREENSAVER ---------------- */
const screensaver = document.getElementById('screensaver');
const ssPipe = document.getElementById('ssPipe');
function triggerScreensaver(){
  screensaver.style.display = 'block';
  let x = Math.random()*window.innerWidth, y = Math.random()*window.innerHeight;
  let vx = (Math.random()>0.5?1:-1)*6, vy = (Math.random()>0.5?1:-1)*6;
  let hue = Math.floor(Math.random()*360);
  let frames = 0;
  function step(){
    x += vx; y += vy; hue = (hue+6)%360;
    if(x<0||x>window.innerWidth-120){ vx*=-1; }
    if(y<0||y>window.innerHeight-14){ vy*=-1; }
    ssPipe.style.left = x+'px'; ssPipe.style.top = y+'px';
    ssPipe.style.background = `hsl(${hue},100%,50%)`;
    ssPipe.style.boxShadow = `0 0 10px hsl(${hue},100%,50%)`;
    frames++;
    if(frames < 45){ requestAnimationFrame(step); }
    else { screensaver.style.display = 'none'; }
  }
  step();
}
