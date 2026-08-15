/* =====================================================================
   MODULO: js/01-core.js
   CORE — constantes globales, assets, boot sequence, setup base del sistema
   ===================================================================== */


/* ---------------- LETRAS: datos de las 11 canciones ---------------- */
const SONGS = [
  { num:"01", title:"LUNAR", filename:"01_LUNAR.txt", lyrics:"CUANDO EL TIEMPO ESTÁ\nIGUAL QUE TU MENTE\nNO CONFÍAS NI EN TI MISMA\nLOS TRES CAMINOS QUE\nME VAN A SEGUIR DE CERCA\nPARA SABER SI RESPIRE\nNADA DE MÍ SE VE\nNADA DE MÍ ESTÁ\nNADA DE MÍ SE VE\nNADA DE MÍ ESTÁ\nMIS PENSAMIENTOS VAN\nBUSCANDO UN LUGAR PARA CAER\nEN MIL MOMENTOS\nNO HAY QUE PROYECTAR\nNINGUNA IMAGEN MÁS\nSI TE DESCUBREN VAS A FALLAR\nNADA DE MÍ SE VE\nNADA DE MÍ ESTÁ\nNADA DE MÍ SE VE\nNADA DE MÍ ESTÁ" },
  { num:"02", title:"LOS CAMINOS", filename:"02_LOS_CAMINOS.txt", lyrics:"NOTAS AZULES, TAN PERDIDAS\nSEGUIR CUMPLIENDO EN LA CAMA VACÍA\nHAY UN ABISMO ENTRE EL SOL Y TÚ, Y TÚ\nOLVIDAR TU ADICCIÓN\nSE DETIENEN MIS OÍDOS\nOLVIDAR TU ADICCIÓN\nSE DETIENEN MIS OÍDOS\nEN OTRO LADO ESTÁ EL PELIGRO\nEN OTRO LADO ESTÁ EL PELIGRO\nEN OTRO LADO ESTÁ EL PELIGRO\nY SI NO PUEDO AGUANTAR\nLOS CAMINOS QUE HICE AL ANDAR\nY SI NO PUEDO AGUANTAR\nLOS CAMINOS QUE HICE AL ANDAR\nLOS CAMINOS, LOS CAMINOS\nLOS CAMINOS, LOS CAMINOS" },
  { num:"03", title:"INCÓGNITO", filename:"03_INCOGNITO.txt", lyrics:"LAS NUBES DESTRUYERON\nMI CARA Y EL OPTIMISMO\nCON BALAS Y BALADAS\nPERO TAL VEZ PENSANDO TODA LA NOCHE\n¿ENTIENDES DÓNDE ESTOY?\n¿PUEDO OCULTARME, CONTIGO?" },
  { num:"04", title:"OCELO", filename:"04_OCELO.txt", lyrics:"TODA EL AGUA PARA MÍ\nGIRAN MIS OJOS AL MORIR\nMI PESAR ES QUE LA LENGUA\nSE QUEMA CADA VEZ QUE MUERO\nFIN DE LOS DEDOS EN TU FRENTE\nDESPERTAR LA MENTE EN TRES\nY DORMIR TODOS LOS DÍAS\nPENSANDO QUE VOY A MORIR Y MIRAR." },
  { num:"05", title:"FONDO", filename:"05_FONDO.txt", lyrics:"ENTORNO A LAS VENTANAS\nUN INFIERNO ESTOY VIENDO HOY\nCAMBIASTE EL PASADO\nPIDIENDO DISCULPAS\nPORQUE AQUÍ ESTOY\nSE CAE EL SOL QUE HAY EN MÍ\nSE CAE EL SOL QUE HAY EN MÍ\nSÉ QUE DEBERÍA SER FUERTE\nAUNQUE NO TENGA NI VOZ\nSOÑANDO DESPIERTA\nEN EL FONDO CAYENDO VOY\nSE CAE EL SOL QUE HAY EN MÍ\nSE CAE EL SOL QUE HAY EN MÍ" },
  { num:"06", title:"TEXTURAS", filename:"06_TEXTURAS.txt", lyrics:"VAYAMOS A LA ESPERA\nTODO LO QUE HACEMOS\nESTÁ AL LÍMITE DEL UNIVERSO\nLAS TORMENTAS DE LO ETÉREO\nRECHAZANDO LA INTENSIDAD\nESTOY AQUÍ PARA ESTA VIDA\nY AHORA QUE ESTÁS AQUÍ\n¿POR QUÉ VAMOS A SUFRIR?\nTAL VEZ TE ESTÁS HUNDIENDO\nEN TEXTURAS\nY AHORA QUE ESTÁS AQUÍ\n¿POR QUÉ VAMOS A SUFRIR?\nTAL VEZ TE ESTÁS HUNDIENDO\nEN TEXTURAS" },
  { num:"07", title:"OCASO CIRCULAR", filename:"07_OCASO_CIRCULAR.txt", lyrics:"EL RIZADO DE MI MENTE\nSE OCULTA EN TU PENSAR\nQUÉ VA A PASAR CON NOSOTRAS\nSI ARRUINAMOS LA OPORTUNIDAD\nARRIBA DEL BOSQUE NOS VAMOS A OCULTAR\nARRIBA DEL BOSQUE NOS VAMOS A OCULTAR\nSALVA TU VIDA Y LA DEL MONTE\nSALVA TU VIDA Y LA DEL MONTE\nHOJAS LLENAS DE SAL\nHOJAS LLENAS DE SAL\nHOJAS LLENAS DE SAL\nHOJAS LLENAS DE SAL\nHOJAS LLENAS DE SAL" },
  { num:"08", title:"LETARGO", filename:"08_LETARGO.txt", lyrics:"TUS PIEDRAS NOS MANDARON\nTÚ ME HACES LLORAR PROFUNDO\nTODO ES IGUAL UN MAR DE FRUSTRACIONES YA\nNUNCA ME APLASTEN EN APLAUSOS\nTAN LEJOS QUIERES IR\nTAN ALTO, PARA IR A CANTAR\nCUÁNTOS CIELOS HAY\nSI ESTÁN ALTOS, NO ME IMPORTA\nTUS PIEDRAS NOS MANDARON\nTÚ ME HACES LLORAR PROFUNDO\nTODO ES IGUAL UN MAR DE FRUSTRACIONES YA\nNUNCA ME APLASTEN EN APLAUSOS\nTAN LEJOS QUIERES IR\nTAN ALTO, PARA IR A CANTAR\nCUÁNTOS CIELOS HAY\nSI ESTÁN ALTOS, NO ME IMPORTA" },
  { num:"09", title:"VUELO", filename:"09_VUELO.txt", lyrics:"DIME EN DÓNDE ESTÁS\nDIME QUÉ MÁS DA\nDIME A DÓNDE ENCUENTRO LO QUE BUSCO EN REALIDAD\nUN BESO SIN HABLAR\nALGO QUEDARÁ\nMI LUGAR ES EN TUS OJOS\nDULCES Y PROFUNDOS\nVUELO, SIN ALAS ESTA VEZ\nVUELO, DONDE YO PUEDA CAER\nVUELO" },
  { num:"10", title:"LLAMAS", filename:"10_LLAMAS.txt", lyrics:"MIRANDO EL REFLEJO\nEN LA LLAMA DEL SOL\nHAY ALGO QUE ESTÁ PASANDO\nENTRE LAS DOS\nNUNCA SUPUSE DÓNDE ESTOY\nYA NO ESTÁS, PERDIDA HOY\nQUIERO SACARTE DE AHÍ\nMIRANDO EL REFLEJO\nEN LA LLAMA DEL SOL\nHAY ALGO QUE ESTÁ PASANDO\nENTRE LAS DOS\nNUNCA SUPUSE DÓNDE ESTOY\nYA NO ESTÁS, PERDIDA HOY\nQUIERO SACARTE DE AHÍ" },
  { num:"11", title:"EL FINAL", filename:"11_EL_FINAL.txt", lyrics:"TE ALEJASTE Y ME TRAICIONASTE\nME HICISTE ROMPER MIS PASIONES\nAHOGADA EN POCO TIEMPO\nTE HUNDISTE EN TUS ACCIONES\nY YA QUE NO PUEDES CONTROLARTE\nY YA QUE NO PUEDES CONTROLARME" },
];

