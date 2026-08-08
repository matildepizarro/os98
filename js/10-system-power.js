/* =====================================================================
   MODULO: js/10-system-power.js
   MENÚ INICIO restante + APAGAR/REINICIAR/INICIAR + FORMATEAR E INSTALAR EL SISTEMA
   ===================================================================== */

/* =====================================================================
   NUEVO: ítems del menú Inicio que faltaban por conectar
   (Programas, Documentos, Buscar, Ejecutar, Apagar el sistema)
   ===================================================================== */
function closeStartMenu(){
  startOpen = false;
  startMenu.style.display = 'none';
  startBtn.classList.remove('active');
  programsMenu.style.display = 'none';
}

// --- Documentos: abre la misma carpeta que el ícono "Mis documentos" ---
document.getElementById('smDocs').addEventListener('click', ()=>{
  openDocsFolder(); closeStartMenu();
});

// --- Ejecutar...: abre la ventana principal MATILDE_PIZARRO.EXE ---
document.getElementById('smRun').addEventListener('click', ()=>{
  openMainWin();
  closeStartMenu();
});

/* ---------------- Programas: submenú con accesos directos ---------------- */
const programsMenu = document.getElementById('programsMenu');
const smProgramas = document.getElementById('smProgramas');
smProgramas.addEventListener('click', (e)=>{
  e.stopPropagation();
  const isOpen = programsMenu.style.display === 'block';
  programsMenu.style.display = isOpen ? 'none' : 'block';
});
document.getElementById('pmMain').addEventListener('click', ()=>{
  openMainWin(); closeStartMenu();
});
document.getElementById('pmGrabadora').addEventListener('click', ()=>{
  recWin.style.display = ''; recWin.style.zIndex = ++dragZ; closeStartMenu();
});
document.getElementById('pmWebcam').addEventListener('click', ()=>{
  const wc = document.getElementById('webcamWin');
  if(wc){ wc.style.display = ''; wc.style.zIndex = ++dragZ; }
  closeStartMenu();
});
document.getElementById('pmMixer').addEventListener('click', ()=>{
  openVolumeMixer(); closeStartMenu();
});
document.getElementById('pmIE').addEventListener('click', ()=>{
  openIEWindow(); closeStartMenu();
});
document.getElementById('pmNotepad').addEventListener('click', ()=>{
  openNotepadWindow(); closeStartMenu();
});
document.getElementById('pmCalc').addEventListener('click', ()=>{
  openCalcWindow(); closeStartMenu();
});
document.getElementById('pmPaint').addEventListener('click', ()=>{
  openPaintWindow(); closeStartMenu();
});
document.getElementById('pmMinesweeper').addEventListener('click', ()=>{
  openMinesweeperWindow(); closeStartMenu();
});
document.getElementById('pmSolitario').addEventListener('click', ()=>{
  openSolitarioWindow(); closeStartMenu();
});
document.getElementById('pmSudoku').addEventListener('click', ()=>{
  openSudokuWindow(); closeStartMenu();
});
document.getElementById('pmPinball').addEventListener('click', ()=>{
  openPinballWindow(); closeStartMenu();
});
document.getElementById('pmCalendar').addEventListener('click', ()=>{
  openCalendarWindow(); closeStartMenu();
});
document.getElementById('pmDocs').addEventListener('click', ()=>{
  openDocsFolder(); closeStartMenu();
});
// si se cierra el menú Inicio (clic fuera), cerrar también el submenú
document.addEventListener('mousedown', (e)=>{
  if(programsMenu.style.display === 'block' &&
     !programsMenu.contains(e.target) && e.target !== smProgramas){
    programsMenu.style.display = 'none';
  }
});

/* ---------------- Buscar: filtra letras/canciones por nombre ---------------- */
const searchWin = document.getElementById('searchWin');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
makeDraggable(searchWin);
makeResizable(searchWin, 240, 160);

