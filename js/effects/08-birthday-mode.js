/* =====================================================================
   MODULO: js/effects/08-birthday-mode.js
   MODO "CUMPLEAÑOS 30" — interruptor permanente tipo "Efectos de virus":
   mientras está ENCENDIDO, dispara efectos de cumpleaños al azar cada
   pocos segundos, de forma continua, pensado para dejarlo corriendo de
   fondo durante toda la fiesta de los 30 años de Matilde Pizarro.
   Ahora con mucha más variedad de chistes y efectos para que no se sienta
   repetitivo en una fiesta de varias horas.
   ===================================================================== */

const BIRTHDAY_CONFETTI_EMOJI = ['🎉','🎂','🎈','✨','💗','🌸','🎊','💛','🥳','🍰','🎁','⭐'];

const BIRTHDAY_TOAST_MESSAGES = [
  '🎂 ¡30 años de Matilde Pizarro!',
  '🎉 ¡Que siga la fiesta!',
  '💗 ¡Feliz cumpleaños, Matilde!',
  '✨ Nivel de kawaii-core.dll: máximo festejo.',
  '🎈 CONFETI_98.exe sigue instalado y funcionando.',
  '🌸 30 años de puro talento.',
  '🥳 Alerta: exceso de felicidad detectado.',
  '🍰 Se recomienda una porción de torta cada 20 minutos.',
  '🎁 Regalo pendiente: seguir siendo increíble.',
  '💃 El sistema certifica: sigue teniendo el groove intacto a los 30.',
  '🕰️ 30 años != vieja. 30 años == versión mejorada.',
  '🎶 Reproduciendo "Vuelo" a todo volumen, como debe ser.',
  '🧁 Advertencia: nivel de dulzura fuera de escala.',
  '📼 30 años de historial de reproducción sin un solo salto en falso.',
  '🎊 Este mensaje se auto-destruirá... nunca, porque hoy se celebra.',
];

const BIRTHDAY_RIBBON_TEXTS = [
  '🎉 ¡FELICES 30 AÑOS, MATILDE PIZARRO! 🎂 ✨ 30 AÑOS DE PURO TALENTO ✨ 🎉',
  '🥳 SE BUSCA: EL PASTEL. SE ENCONTRÓ: LA LEYENDA. 🎂 FELIZ CUMPLEAÑOS 🎂',
  '💗 30 AÑOS, INFINITAS CANCIONES POR VENIR 💗 🎶 MATILDE PIZARRO 🎶',
  '🎈 ERROR 404: VELAS NO ENCONTRADAS (SON DEMASIADAS) 🎈 FELIZ CUMPLE 🎈',
];

/* ---------------- piezas visuales reutilizables ---------------- */
function spawnBirthdayConfettiPiece(){
  const el = document.createElement('div');
  el.className = 'birthdayConfettiPiece';
  el.textContent = BIRTHDAY_CONFETTI_EMOJI[Math.floor(Math.random()*BIRTHDAY_CONFETTI_EMOJI.length)];
  el.style.left = (Math.random()*100) + 'vw';
  const duration = 2.4 + Math.random()*2.2;
  el.style.animationDuration = duration + 's';
  el.style.fontSize = (14 + Math.random()*14) + 'px';
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), duration*1000 + 100);
}
function spawnBirthdayConfettiBurst(){
  const count = 4 + Math.floor(Math.random()*4);
  for(let i=0;i<count;i++) spawnBirthdayConfettiPiece();
}

function spawnBirthdayRibbon(){
  // evita amontonar cintas si ya hay una en pantalla
  if(document.querySelector('.birthdayRibbon')) return;
  const ribbon = document.createElement('div');
  ribbon.className = 'birthdayRibbon';
  ribbon.textContent = BIRTHDAY_RIBBON_TEXTS[Math.floor(Math.random()*BIRTHDAY_RIBBON_TEXTS.length)];
  document.body.appendChild(ribbon);
  setTimeout(()=> ribbon.remove(), 8200);
}