/* ---------------- FUNCIONES: fechas/lugares que se pueden publicitar ----------------
   El sistema no asume que hay un show en vivo por defecto: hay que elegir cuál
   función se está publicitando para que el resto de la interfaz (mensajes de error,
   marquesina, cartel) hable de manera coherente sobre ESA fecha en particular. */
const POSTER_IMAGES = {
  pimenton: "assets/img/poster-pimenton.jpg",
  misp: "assets/img/poster-misp.jpg",
};
const SHOWS = [
  { id:"pimenton", fecha:"05/08/2026", lugar:"El Pimentón — Av. Ecuador 27, Valparaíso", horario:"Puertas 19:30 hrs · Show 20:00 hrs", organiza:"@estoeslaonce", poster:{ file:"AFICHE_PIMENTON.JPG", img:"posterImg", caption:"El Pimentón — Av. Ecuador 27, Valparaíso · Miércoles 5 de Agosto" } },
  { id:"cerveceria", fecha:"03/01/2026", lugar:"Cervecería Popular, Valparaíso", horario:"Por confirmar", organiza:"" },
  { id:"gizzday", fecha:"28/02/2026", lugar:"Gizzday Volumen 3, Valparaíso", horario:"Por confirmar", organiza:"" },
  { id:"sesion", fecha:"28/03/2026", lugar:"La Sesión Café, Villa Alemana", horario:"Por confirmar", organiza:"" },
  { id:"journal", fecha:"20/05/2026", lugar:"Journal, Viña del Mar", horario:"Por confirmar", organiza:"" },
  { id:"puertaamarilla", fecha:"30/05/2026", lugar:"La Puerta Amarilla, Santiago", horario:"Por confirmar", organiza:"" },
  { id:"hotzenplotz", fecha:"18/06/2026", lugar:"Hotzenplotz Bar, Valparaíso", horario:"Por confirmar", organiza:"" },
  { id:"marchalgbt", fecha:"27/06/2026", lugar:"Marcha LGBT, Viña del Mar", horario:"Por confirmar", organiza:"" },
  { id:"misp", fecha:"14/08/2026", lugar:"Café Misp — Victoria 797, Villa Alemana", horario:"18:00 hrs · Entrada liberada", organiza:"Café Misp — Pastelería & Cafetería", poster:{ file:"AFICHE_MISP.JPG", img:"posterImgMisp", caption:"Café Misp — Victoria 797, Villa Alemana · Viernes 14 de Agosto" } },
];
let currentShow = null; // null = ninguna función seleccionada todavía