function renderSearchResults(query){
  const q = query.trim().toLowerCase();
  searchResults.innerHTML = '';
  if(!q){
    searchResults.innerHTML = '<div class="searchNoResults">Escribe un nombre para buscar…</div>';
    return;
  }
  const matches = SONGS.filter(s =>
    s.filename.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)
  );
  if(matches.length === 0){
    searchResults.innerHTML = '<div class="searchNoResults">No se encontraron archivos.</div>';
    return;
  }
  matches.forEach(song=>{
    const item = document.createElement('div');
    item.className = 'searchResultItem';
    item.textContent = '📄 ' + song.filename;
    item.addEventListener('click', ()=>{
      if(autoPlay) setAutoPlay(false);
      openLyricWindow(SONGS.indexOf(song));
    });
    searchResults.appendChild(item);
  });
}
searchInput.addEventListener('input', ()=> renderSearchResults(searchInput.value));
document.getElementById('smBuscar').addEventListener('click', ()=>{
  searchWin.style.display = 'flex';
  searchWin.style.zIndex = ++dragZ;
  renderSearchResults(searchInput.value);
  searchInput.focus();
  closeStartMenu();
});
document.getElementById('searchCloseBtn').addEventListener('click', ()=>{
  searchWin.style.display = 'none';
});

/* ===================================================================
   APAGAR / REINICIAR / INICIAR — secuencias más "reales"
   =================================================================== */
const shutdownScreen = document.getElementById('shutdownScreen');
const shutdownDialog = document.getElementById('shutdownDialog');
const bootScreen = document.getElementById('bootScreen');

// clic en cualquier lugar de la pantalla negra final vuelve al escritorio
shutdownScreen.addEventListener('click', ()=>{
  shutdownScreen.style.display = 'none';
});

/* --------- diálogo con opciones (Suspender / Apagar / Reiniciar) --------- */
document.getElementById('smShutdown').addEventListener('click', ()=>{
  closeStartMenu();
  shutdownDialog.style.display = 'flex';
});
document.getElementById('sdCancelBtn').addEventListener('click', ()=>{
  shutdownDialog.style.display = 'none';
});
shutdownDialog.querySelectorAll('.opt').forEach(opt=>{
  opt.addEventListener('click', ()=>{
    shutdownDialog.querySelectorAll('.opt').forEach(o=> o.classList.remove('sel'));
    opt.classList.add('sel');
    opt.querySelector('input').checked = true;
  });
});
document.getElementById('sdOkBtn').addEventListener('click', ()=>{
  const val = shutdownDialog.querySelector('input[name="sdopt"]:checked').value;
  shutdownDialog.style.display = 'none';
  if(val === 'standby'){ doStandby(); }
  else if(val === 'restart'){ doPowerSequence(true); }
  else { doPowerSequence(false); }
});

function doStandby(){
  // simula el monitor entrando en suspensión: fundido rápido a negro y vuelta
  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9999;opacity:0;transition:opacity .5s;';
  document.body.appendChild(flash);
  requestAnimationFrame(()=> flash.style.opacity = '1');
  setTimeout(()=>{
    flash.style.opacity = '0';
    setTimeout(()=> flash.remove(), 600);
  }, 900);
}

/* --------- secuencia real de apagado / reinicio con texto de cierre --------- */
function doPowerSequence(isRestart){
  bootScreen.className = '';
  bootScreen.style.display = 'flex';
  bootScreen.style.background = '#008080';
  bootScreen.style.color = '#fff';
  bootScreen.style.fontFamily = "'W98',Tahoma,sans-serif";
  bootScreen.style.alignItems = 'center';
  bootScreen.style.justifyContent = 'center';
  bootScreen.style.fontSize = '15px';
  bootScreen.textContent = '';

  const lines = [
    'Guardando su configuración…',
    'Cerrando MATILDE_PIZARRO.EXE…',
    isRestart ? 'Windows se está reiniciando…' : 'Windows se está cerrando…'
  ];
  let i = 0;
  const box = document.createElement('div');
  box.style.textAlign = 'center';
  bootScreen.appendChild(box);

  function nextLine(){
    if(i < lines.length){
      box.textContent = lines[i];
      i++;
      setTimeout(nextLine, 850);
    } else {
      bootScreen.style.display = 'none';
      if(isRestart){
        runBootSequence(()=>{ /* de vuelta al escritorio */ });
      } else {
        shutdownScreen.style.display = 'flex';
      }
    }
  }
  nextLine();
}

