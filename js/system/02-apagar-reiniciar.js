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
