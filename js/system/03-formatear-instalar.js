/* ===================================================================
   FORMATEAR E INSTALAR EL SISTEMA (simulación, desde el menú Inicio)
   =================================================================== */
const formatConfirm = document.getElementById('formatConfirm');
const sysSetup = document.getElementById('sysSetup');
const setupDosView = document.getElementById('setupDosView');
const setupBox = document.getElementById('setupBox');
const setupSteps = document.getElementById('setupSteps');
const setupBarFill = document.getElementById('setupBarFill');
const setupPct = document.getElementById('setupPct');

document.getElementById('smFormat').addEventListener('click', ()=>{
  closeStartMenu();
  formatConfirm.style.display = 'flex';
});
document.getElementById('fmtNoBtn').addEventListener('click', ()=>{
  formatConfirm.style.display = 'none';
});
document.getElementById('fmtYesBtn').addEventListener('click', ()=>{
  formatConfirm.style.display = 'none';
  runFormatAndInstall();
});

function runFormatAndInstall(){
  sysSetup.style.display = 'block';
  sysSetup.className = 'mode-dos';
  setupDosView.style.display = 'block';
  setupBox.style.display = 'none';
  setupDosView.textContent = '';

  const dosLines = [
    'MATILDE-DOS Format Utility v6.22 (edición purpurina)',
    '',
    'Verificando la unidad C:\\ ... (revisando que no queden despecho residual)',
    'Se perderán todos los datos viejos de la unidad C:\\ ✂️💔',
    '',
    'Formateando 2,048.0M de pura vibra ✨'
  ];
  // versiones cortitas, inspiradas en las canciones de Matilde, para amenizar la espera
  const lyricSnippets = [
    '🎶 "01_LUNAR" — bajo la luna, mi voz se enciende…',
    '🎶 "02_LOS_CAMINOS" — todos los caminos me llevan a ti…',
    '🎶 "03_INCOGNITO" — voy incógnita, buscando la salida…',
    '🎶 "04_OCELO" — ojos de ocelo mirando el vacío…',
    '🎶 "05_FONDO" — toco fondo y desde ahí despego…',
    '🎶 "06_TEXTURAS" — texturas de piel que no se olvidan…',
    '🎶 "07_OCASO_CIRCULAR" — el ocaso da vueltas y vuelve a empezar…',
    '🎶 "08_LETARGO" — despierto de un letargo de cristal…',
    '🎶 "09_VUELO" — este vuelo no tiene aterrizaje…',
    '🎶 "10_LLAMAS" — entre llamas aprendí a bailar…',
    '🎶 "11_EL_FINAL" — el final es solo otro comienzo…'
  ];
  let li = 0;
  function typeDos(){
    if(li < dosLines.length){
      setupDosView.textContent += dosLines[li] + '\n';
      li++;
      setTimeout(typeDos, 220);
    } else {
      formatPercent(0);
    }
  }
  typeDos();

  function formatPercent(p){
    const base = dosLines.join('\n') + '\n';
    const snippet = lyricSnippets[Math.floor((p/100) * (lyricSnippets.length-1))];
    setupDosView.textContent = base + 'Formateo completado al ' + p + '% 💅\n\n' + snippet;
    if(p < 100){
      setTimeout(()=> formatPercent(Math.min(100, p + 4 + Math.floor(Math.random()*8))), 110);
    } else {
      setupDosView.textContent = base + 'Formateo completado al 100% 💅\n\n' +
        'Escribiendo información del sistema de archivos… (con mucho amor)\n' +
        'Formato completo. Ni una lágrima derramada. 🎀\n\n' +
        'Iniciando la instalación de MATILDE_OS…';
      setTimeout(startSetupPhase, 1200);
    }
  }
}

function startSetupPhase(){
  sysSetup.className = 'mode-setup';
  setupDosView.style.display = 'none';
  setupBox.style.display = 'block';
  setupSteps.innerHTML = '';
  setupBarFill.style.width = '0%';
  setupPct.textContent = '0%';

  const steps = [
    'Copiando archivos del sistema… (y algo de purpurina) ✨',
    'Instalando dispositivos de hardware… (que no hagan ruido feo) 🔌',
    'Configurando la red… (para que nadie te deje en visto) 📶',
    'Instalando MATILDE_PIZARRO.EXE… (la estrella de la casa) ⭐',
    'Configurando el Menú Inicio… con mucho corazón 💗',
    'Aplicando configuración regional… (uso horario: siempre glamorosa) 🕐',
    'Guardando la configuración… no cierres los ojos, ya casi 🎀'
  ];
  steps.forEach(s=>{
    const d = document.createElement('div');
    d.textContent = s;
    setupSteps.appendChild(d);
  });
  const stepEls = [...setupSteps.children];

  let idx = 0;
  let progress = 0;
  const perStep = 100 / steps.length;

  function runStep(){
    if(idx >= steps.length){
      setupPct.textContent = '100%';
      setupBarFill.style.width = '100%';
      setTimeout(finishInstall, 700);
      return;
    }
    stepEls.forEach(el=> el.classList.remove('active'));
    stepEls[idx].classList.add('active');
    const target = Math.round((idx+1) * perStep);
    const start = progress;
    const dur = 900 + Math.random()*700;
    const t0 = performance.now();
    function anim(t){
      const k = Math.min(1, (t - t0) / dur);
      const val = start + (target - start) * k;
      setupBarFill.style.width = val + '%';
      setupPct.textContent = Math.round(val) + '%';
      if(k < 1){ requestAnimationFrame(anim); }
      else{
        progress = target;
        stepEls[idx].classList.remove('active');
        stepEls[idx].classList.add('done');
        idx++;
        setTimeout(runStep, 200);
      }
    }
    requestAnimationFrame(anim);
  }
  runStep();
}

function finishInstall(){
  setupBox.innerHTML = '<h2>✨ Instalación completa ✨</h2>' +
    '<div class="sub">MATILDE_OS quedó reluciente. El equipo se reiniciará ahora, aplausos por favor 👏💕</div>';
  setTimeout(()=>{
    sysSetup.style.display = 'none';
    runBootSequence();
  }, 1800);
}