const ERROR_VIDEO_SRC = "assets/video/error-glitch.mp4";

const GIF_HUG = "assets/gif/hug.gif";
const GIF_HEADPHONES = "assets/gif/headphones.gif";
const GIF_JUMP = "assets/gif/jump.gif";
const GIF_BUBBLE = "assets/gif/bubble.gif";

function getShowById(id){ return SHOWS.find(s=>s.id===id) || null; }

/* ---------------- CUMPLEAÑOS: 14/08/2026 — 30 años de Matilde Pizarro ----------------
   IMPORTANTE: birthdayTriggered se declara ANTES de tickClock()/setInterval() de abajo.
   Antes estaba declarada después, y como tickClock() se llamaba inmediatamente
   (¡antes de que existiera la variable!), tiraba un ReferenceError de "temporal
   dead zone" que cortaba TODO el script en seco — por eso no andaba ni el menú
   de inicio ni la webcam ni nada más de lo que viene después en este archivo. */
let birthdayTriggered = false;
function checkBirthday(d){
  const isBirthdayDate = d.getDate() === 14 && d.getMonth() === 7 && d.getFullYear() === 2026;
  if(isBirthdayDate && !birthdayTriggered){
    birthdayTriggered = true;
    launchBirthdayCelebration();
  }
}

