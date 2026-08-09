/* =====================================================================
   MODULO: js/effects/08-birthday-mode.js
   MODO "CUMPLEAÑOS 30" — botón manual en el escritorio para activar la
   celebración de los 30 años de Matilde Pizarro (14/08/2026) en cualquier
   momento, sin tener que esperar a que llegue la fecha real. Reutiliza los
   efectos ya existentes (sparkles, toast, popup) y suma confeti cayendo,
   un banner deslizante y un destello dorado de pantalla completa.
   ===================================================================== */

const BIRTHDAY_CONFETTI_EMOJI = ['🎉','🎂','🎈','✨','💗','🌸','🎊','💛'];

let birthday30Active = false;

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

function spawnBirthdayConfettiLoop(totalMs){
  const timer = setInterval(()=>{
    for(let i=0;i<3;i++) spawnBirthdayConfettiPiece();
  }, 160);
  setTimeout(()=> clearInterval(timer), totalMs);
  return timer;
}

function spawnBirthdayRibbon(){
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

function activateBirthday30Mode(){
  // evita que se pueda disparar varias veces encimadas si se hace doble
  // clic repetido sobre el ícono mientras el modo ya está corriendo
  if(birthday30Active) return;
  birthday30Active = true;

  // pausa temporalmente los glitches aleatorios (BSOD, virus, etc.) para
  // que no se crucen visualmente con la celebración; se restaura el estado
  // que tenía el usuario (encendido o apagado) al terminar el modo, sin
  // tocar su preferencia guardada en localStorage
  const prevGlitchState = glitchEffectsEnabled;
  glitchEffectsEnabled = false;

  spawnToast('🎂 Activando MODO CUMPLEAÑOS 30 de Matilde Pizarro... 🎉');

  spawnErrorPopupCustom(
    'Sistema ONCE_OS™ — CONFETI_98.exe',
    '🎉🎂 <b>¡FELIZ CUMPLEAÑOS, MATILDE!</b> 🎂🎉<br><br>Hoy celebramos tus <b>30 años</b>.<br><br>Se han instalado <b>CONFETI_98.exe</b> y <b>GLITTER_30.dll</b> para la ocasión. 💗'
  );

  spawnBirthdayFlash();
  spawnBirthdayRibbon();

  let bursts = 0;
  const burstInterval = setInterval(()=>{
    spawnSparkleBurst();
    bursts++;
    if(bursts >= 10) clearInterval(burstInterval);
  }, 300);

  const TOTAL_DURATION = 9000;
  spawnBirthdayConfettiLoop(TOTAL_DURATION);

  setTimeout(()=>{
    glitchEffectsEnabled = prevGlitchState;
    birthday30Active = false;
  }, TOTAL_DURATION + 500);
}

document.getElementById('iconBirthday30').addEventListener('dblclick', activateBirthday30Mode);
