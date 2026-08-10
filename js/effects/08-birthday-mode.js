/* =====================================================================
   MODULO: js/effects/08-birthday-mode.js
   MODO "CUMPLEAÑOS 30" — igual que el interruptor de efectos de virus,
   pero para la fiesta: mientras está ENCENDIDO, dispara efectos de
   cumpleaños al azar cada pocos segundos, de forma continua, pensado para
   dejarlo corriendo de fondo durante toda la fiesta de los 30 años de
   Matilde Pizarro. Se prende y apaga con doble clic en el ícono del
   escritorio, igual que "Efectos de virus".
   ===================================================================== */

const BIRTHDAY_CONFETTI_EMOJI = ['🎉','🎂','🎈','✨','💗','🌸','🎊','💛'];

const BIRTHDAY_TOAST_MESSAGES = [
  '🎂 ¡30 años de Matilde Pizarro!',
  '🎉 ¡Que siga la fiesta!',
  '💗 ¡Feliz cumpleaños, Matilde!',
  '✨ Nivel de kawaii-core.dll: máximo festejo.',
  '🎈 CONFETI_98.exe sigue instalado y funcionando.',
  '🌸 30 años de puro talento.',
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
  ribbon.textContent = '🎉 ¡FELICES 30 AÑOS, MATILDE PIZARRO! 🎂 ✨ 30 AÑOS DE PURO TALENTO ✨ 🎉';
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

function spawnBirthdayBigPopup(){
  // el popup grande de felicitación: efecto fuerte, por eso pesa poco en
  // el pool (ver birthdayWeightedPool) y además respeta el límite general
  // de "popups pesados" simultáneos que ya usa el resto del sistema
  spawnErrorPopupCustom(
    'Sistema ONCE_OS™ — CONFETI_98.exe',
    '🎉🎂 <b>¡FELIZ CUMPLEAÑOS, MATILDE!</b> 🎂🎉<br><br>Hoy celebramos tus <b>30 años</b>.<br><br>Se han instalado <b>CONFETI_98.exe</b> y <b>GLITTER_30.dll</b> para la ocasión. 💗'
  );
}

/* ---------------- pool de efectos, con pesos (ambientales primero) ---------------- */
const birthdayWeightedPool = [
  ...Array(6).fill(spawnBirthdayConfettiBurst),
  ...Array(5).fill(spawnSparkleBurst),
  ...Array(2).fill(spawnBirthdayToast),
  ...Array(1).fill(spawnBirthdayFlash),
  ...Array(1).fill(spawnBirthdayRibbon),
  ...Array(1).fill(spawnBirthdayBigPopup),
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