/* ---------------- CLOCK ---------------- */
function tickClock(){
  const d = new Date();
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  document.getElementById('clock').textContent = `${hh}:${mm}`;
  checkBirthday(d);
}
tickClock(); setInterval(tickClock, 1000);
function launchBirthdayCelebration(){
  // ráfaga de confeti kawaii repetida
  let bursts = 0;
  const burstInterval = setInterval(()=>{
    spawnSparkleBurst();
    bursts++;
    if(bursts >= 14){ clearInterval(burstInterval); } // 14 = día del cumpleaños, por qué no
  }, 350);

  spawnToast('🎂 ¡FELIZ CUMPLEAÑOS, MATILDE! HOY CUMPLES 30 AÑOS 🎉');

  spawnErrorPopupCustom(
    'Sistema ONCE_OS™',
    '🎉🎂 <b>¡FELIZ CUMPLEAÑOS!</b> 🎂🎉<br><br>Hoy, 14/08/2026, Matilde Pizarro cumple <b>30 años</b>.<br><br>Se ha instalado <b>CONFETI_98.exe</b> automáticamente para la ocasión.'
  );
}

/* ---------------- SELECTOR DE FUNCIÓN: qué show se está publicitando ---------------- */
const showSelect = document.getElementById('showSelect');
const posterStatus = document.getElementById('posterStatus');
const fieldFecha = document.getElementById('fieldFecha');
const fieldLugar = document.getElementById('fieldLugar');
const fieldHorario = document.getElementById('fieldHorario');