function spawnBirthdayFlash(){
  const flash = document.createElement('div');
  flash.className = 'birthdayFlashOverlay';
  document.body.appendChild(flash);
  setTimeout(()=> flash.remove(), 1500);
}

function spawnBirthdayToast(){
  spawnToast(BIRTHDAY_TOAST_MESSAGES[Math.floor(Math.random()*BIRTHDAY_TOAST_MESSAGES.length)]);
}

function spawnBirthdayJiggle(){
  // el escritorio "tiembla" de emoción, reutilizando el glitch ya existente
  triggerIconJiggle();
}

/* ---------------- popups de chistes, con varios guiones distintos ---------------- */
const BIRTHDAY_POPUPS = [
  {
    title: 'Sistema ONCE_OS™ — CONFETI_98.exe',
    msg: '🎉🎂 <b>¡FELIZ CUMPLEAÑOS, MATILDE!</b> 🎂🎉<br><br>Hoy celebramos tus <b>30 años</b>.<br><br>Se han instalado <b>CONFETI_98.exe</b> y <b>GLITTER_30.dll</b> para la ocasión. 💗'
  },
  {
    title: 'Requisitos del sistema — CUMPLEAÑOS30.exe',
    msg: '<b>Requisitos mínimos para correr esta fiesta:</b><br><br>• 1 torta (obligatoria)<br>• 30 velas (o una vela que diga "30", para ahorrar)<br>• Parlantes al máximo volumen<br>• Ganas de bailar: 100% requerido<br><br><i>Su sistema SÍ cumple con estos requisitos.</i> ✅'
  },
  {
    title: 'Escaneo de virus — ONCE_OS™ Defender',
    msg: '🔍 Escaneando el sistema...<br><br>Amenazas encontradas: <b>0</b><br>Nivel de fiesta detectado: <b>crítico (en el buen sentido)</b><br><br>Único proceso corriendo: <b>felicidad30.exe</b> — no se recomienda cerrarlo.'
  },
  {
    title: 'Actualización disponible — WINDOWS_30 Edition',
    msg: '📦 Hay una actualización disponible:<br><br><b>Matilde Pizarro — versión 30.0</b><br>Notas de la versión:<br>• Mejoras de sabiduría<br>• Mismo talento, ahora con más experiencia<br>• Corrección de bugs de la versión 29 (ninguno encontrado, ya venía perfecta)'
  },
  {
    title: 'Contrato de licencia — FIESTA_30_EULA.txt',
    msg: 'Al hacer clic en "Aceptar", el usuario se compromete a:<br><br>1. Comer al menos una porción de torta.<br>2. Bailar como mínimo una canción.<br>3. Aceptar que 30 es una edad excelente.<br><br><i>No hay botón de "Rechazar" disponible.</i> 🎂'
  },
  {
    title: 'Advertencia del sistema',
    msg: '⚠️ <b>ERROR 0x1E: DEMASIADA FELICIDAD</b><br><br>El sistema no puede procesar tanta alegría al mismo tiempo.<br><br>Se recomienda: seguir festejando de todos modos.'
  },
];

function spawnBirthdayBigPopup(){
  // efecto fuerte, por eso pesa poco en el pool y además respeta el
  // límite general de "popups pesados" simultáneos que ya usa el resto
  // del sistema (openHeavyPopups / MAX_HEAVY_POPUPS)
  const p = BIRTHDAY_POPUPS[Math.floor(Math.random()*BIRTHDAY_POPUPS.length)];
  spawnErrorPopupCustom(p.title, p.msg);
}