/* --------- secuencia de arranque (BIOS + logo Windows 98) --------- */
function runBootSequence(onDone){
  bootScreen.className = '';
  bootScreen.style.background = '#000';
  bootScreen.style.color = '#aaa';
  bootScreen.style.fontFamily = "'Consolas','Courier New',monospace";
  bootScreen.style.alignItems = '';
  bootScreen.style.justifyContent = '';
  bootScreen.style.fontSize = '13px';
  bootScreen.style.display = 'flex';
  bootScreen.style.flexDirection = 'column';
  bootScreen.style.padding = '22px 26px';
  bootScreen.textContent = '';

  const biosLines = [
    'MATILDE-BIOS v4.51PG, An Energy Star Ally',
    'Copyright (C) MATILDE STUDIOS, 1998-2026',
    '',
    'CPU: MATILDE-CORE(tm) @ 233MHz',
    'Memory Test: 65536K OK',
    '',
    'Detecting IDE drives…',
    ' Primary Master  : MATILDE_OS  HDD',
    ' Primary Slave   : None',
    ' Secondary Master: CD-ROM DRIVE',
    '',
    'Press DEL to enter SETUP, ESC to skip memory test',
    '',
    'Starting MATILDE_OS...'
  ];
  const pre = document.createElement('pre');
  pre.style.margin = '0'; pre.style.whiteSpace = 'pre-wrap';
  bootScreen.appendChild(pre);

  let li = 0;
  function typeLine(){
    if(li < biosLines.length){
      pre.textContent += biosLines[li] + '\n';
      li++;
      setTimeout(typeLine, 90 + Math.random()*70);
    } else {
      setTimeout(showLogo, 400);
    }
  }
  typeLine();

  function showLogo(){
    bootScreen.textContent = '';
    bootScreen.className = 'logo-mode';
    bootScreen.style.background = '#000';
    bootScreen.style.padding = '0';
    const box = document.createElement('div');
    box.id = 'bootLogoBox';
    box.innerHTML = '<div class="w98logo">MATILDE_OS</div><div class="w98sub" id="bootSubMsg">Se está iniciando…</div>' +
      '<div class="barTrack"><div class="barFill" id="bootBarFill"></div></div>';
    bootScreen.appendChild(box);
    const fill = box.querySelector('#bootBarFill');
    const subMsg = box.querySelector('#bootSubMsg');
    const funnyBootMsgs = [
      'Se está iniciando…',
      'Calentando la voz de Matilde… 🎤',
      'Cargando purpurina digital… ✨',
      'Afinando la guitarra kawaii… 🎸💕',
      'Despertando a los glitches virus… 👻',
      'Buscando el brillo labial perfecto… 💄',
      'Sincronizando corazones… 💗',
      'Casi listo, no despeines el flequillo… 🎀'
    ];
    let mi = 0;
    const subIv = setInterval(()=>{
      mi = (mi+1) % funnyBootMsgs.length;
      subMsg.textContent = funnyBootMsgs[mi];
    }, 480);
    let p = 0;
    const iv = setInterval(()=>{
      p += 6 + Math.random()*10;
      if(p >= 100){
        p = 100; clearInterval(iv); clearInterval(subIv);
        fill.style.width = p+'%';
        subMsg.textContent = '¡Listo! (づ ◕‿◕ )づ';
        finishBoot();
      }
      else fill.style.width = p+'%';
    }, 140);
  }

  function finishBoot(){
    setTimeout(()=>{
      bootScreen.style.display = 'none';
      bootScreen.className = '';
      if(typeof onDone === 'function') onDone();
    }, 500);
  }
}

// arranque real al cargar la página (simula encender el equipo)
window.addEventListener('load', ()=>{
  setTimeout(()=> runBootSequence(), 150);
});

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