(function populateShowSelect(){
  const optNone = document.createElement('option');
  optNone.value = ''; optNone.textContent = '— Selecciona una función —';
  showSelect.appendChild(optNone);
  SHOWS.forEach(s=>{
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.fecha} — ${s.lugar}`;
    showSelect.appendChild(opt);
  });
})();

function applyShow(id){
  currentShow = getShowById(id);
  if(!currentShow){
    posterStatus.textContent = 'SISTEMA EN ESPERA — SIN FUNCIÓN SELECCIONADA';
    fieldFecha.textContent = '—';
    fieldLugar.textContent = '—';
    fieldHorario.textContent = '—';
  } else {
    posterStatus.textContent = '🔴 PUBLICITANDO FUNCIÓN EN VIVO';
    fieldFecha.textContent = currentShow.fecha;
    fieldLugar.textContent = currentShow.lugar;
    fieldHorario.textContent = currentShow.horario + (currentShow.organiza ? ` · Organiza ${currentShow.organiza}` : '');
  }
  refreshMarquee();
}
showSelect.addEventListener('change', ()=>{
  applyShow(showSelect.value);
  if(currentShow && currentShow.poster && typeof openPosterWin === 'function'){
    openPosterWin(currentShow);
  }
});

/* ---------------- WINDOW: cerrar de verdad + íconos del escritorio para reabrir ---------------- */
const mainWin = document.getElementById('mainWin');
const taskMain = document.getElementById('taskMain');

function openMainWin(){
  mainWin.style.display = '';
  mainWin.style.zIndex = ++dragZ;
  if(taskMain) taskMain.style.display = '';
}
function closeMainWin(){
  mainWin.style.display = 'none';
  if(taskMain) taskMain.style.display = 'none';
}
document.getElementById('closeBtn').addEventListener('click', closeMainWin);
if(taskMain) taskMain.addEventListener('click', ()=>{
  if(mainWin.style.display === 'none'){ openMainWin(); }
  else { mainWin.style.zIndex = ++dragZ; }
});

const recWin = document.getElementById('recWin');
document.getElementById('recCloseBtn').addEventListener('click', ()=>{
  recWin.style.display = 'none';
});

const iconPublicitador = document.getElementById('iconPublicitador');
if(iconPublicitador) iconPublicitador.addEventListener('dblclick', openMainWin);

const iconMainExe = document.getElementById('iconMainExe');
if(iconMainExe) iconMainExe.addEventListener('dblclick', openMainWin);

const iconGrabadora = document.getElementById('iconGrabadora');
if(iconGrabadora) iconGrabadora.addEventListener('dblclick', ()=>{
  recWin.style.display = '';
  recWin.style.zIndex = ++dragZ;
});

const iconWebcam = document.getElementById('iconWebcam');
if(iconWebcam) iconWebcam.addEventListener('dblclick', ()=>{
  const wc = document.getElementById('webcamWin');
  if(wc){ wc.style.display = ''; wc.style.zIndex = ++dragZ; }
});

/* ---------------- GRABADORA DE SONIDO (real, exporta WAV) ---------------- */
const recBtn = document.getElementById('recBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadBtn = document.getElementById('downloadBtn');
const recStatus = document.getElementById('recStatus');
const recTime = document.getElementById('recTime');

let recStream = null;
let recCtx = null;
let recSourceNode = null;
let recProcessor = null;
let recChunksL = [];
let recChunksR = [];
let recSampleRate = 44100;
let recording = false;
let recStartTime = 0;
let recTimerHandle = null;
let lastWavBlob = null;

function fmtTime(sec){
  const m = String(Math.floor(sec/60)).padStart(2,'0');
  const s = String(Math.floor(sec%60)).padStart(2,'0');
  return `${m}:${s}`;
}

async function startRecording(){
  try{
    recStatus.textContent = 'Solicitando micrófono...';
    recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recCtx = new (window.AudioContext || window.webkitAudioContext)();
    recSampleRate = recCtx.sampleRate;
    recSourceNode = recCtx.createMediaStreamSource(recStream);
    recProcessor = recCtx.createScriptProcessor(4096, 1, 1);
    recChunksL = [];

    recSourceNode.connect(recProcessor);
    recProcessor.connect(recCtx.destination);

    recProcessor.onaudioprocess = (e)=>{
      const input = e.inputBuffer.getChannelData(0);
      recChunksL.push(new Float32Array(input));
    };

    recording = true;
    recStartTime = Date.now();
    recStatus.textContent = 'Grabando al público en vivo...';
    recBtn.classList.add('recording');
    recBtn.disabled = true;
    stopBtn.disabled = false;
    downloadBtn.disabled = true;

    recTimerHandle = setInterval(()=>{
      recTime.textContent = fmtTime((Date.now()-recStartTime)/1000);
    }, 250);

  }catch(err){
    recStatus.textContent = 'Acceso al micrófono denegado.';
  }
}

function stopRecording(){
  if(!recording) return;
  recording = false;
  clearInterval(recTimerHandle);
  recStatus.textContent = 'Procesando grabación...';

  recProcessor.disconnect();
  recSourceNode.disconnect();
  recStream.getTracks().forEach(t=>t.stop());

  const wavBlob = encodeWavFromChunks(recChunksL, recSampleRate);
  lastWavBlob = wavBlob;

  recStatus.textContent = 'Grabación lista para exportar.';
  recBtn.classList.remove('recording');
  recBtn.disabled = false;
  stopBtn.disabled = true;
  downloadBtn.disabled = false;
}

function downloadRecording(){
  if(!lastWavBlob) return;
  const url = URL.createObjectURL(lastWavBlob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g,'-');
  a.href = url;
  a.download = `matilde-pizarro-show-${stamp}.wav`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 4000);
}

/* Codifica los chunks Float32 capturados en un WAV PCM 16-bit mono, sin librerías externas */
function encodeWavFromChunks(chunks, sampleRate){
  let totalLength = 0;
  chunks.forEach(c=> totalLength += c.length);

  const merged = new Float32Array(totalLength);
  let offset = 0;
  chunks.forEach(c=>{ merged.set(c, offset); offset += c.length; });

  const buffer = new ArrayBuffer(44 + merged.length * 2);
  const view = new DataView(buffer);

  function writeString(v, off, str){
    for(let i=0;i<str.length;i++) v.setUint8(off+i, str.charCodeAt(i));
  }

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + merged.length*2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);       // PCM
  view.setUint16(22, 1, true);       // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate*2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, merged.length*2, true);

  let idx = 44;
  for(let i=0;i<merged.length;i++, idx+=2){
    let s = Math.max(-1, Math.min(1, merged[i]));
    view.setInt16(idx, s < 0 ? s*0x8000 : s*0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

recBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
downloadBtn.addEventListener('click', downloadRecording);

/* ---------------- START MENU ---------------- */
const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');
let startOpen = false;
startBtn.addEventListener('click', ()=>{
  startOpen = !startOpen;
  startMenu.style.display = startOpen ? 'block' : 'none';
  startBtn.classList.toggle('active', startOpen);
  if(!startOpen){ const pm = document.getElementById('programsMenu'); if(pm) pm.style.display = 'none'; }
});
document.addEventListener('click', (e)=>{
  if(startOpen && !startMenu.contains(e.target) && e.target !== startBtn && !startBtn.contains(e.target)){
    startOpen = false; startMenu.style.display='none'; startBtn.classList.remove('active');
    const pm = document.getElementById('programsMenu'); if(pm) pm.style.display = 'none';
  }
});

/* ---------------- ERROR POPUPS ---------------- */
const errWrap = document.getElementById('errTaskWrap');
let errWinId = 0;
let openHeavyPopups = 0;
const MAX_HEAVY_POPUPS = 3;
const errorMessagesNeutral = [
  ["Excepción no controlada", "RISA32.DLL generó un desbordamiento de pila al intentar procesar el catálogo de <b>Matilde Pizarro</b>. El sistema se recuperó sin pérdida de datos."],
  ["Advertencia del sistema", "El proceso MATILDE_OS.EXE está usando más recursos de los previstos. Ninguna función está siendo publicitada en este momento."],
  ["Fallo de memoria", "No hay suficiente memoria para cargar el disco debut completo. Cierre algunas ventanas de letras e inténtelo de nuevo."],
  ["MATILDE_OS", "Este sistema está dedicado íntegramente a <b>Matilde Pizarro</b>. Selecciona una fecha en el cartel principal para publicitar un show."],
  ["Winamp.exe", "El ecualizador está inactivo: no hay ninguna pista marcada como reproduciéndose. Abre un archivo del escritorio para activarlo."],
  ["kaset98.sys", "El casete virtual se atascó rebobinando. Prueba abrir otra canción desde el escritorio."],
  ["FLOPPY_A:\\", "No se puede expulsar el disquete: contiene el archivo de fechas de <b>Matilde Pizarro</b> y está en uso."],
  ["Papelera de reciclaje", "La papelera está vacía. No hay nada pendiente de eliminar."],
  ["Protector de pantalla", "Los tubos 3D no se activaron: hubo actividad reciente en el sistema."],
];
const errorMessagesLive = (show) => [
  ["Excepción no controlada", `RISA32.DLL generó un desbordamiento de pila: <b>Matilde Pizarro</b> se está publicitando en vivo en ${show.lugar}, ${show.fecha}.`],
  ["Advertencia del sistema", `El sistema está publicitando activamente el show de <b>Matilde Pizarro</b> en ${show.lugar} (${show.fecha}). Esta ventana se puede cerrar sin afectar la función.`],
  ["Fallo de memoria", `No hay suficiente memoria para cargar el disco debut completo mientras se publicita ${show.lugar}.`],
  ["MATILDE_OS", `Función confirmada: <b>Matilde Pizarro</b> — ${show.fecha} — ${show.lugar}.${show.organiza ? ` Organiza ${show.organiza}.` : ''}`],
  ["Winamp.exe", "El ecualizador detectó actividad en el catálogo de Matilde Pizarro. Abre una pista del escritorio para verla en el reproductor."],
  ["kaset98.sys", `El casete virtual se atascó rebobinando la fecha de ${show.lugar}. Prueba abrir otra canción desde el escritorio.`],
  ["FLOPPY_A:\\", `No se puede expulsar el disquete: contiene los datos de la función en ${show.lugar}.`],
  ["Papelera de reciclaje", "La papelera está vacía. No hay nada pendiente de eliminar."],
  ["Protector de pantalla", `Los tubos 3D no se activaron: hay una función publicitada en ${show.lugar} y el sistema prioriza mostrarla.`],
];

function spawnErrorPopup(){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  errWinId++;
  const pool = currentShow ? errorMessagesLive(currentShow) : errorMessagesNeutral;
  const [title, msg] = pool[Math.floor(Math.random()*pool.length)];
  const win = document.createElement('div');
  win.className = 'win errwin';
  win.style.top = (18 + Math.random()*38) + '%';
  win.style.left = (8 + Math.random()*50) + '%';
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> ${title}</div>
      <div class="winbtns"><button class="errclose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="errbody">
        <div class="icoerr">!</div>
        <div class="errtext">${msg}</div>
      </div>
      <div class="errbtnrow"><button class="btn98 errok">Aceptar</button></div>
    </div>
  `;
  document.body.appendChild(win);

  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem blink';
  taskChip.textContent = '⚠ ' + title;
  errWrap.appendChild(taskChip);

  function close(){ win.remove(); taskChip.remove(); openHeavyPopups--; }
  win.querySelector('.errclose').addEventListener('click', close);
  win.querySelector('.errok').addEventListener('click', close);
  setTimeout(close, 9000);
}

/* ---------------- VIRUS CHISTOSO ---------------- */
let virusWinId = 0;
const virusMessagesNeutral = [
  ["VIRUS: DISCO_DEBUT.EXE", "Este archivo indexó <b>todas las canciones del disco debut</b> de Matilde Pizarro en el escritorio. No causa daños al sistema."],
  ["W98.KAWAII.SPARKLE", "Este proceso solo esparce brillantina digital por el escritorio cada cierto tiempo. Efecto secundario: ninguno grave."],
  ["MACRO: APLAUSOS.BAS", "Se ejecutó un macro decorativo sin efecto real sobre el sistema."],
  ["W98.LUNAR.OVERLAY", "Se detectó una superposición gráfica inspirada en la canción \"LUNAR\". Riesgo: cero."],
  ["ALERTA DE SEGURIDAD", "Actividad detectada: el catálogo de <b>Matilde Pizarro</b> sigue instalado en este sistema. Nivel de riesgo: nulo."],
];
const virusMessagesLive = (show) => [
  ["W98.SHOW.WORM", `Este proceso publicita la función de <b>Matilde Pizarro</b> en ${show.lugar} (${show.fecha}). No afecta el rendimiento del sistema.`],
  ["VIRUS: DISCO_DEBUT.EXE", "Este archivo indexó <b>todas las canciones del disco debut</b> de Matilde Pizarro en el escritorio. No causa daños al sistema."],
  ["ALERTA DE SEGURIDAD", `Se detectó una función activa en publicidad: <b>${show.lugar}, ${show.fecha}</b>. Nivel de riesgo: nulo.`],
  ["TROYANO: RESERVA.DLL", `Este proceso recuerda la fecha publicitada${show.organiza ? ` y su organizador (${show.organiza})` : ''}: ${show.lugar}, ${show.fecha}.`],
  ["W98.KAWAII.SPARKLE", "Este proceso solo esparce brillantina digital por el escritorio cada cierto tiempo. Efecto secundario: ninguno grave."],
  ["MACRO: APLAUSOS.BAS", "Se ejecutó un macro decorativo sin efecto real sobre el sistema."],
  ["W98.LUNAR.OVERLAY", "Se detectó una superposición gráfica inspirada en la canción \"LUNAR\". Riesgo: cero."],
];

function spawnVirusPopup(){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  virusWinId++;
  const vpool = currentShow ? virusMessagesLive(currentShow) : virusMessagesNeutral;
  const [title, msg] = vpool[Math.floor(Math.random()*vpool.length)];
  const win = document.createElement('div');
  win.className = 'win viruswin';
  win.style.top = (12 + Math.random()*48) + '%';
  win.style.left = (6 + Math.random()*55) + '%';
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> ${title}</div>
      <div class="winbtns"><button class="virusclose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="virusbody">
        <div class="icovirus">🐛</div>
        <div class="virustext">${msg}</div>
      </div>
      <div class="virusbtnrow">
        <button class="btn98 virusok">Aceptar el destino</button>
        <button class="btn98 virusclose">Ignorar (no sirve)</button>
      </div>
    </div>
  `;
  document.body.appendChild(win);

  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem blink';
  taskChip.textContent = '🐛 ' + title;
  errWrap.appendChild(taskChip);

  function close(){ win.remove(); taskChip.remove(); openHeavyPopups--; }
  win.querySelectorAll('.virusclose').forEach(b=>b.addEventListener('click', close));
  win.querySelector('.virusok').addEventListener('click', close);
  setTimeout(close, 10000);
}

/* ---------------- ERROR DE VIDEO (ventana emergente con el video del show) ---------------- */
const videoErrorTitles = [
  "Error de video — MATILDE_OS",
  "Códec de video no reconocido",
  "VID98.DLL — excepción",
  "Reproductor de video de MATILDE_OS",
];
function spawnVideoErrorPopup(){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  const title = videoErrorTitles[Math.floor(Math.random()*videoErrorTitles.length)];
  const win = document.createElement('div');
  win.className = 'win errwin videowin';
  win.style.top = (10 + Math.random()*46) + '%';
  win.style.left = (6 + Math.random()*54) + '%';
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> ${title}</div>
      <div class="winbtns"><button class="errclose">✕</button></div>
    </div>
    <div class="win-body">
      <div style="font-size:11px; margin-bottom:6px;">Se encontró un archivo de video sin catalogar en el escritorio de Matilde Pizarro.</div>
      <video src="${ERROR_VIDEO_SRC}" autoplay muted loop playsinline style="border:2px inset #fff; background:#000;"></video>
      <div class="errbtnrow"><button class="btn98 errok">Aceptar</button></div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 160);

  // NUEVO: cada vez que aparece, el video arranca en un punto distinto (no siempre desde 0)
  const vidEl = win.querySelector('video');
  if(vidEl){
    vidEl.addEventListener('loadedmetadata', ()=>{
      if(vidEl.duration && isFinite(vidEl.duration) && vidEl.duration > 0.5){
        vidEl.currentTime = Math.random() * (vidEl.duration - 0.3);
      }
    });
  }

  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem blink';
  taskChip.textContent = '🎬 ' + title;
  errWrap.appendChild(taskChip);

  function close(){ win.remove(); taskChip.remove(); openHeavyPopups--; }
  win.querySelector('.errclose').addEventListener('click', close);
  win.querySelector('.errok').addEventListener('click', close);
  setTimeout(close, 13000);
}