/* ---------------- progreso de "instalación" temática (con chiste en el nombre) ---------------- */
const BIRTHDAY_INSTALL_NAMES = [
  'pastel.exe',
  '30-velas.dll',
  'globos_infinitos.sys',
  'brindis_98.vxd',
  'playlist-cumple.m3u',
  'abrazos_grupales.dll',
  'baile-random.exe',
];
function spawnBirthdayInstallProgress(){
  if(openHeavyPopups >= MAX_HEAVY_POPUPS) return;
  openHeavyPopups++;
  const name = BIRTHDAY_INSTALL_NAMES[Math.floor(Math.random()*BIRTHDAY_INSTALL_NAMES.length)];
  const win = document.createElement('div');
  win.className = 'win errwin';
  win.style.width = '300px';
  win.style.top = (22 + Math.random()*30) + '%';
  win.style.left = (14 + Math.random()*30) + '%';
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Instalando la fiesta</div>
    </div>
    <div class="win-body">
      <div style="font-size:12px; margin-bottom:8px;">Copiando <b>${name}</b>...</div>
      <div class="progressOuter"><div class="progressInner" id="bpinner"></div></div>
      <div style="font-size:10px; text-align:right; margin-top:4px;" id="bpctText">0%</div>
    </div>
  `;
  document.body.appendChild(win);
  const bar = win.querySelector('#bpinner');
  const pctText = win.querySelector('#bpctText');
  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem';
  taskChip.textContent = '🎂 Instalando ' + name;
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

/* ---------------- pool de efectos, con pesos (ambientales primero, chistes de vez en cuando) ---------------- */
const birthdayWeightedPool = [
  ...Array(6).fill(spawnBirthdayConfettiBurst),
  ...Array(5).fill(spawnSparkleBurst),
  ...Array(3).fill(spawnBirthdayToast),
  ...Array(2).fill(spawnBirthdayJiggle),
  ...Array(1).fill(spawnBirthdayFlash),
  ...Array(1).fill(spawnBirthdayRibbon),
  ...Array(1).fill(spawnBirthdayBigPopup),
  ...Array(1).fill(spawnBirthdayInstallProgress),
];

/* ---------------- interruptor ON/OFF, igual que "Efectos de virus" ---------------- */
let birthday30Enabled = false;
try{
  const savedBirthdayPref = localStorage.getItem('onceOS_birthday30Enabled');
  if(savedBirthdayPref !== null) birthday30Enabled = savedBirthdayPref === '1';
}catch(e){}

function runBirthday30Tick(){
  if(!birthday30Enabled) return;
  const fn = birthdayWeightedPool[Math.floor(Math.random()*birthdayWeightedPool.length)];
  fn();
}
setInterval(runBirthday30Tick, 2200);

function updateBirthday30ToggleIcon(){
  const icon = document.getElementById('iconBirthday30');
  if(!icon) return;
  const glyph = icon.querySelector('.glyph');
  icon.classList.toggle('active', birthday30Enabled);
  if(birthday30Enabled){
    glyph.textContent = '🎂';
    icon.lastChild.textContent = '¡Cumpleaños 30! ON';
  } else {
    glyph.textContent = '🎁';
    icon.lastChild.textContent = '¡Cumpleaños 30!';
  }
}

function setBirthday30Enabled(on){
  birthday30Enabled = on;
  try{ localStorage.setItem('onceOS_birthday30Enabled', on ? '1' : '0'); }catch(e){}
  updateBirthday30ToggleIcon();
  if(on){
    // arranque fuerte al encender, para que se note de inmediato que la
    // fiesta empezó; después el intervalo se encarga de mantenerla viva
    spawnBirthdayFlash();
    spawnBirthdayRibbon();
    spawnBirthdayConfettiBurst();
    spawnSparkleBurst();
    spawnToast('🎂 MODO CUMPLEAÑOS 30 ACTIVADO — que empiece la fiesta 🎉');
  } else {
    spawnToast('🎈 Modo cumpleaños 30 desactivado');
  }
}

document.getElementById('iconBirthday30').addEventListener('dblclick', ()=>{
  setBirthday30Enabled(!birthday30Enabled);
});
updateBirthday30ToggleIcon();
