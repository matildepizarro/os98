/* =====================================================================
   MODULO: js/05-apps-office.js
   INTERNET EXPLORER (EPK) + MIS DOCUMENTOS + BLOC DE NOTAS + CALCULADORA + CALENDARIO + PAINT
   ===================================================================== */

/* =====================================================================
   NUEVO: VENTANA "INTERNET EXPLORER" — EPK / sitio web de Matilde Pizarro
   ===================================================================== */
let ieCounterVal = 1998 + Math.floor(Math.random()*4021);
function openIEWindow(){
  const win = document.createElement('div');
  win.className = 'winfloat iewin';
  win.style.top = '6%'; win.style.left = '50%'; win.style.transform = 'translateX(-50%)';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> matildepizarro.github.io/presskit — Microsoft Internet Explorer</div>
      <div class="winbtns">
        <button class="ieMin">_</button><button class="ieMax">▢</button><button class="ieClose">✕</button>
      </div>
    </div>
    <div class="ie-toolbar">
      <button disabled>◁ Atrás</button><button disabled>Adelante ▷</button>
      <button id="ieRefresh">🔄 Actualizar</button><button id="ieHome">🏠 Inicio</button>
    </div>
    <div class="ie-address">
      <span>Dirección:</span>
      <div class="inset">https://matildepizarro.github.io/presskit/</div>
      <button class="btn98" style="padding:2px 8px;" onclick="window.open('https://matildepizarro.github.io/presskit/','_blank')">Ir</button>
    </div>
    <div class="ie-body">
      <div class="ie-banner">*** MEJOR VISTO EN 800×600 · GRACIAS POR VISITAR · FIRMA EL LIBRO DE VISITAS ***</div>
      <div class="ie-blinkie">✨ ✿ 100% Y2K APPROVED ✿ ✨ GLITTER ACTIVADO ✨ ✿ HECHO CON AMOR PIXELADO ✿ ✨</div>
      <div class="ie-hero" id="ieInicio">
        <img class="ie-mascot" src="${GIF_JUMP}" alt="mascota">
        <div class="ttl98"><span class="twinkle">✦</span> MATILDE PIZARRO <span class="twinkle">✦</span></div>
        <div class="subgirly">♡ bienvenid@ a mi rincón del internet ♡</div>
        <div style="font-size:12px; margin-top:2px;">Rock Alternativo · Dream Pop · Indie Rock · Shoegaze</div>
        <div style="font-size:11px; margin-top:6px;">Villa Alemana, Valparaíso, Chile 🇨🇱</div>
      </div>
      <div class="ie-navpills">
        <a href="#ieInicio">✿ Inicio</a>
        <a href="#ieHistoria">📖 Historia</a>
        <a href="#ieShows">🎤 Shows</a>
        <a href="#ieLanzamientos">💿 Lanzamientos</a>
        <a href="#ieFechas">📅 Fechas</a>
        <a href="#ieVideos">🎬 Videos</a>
        <a href="#ieRedes">🔗 Redes</a>
        <a href="#ieContacto">✉ Contacto</a>
      </div>

      <div class="ie-section" id="ieHistoria">
        <h3>📖 Historia del proyecto</h3>
        Cantautora chilena originaria de Quilpué. Entre 2011 y 2019 fue guitarrista en las bandas Time y Miopía,
        tocando en escenarios y festivales por todo Chile. Entre 2018 y 2025 desarrolló su proyecto solista
        <b>Timbuka</b> (EP 2019, disco 2020), con presencia en festivales online de México y España y notas de prensa
        en varios medios, moviéndose entre el indie/folk y la psicodelia.<br><br>
        En 2026 comienza una nueva etapa bajo su nombre real — un renacimiento creativo y musical — que abrió con
        shows en vivo y tomó forma en abril con los singles <b>"TEXTURAS"</b> y <b>"VUELO"</b>, adelanto de su primer
        disco como Matilde Pizarro.
      </div>

      <div class="ie-section" id="ieShows">
        <h3>🎤 Formatos de show</h3>
        ♡ <b>Acústico</b> — guitarra electroacústica + dos voces amplificadas<br>
        ♡ <b>Eléctrico</b> — formato adaptable a dúo o trío
      </div>

      <div class="ie-section" id="ieLanzamientos">
        <h3>💿 Lanzamientos <span class="ie-newtag">NUEVO!</span></h3>
        <table class="ie-table">
          <tr><td>TEXTURAS (Single)</td><td>10 abril 2026</td></tr>
          <tr><td>VUELO (Single)</td><td>10 abril 2026</td></tr>
          <tr><td>SOMOS IGUALES (Single)</td><td>2026</td></tr>
          <tr><td>ETERNIDAD (Single)</td><td>2026</td></tr>
          <tr><td>Disco (8 canciones)</td><td>2026</td></tr>
        </table>
      </div>

      <div class="ie-section" id="ieFechas">
        <h3>📅 Fechas 2026</h3>
        <table class="ie-table">
          <tr><td>03/01/26</td><td>Cervecería Popular, Valparaíso</td></tr>
          <tr><td>28/02/26</td><td>Gizzday Volumen 3, Valparaíso</td></tr>
          <tr><td>28/03/26</td><td>La Sesión Café, Villa Alemana</td></tr>
          <tr><td>20/05/26</td><td>Journal, Viña del Mar</td></tr>
          <tr><td>30/05/26</td><td>La Puerta Amarilla, Santiago</td></tr>
          <tr><td>18/06/26</td><td>Hotzenplotz Bar, Valparaíso</td></tr>
          <tr><td>27/06/26</td><td>Marcha LGBT, Viña del Mar</td></tr>
          <tr><td>14/08/26</td><td>Café Misp, Villa Alemana</td></tr>
          <tr><td>05/08/26</td><td>El Pimentón Restaurant, Valparaíso <span class="ie-newtag">PRÓXIMA</span></td></tr>
        </table>
      </div>

      <div class="ie-section" id="ieVideos">
        <h3>🎬 Videos oficiales</h3>
        <div class="ie-linkgrid">
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://youtu.be/xlsTwHgWxio">▶ TEXTURAS (Lyric Video)</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://youtu.be/Q4lnRH8x3vU">▶ VUELO (Lyric Video)</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://youtu.be/IBmaB0Gpflw">▶ Semillero del Rock (En Vivo)</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=maMwQp_qxC8">▶ Black Tooth (Cover En Vivo)</a>
        </div>
      </div>

      <div class="ie-section">
        <h3>📰 Prensa</h3>
        <div class="ie-linkgrid">
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://ritmoculto.cl/blogs/noticias/matilde-pizarro-texturas-y-vuelo-los-singles-que-abren-una-nueva-etapa">📄 Ritmo Culto — Texturas y Vuelo</a>
        </div>
      </div>

      <div class="ie-section" id="ieRedes">
        <h3>🔗 Redes y plataformas</h3>
        <div class="ie-linkgrid">
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://open.spotify.com/intl-es/artist/61uAvgWnuDMNYrj2gpKxrg">🎧 Spotify</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://music.apple.com/cl/artist/matilde-pizarro/1893449309">🍎 Apple Music</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://matildepizarro.bandcamp.com/album/texturas-vuelo">💿 Bandcamp</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://www.instagram.com/matildepizarro_/">📸 Instagram</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://www.youtube.com/@canalmatildepizarro">📺 YouTube</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://www.setlist.fm/setlists/matilde-pizarro-7b868e54.html">🎼 SetlistFM</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://www.bandsintown.com/a/15646592-matilde-pizarro">🎫 BandsInTown</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://matildepizarro.github.io/archivo/">🎥 Archivo en vivo</a>
          <a class="ie-linkbtn" target="_blank" rel="noopener" href="https://matildepizarro.github.io/presskit/">📁 Presskit completo</a>
        </div>
      </div>

      <div class="ie-badgerow">
        <div class="ie-badge" style="background:linear-gradient(135deg,#ff5fa2,#c46fff);">✦ WEBRING ✦<br>MATILDE PIZARRO</div>
        <div class="ie-badge" style="background:linear-gradient(135deg,#6fb2ff,#7cbb00);">MEJOR VISTO<br>EN 800×600</div>
        <div class="ie-badge" style="background:linear-gradient(135deg,#ffb900,#ff5fa2);">100% INDIE<br>HECHO A MANO</div>
        <div class="ie-badge" style="background:linear-gradient(135deg,#ff5fa2,#ffd23f,#6fb2ff); color:#fff; text-shadow:1px 1px 0 #000;">✿ GLITTER<br>SITE ✿</div>
      </div>

      <div class="ie-guestbook">
        <b>💌 Libro de visitas</b><br>
        <span style="font-size:11px;">Escríbele a Matilde por Instagram o WhatsApp — respondemos todos los mensajes.</span><br>
        <button class="ie-linkbtn" style="margin-top:6px;" onclick="window.open('https://www.instagram.com/matildepizarro_/','_blank')">✎ Firmar el libro</button>
      </div>

      <div class="ie-section" id="ieContacto">
        <h3>✉ Contacto</h3>
        📧 matildepizarrotoro@gmail.com<br>
        📱 WhatsApp: +56 9 7171 0225<br>
        📍 Villa Alemana, Valparaíso, Chile
      </div>

      <div class="ie-footer">
        Sitio optimizado para módem 56k · Visitas: <span class="ie-counter" id="ieCounterEl">${String(ieCounterVal).padStart(6,'0')}</span><br>
        © Matilde Pizarro — hecho con 💖 y mucho glitter digital
      </div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 160);

  // NUEVO: cursor personalizado kawaii dentro del sitio (usa el gif de pompompurin con audífonos)
  const ieBodyEl = win.querySelector('.ie-body');
  if(ieBodyEl){ ieBodyEl.style.cursor = `url(${GIF_HEADPHONES}) 16 16, auto`; }

  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem';
  taskChip.textContent = '🌐 Presskit — IE';
  errWrap.appendChild(taskChip);
  taskChip.addEventListener('click', ()=>{ win.style.zIndex = ++dragZ; win.style.display=''; });

  function close(){ win.remove(); taskChip.remove(); }
  win.querySelector('.ieClose').addEventListener('click', close);
  win.querySelector('.ieMin').addEventListener('click', ()=>{ win.style.display = (win.style.display==='none')?'':'none'; });
  win.querySelector('.ieMax').addEventListener('click', ()=>{
    win.style.width = (win.style.width === '94vw') ? 'min(600px, 94vw)' : '94vw';
  });
  win.querySelector('#ieRefresh').addEventListener('click', ()=>{
    triggerHourglass();
    ieCounterVal++;
    win.querySelector('#ieCounterEl').textContent = String(ieCounterVal).padStart(6,'0');
  });
  win.querySelector('#ieHome').addEventListener('click', ()=>{ win.querySelector('.ie-body').scrollTop = 0; });
}
document.getElementById('iconIE').addEventListener('dblclick', openIEWindow);

/* =====================================================================
   NUEVO: "MIS DOCUMENTOS" — carpeta con accesos a todas las letras
   ===================================================================== */
function openDocsFolder(){
  const win = document.createElement('div');
  win.className = 'winfloat folderwin';
  win.style.top = '20%'; win.style.left = '32%';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Mis documentos</div>
      <div class="winbtns"><button class="fdClose">✕</button></div>
    </div>
    <div class="menubar"><span>Archivo</span><span>Edición</span><span>Ver</span><span>Ayuda</span></div>
    <div class="folder-grid" id="folderGrid"></div>
    <div style="font-size:10px; padding:4px 10px 8px; color:#404040;">${SONGS.length} objeto(s)</div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 160);
  const grid = win.querySelector('#folderGrid');
  SONGS.forEach((song, idx)=>{
    const item = document.createElement('div');
    item.className = 'folder-item';
    item.innerHTML = `<div class="fglyph">📄</div>${song.filename}`;
    item.addEventListener('dblclick', ()=>{
      if(autoPlay) setAutoPlay(false);
      openLyricWindow(idx);
    });
    grid.appendChild(item);
  });
  const taskChip = document.createElement('div');
  taskChip.className = 'taskitem';
  taskChip.textContent = '📁 Mis documentos';
  errWrap.appendChild(taskChip);
  function close(){ win.remove(); taskChip.remove(); }
  win.querySelector('.fdClose').addEventListener('click', close);
}
document.getElementById('iconDocs').addEventListener('dblclick', openDocsFolder);

/* =====================================================================
   NUEVO: BLOC DE NOTAS — editable de verdad, con mensaje inicial de cumpleaños
   ===================================================================== */
let notepadWinCount = 0;
function openNotepadWindow(){
  notepadWinCount++;
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = (12 + notepadWinCount*2) + '%';
  win.style.left = (30 + notepadWinCount*2) + '%';
  win.style.width = '360px'; win.style.height = '300px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Sin título - Bloc de notas</div>
      <div class="winbtns"><button class="npClose">✕</button></div>
    </div>
    <div class="menubar"><span class="npSaveMenu" style="cursor:pointer;">Archivo</span><span>Edición</span><span>Formato</span><span>Ayuda</span></div>
    <div class="win-body" style="padding:0; display:flex; flex-direction:column;">
      <textarea class="npArea" spellcheck="false" style="flex:1; width:100%; border:none; resize:none; outline:none;
        font-family:'Courier New', monospace; font-size:13px; padding:8px; box-sizing:border-box;">¡Feliz cumpleaños número 98, Matilde Pizarro!

Escribe aquí lo que quieras... este Bloc de notas
funciona de verdad: puedes borrar este mensaje
y escribir tu propio saludo. 🎂</textarea>
      <div style="display:flex; justify-content:flex-end; gap:6px; padding:6px; border-top:1px solid #808080;">
        <button class="btn98 npSave">💾 Guardar como .txt</button>
      </div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 220, 160);
  win.querySelector('.npClose').addEventListener('click', ()=> win.remove());
  win.querySelector('.npArea').focus();

  // NUEVO: guardar el contenido del Bloc de notas como archivo .txt real
  // en el computador/celular de la persona (usa la descarga del navegador).
  function saveNotepadFile(){
    const text = win.querySelector('.npArea').value;
    const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notas.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=> URL.revokeObjectURL(url), 1000);
  }
  win.querySelector('.npSave').addEventListener('click', saveNotepadFile);
  win.querySelector('.npSaveMenu').addEventListener('click', saveNotepadFile);
  // atajo de teclado Ctrl/Cmd+S, como en un editor de texto real
  win.querySelector('.npArea').addEventListener('keydown', (e)=>{
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){
      e.preventDefault();
      saveNotepadFile();
    }
  });
}
document.getElementById('iconNotepad').addEventListener('dblclick', openNotepadWindow);

/* =====================================================================
   NUEVO: CALCULADORA — operativa (suma, resta, multiplica, divide, %, etc.)
   ===================================================================== */
function openCalcWindow(){
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '20%'; win.style.left = '40%'; win.style.width = '210px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Calculadora</div>
      <div class="winbtns"><button class="calcClose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="inset" style="margin-bottom:6px;">
        <div class="calcDisplay" style="text-align:right; font-family:'Courier New',monospace; font-size:18px; padding:6px; min-height:22px; overflow:hidden; white-space:nowrap;">0</div>
      </div>
      <div class="calcGrid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:4px;">
        <button class="btn98 calcBtn" data-act="clear" style="grid-column:span 2;">C</button>
        <button class="btn98 calcBtn" data-act="back">⌫</button>
        <button class="btn98 calcBtn" data-op="/">÷</button>
        <button class="btn98 calcBtn" data-num="7">7</button>
        <button class="btn98 calcBtn" data-num="8">8</button>
        <button class="btn98 calcBtn" data-num="9">9</button>
        <button class="btn98 calcBtn" data-op="*">×</button>
        <button class="btn98 calcBtn" data-num="4">4</button>
        <button class="btn98 calcBtn" data-num="5">5</button>
        <button class="btn98 calcBtn" data-num="6">6</button>
        <button class="btn98 calcBtn" data-op="-">−</button>
        <button class="btn98 calcBtn" data-num="1">1</button>
        <button class="btn98 calcBtn" data-num="2">2</button>
        <button class="btn98 calcBtn" data-num="3">3</button>
        <button class="btn98 calcBtn" data-op="+">+</button>
        <button class="btn98 calcBtn" data-num="0" style="grid-column:span 2;">0</button>
        <button class="btn98 calcBtn" data-num=".">.</button>
        <button class="btn98 calcBtn" data-act="equals">=</button>
      </div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 180, 220);
  win.querySelector('.calcClose').addEventListener('click', ()=> win.remove());

  const display = win.querySelector('.calcDisplay');
  let current = '0', stored = null, pendingOp = null, justEvaluated = false;
  function render(){ display.textContent = current; }
  function inputNum(n){
    if(justEvaluated){ current = '0'; justEvaluated = false; }
    if(n === '.'){
      if(current.includes('.')) return;
      current = current + '.';
    } else {
      current = (current === '0') ? n : current + n;
    }
    render();
  }
  function compute(a,b,op){
    a = parseFloat(a); b = parseFloat(b);
    if(op === '+') return a + b;
    if(op === '-') return a - b;
    if(op === '*') return a * b;
    if(op === '/') return b === 0 ? 'Error' : a / b;
    return b;
  }
  function setOp(op){
    if(pendingOp && !justEvaluated){
      const res = compute(stored, current, pendingOp);
      stored = (res === 'Error') ? '0' : String(res);
      current = stored;
      render();
    } else {
      stored = current;
    }
    pendingOp = op;
    justEvaluated = false;
    current = '0';
  }
  win.querySelectorAll('.calcBtn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const num = btn.getAttribute('data-num');
      const op = btn.getAttribute('data-op');
      const act = btn.getAttribute('data-act');
      if(num !== null){ inputNum(num); return; }
      if(op){ setOp(op); return; }
      if(act === 'clear'){ current='0'; stored=null; pendingOp=null; justEvaluated=false; render(); return; }
      if(act === 'back'){ current = current.length>1 ? current.slice(0,-1) : '0'; render(); return; }
      if(act === 'equals'){
        if(pendingOp !== null){
          const res = compute(stored, current, pendingOp);
          current = String(res);
          stored = null; pendingOp = null; justEvaluated = true;
          render();
        }
        return;
      }
    });
  });
}
document.getElementById('iconCalc').addEventListener('dblclick', openCalcWindow);

/* =====================================================================
   NUEVO: CALENDARIO ROSADO Y KAWAII — con notitas por día
   ===================================================================== */
const kwNotes = {}; // "YYYY-M-D" -> texto
let kwViewYear, kwViewMonth; // mes que se está mostrando (0-11)
const kwMonthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const kwDowNames = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];
const kwCuteEmojis = ['🌸','💗','✨','🎀','🌷','🍥','⭐','🩷'];

function openCalendarWindow(){
  const today = new Date();
  kwViewYear = today.getFullYear();
  kwViewMonth = today.getMonth();

  const win = document.createElement('div');
  win.className = 'winfloat';
  win.id = 'calendarWin';
  win.style.top = '14%'; win.style.left = '34%'; win.style.width = '280px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> 🌷 Calendario</div>
      <div class="winbtns"><button class="kwClose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="kawaiiHead">
        <button class="kwNavBtn kwPrev">◀</button>
        <div class="kwTitle" id="kwTitle"></div>
        <button class="kwNavBtn kwNext">▶</button>
      </div>
      <div class="kwGrid" id="kwGrid"></div>
      <div class="kwFooter">✨ toca un día para dejarle una notita ✨</div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 260);
  win.querySelector('.kwClose').addEventListener('click', ()=> win.remove());
  win.querySelector('.kwPrev').addEventListener('click', ()=>{
    kwViewMonth--; if(kwViewMonth < 0){ kwViewMonth = 11; kwViewYear--; }
    renderCalendar(win);
  });
  win.querySelector('.kwNext').addEventListener('click', ()=>{
    kwViewMonth++; if(kwViewMonth > 11){ kwViewMonth = 0; kwViewYear++; }
    renderCalendar(win);
  });
  renderCalendar(win);
}
document.getElementById('iconCalendar').addEventListener('dblclick', openCalendarWindow);

function renderCalendar(win){
  const titleEl = win.querySelector('#kwTitle');
  const grid = win.querySelector('#kwGrid');
  titleEl.textContent = '🎀 ' + kwMonthNames[kwViewMonth] + ' ' + kwViewYear + ' 🎀';
  grid.innerHTML = '';

  kwDowNames.forEach(d=>{
    const el = document.createElement('div');
    el.className = 'kwDow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const today = new Date();
  const firstDow = new Date(kwViewYear, kwViewMonth, 1).getDay();
  const daysInMonth = new Date(kwViewYear, kwViewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(kwViewYear, kwViewMonth, 0).getDate();

  const cells = [];
  for(let i = firstDow - 1; i >= 0; i--){
    cells.push({ day: daysInPrevMonth - i, other: true, month: kwViewMonth - 1 });
  }
  for(let d = 1; d <= daysInMonth; d++){
    cells.push({ day: d, other: false, month: kwViewMonth });
  }
  while(cells.length % 7 !== 0){
    cells.push({ day: cells.length, other: true, month: kwViewMonth + 1 });
  }

  cells.forEach(c=>{
    const cell = document.createElement('div');
    cell.className = 'kwDay' + (c.other ? ' otherMonth' : '');
    const isToday = !c.other && kwViewYear === today.getFullYear() &&
      kwViewMonth === today.getMonth() && c.day === today.getDate();
    if(isToday) cell.classList.add('today');
    const key = kwViewYear + '-' + kwViewMonth + '-' + c.day;
    if(!c.other && kwNotes[key]) cell.classList.add('hasNote');
    const deco = kwCuteEmojis[(c.day + kwViewMonth) % kwCuteEmojis.length];
    cell.innerHTML = `<span class="kwNum">${c.day}</span><span class="kwDot">${isToday ? '💖' : deco}</span>`;
    if(!c.other){
      cell.addEventListener('click', ()=> openKwNote(kwViewYear, kwViewMonth, c.day, win));
    } else {
      cell.style.cursor = 'default';
    }
    grid.appendChild(cell);
  });
}

const kwNoteBox = document.getElementById('kwNoteBox');
const kwNoteArea = document.getElementById('kwNoteArea');
const kwNoteTitle = document.getElementById('kwNoteTitle');
let kwNoteKey = null;
let kwNoteWinRef = null;

function openKwNote(y, m, d, winRef){
  kwNoteKey = y + '-' + m + '-' + d;
  kwNoteWinRef = winRef;
  kwNoteTitle.textContent = '🌸 ' + d + ' de ' + kwMonthNames[m] + ' 🌸';
  kwNoteArea.value = kwNotes[kwNoteKey] || '';
  kwNoteBox.style.display = 'flex';
  kwNoteArea.focus();
}
document.getElementById('kwNoteClose').addEventListener('click', ()=>{
  kwNoteBox.style.display = 'none';
});
document.getElementById('kwNoteSave').addEventListener('click', ()=>{
  const text = kwNoteArea.value.trim();
  if(text) kwNotes[kwNoteKey] = text;
  else delete kwNotes[kwNoteKey];
  kwNoteBox.style.display = 'none';
  if(kwNoteWinRef && document.body.contains(kwNoteWinRef)) renderCalendar(kwNoteWinRef);
});

/* =====================================================================
   NUEVO: PAINT — lienzo real donde se puede dibujar con el mouse/dedo
   ===================================================================== */
function openPaintWindow(){
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '10%'; win.style.left = '20%'; win.style.width = '420px'; win.style.height = '380px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Sin título - Paint</div>
      <div class="winbtns"><button class="paintClose">✕</button></div>
    </div>
    <div class="menubar"><span>Archivo</span><span>Edición</span><span>Ver</span><span>Ayuda</span></div>
    <div class="win-body" style="display:flex; flex-direction:column; gap:6px; padding:6px;">
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
        <div class="paintPalette" style="display:flex; gap:3px;"></div>
        <label style="font-size:11px; display:flex; align-items:center; gap:4px;">Grosor
          <input type="range" class="paintWidth" min="1" max="20" value="4" style="width:70px;">
        </label>
        <button class="btn98 paintClear">Borrar todo</button>
        <button class="btn98 paintSave">💾 Guardar como imagen</button>
      </div>
      <div class="inset" style="flex:1; min-height:0; padding:0;">
        <canvas class="paintCanvas" style="width:100%; height:100%; display:block; cursor:crosshair; background:#fff; touch-action:none;"></canvas>
      </div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 260, 220);
  win.querySelector('.paintClose').addEventListener('click', ()=> win.remove());

  const canvas = win.querySelector('.paintCanvas');
  const ctx = canvas.getContext('2d');
  const colors = ['#000000','#ffffff','#808080','#ff0000','#ff8000','#ffff00','#00a000','#00a0a0','#0000ff','#800080','#ff69b4','#8b4513'];
  let curColor = '#000000';
  const palette = win.querySelector('.paintPalette');
  colors.forEach(c=>{
    const sw = document.createElement('div');
    sw.style.cssText = `width:16px;height:16px;background:${c};border:1px solid #808080;cursor:pointer;`;
    sw.addEventListener('click', ()=>{ curColor = c; });
    palette.appendChild(sw);
  });

  function resizeCanvas(){
    const rect = canvas.getBoundingClientRect();
    const img = canvas.width && canvas.height ? ctx.getImageData(0,0,canvas.width,canvas.height) : null;
    canvas.width = Math.max(10, rect.width);
    canvas.height = Math.max(10, rect.height);
    ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
    if(img) ctx.putImageData(img,0,0);
  }
  resizeCanvas();
  new ResizeObserver(resizeCanvas).observe(canvas);

  let drawing = false, lastX=0, lastY=0;
  function getPos(e){
    const rect = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - rect.left, y: p.clientY - rect.top };
  }
  function start(e){
    e.preventDefault();
    drawing = true;
    const p = getPos(e); lastX = p.x; lastY = p.y;
    ctx.fillStyle = curColor;
    ctx.beginPath(); ctx.arc(p.x,p.y, (win.querySelector('.paintWidth').value)/2, 0, Math.PI*2); ctx.fill();
  }
  function move(e){
    if(!drawing) return;
    e.preventDefault();
    const p = getPos(e);
    ctx.strokeStyle = curColor;
    ctx.lineWidth = win.querySelector('.paintWidth').value;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(lastX,lastY); ctx.lineTo(p.x,p.y); ctx.stroke();
    lastX = p.x; lastY = p.y;
  }
  function end(){ drawing = false; }
  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);
  canvas.addEventListener('touchstart', start, {passive:false});
  canvas.addEventListener('touchmove', move, {passive:false});
  canvas.addEventListener('touchend', end);

  win.querySelector('.paintClear').addEventListener('click', ()=>{
    ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
  });

  // NUEVO: guardar el dibujo como archivo de imagen (.png) real en el
  // computador/celular de la persona.
  win.querySelector('.paintSave').addEventListener('click', ()=>{
    canvas.toBlob((blob)=>{
      if(!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dibujo.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=> URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  });
}
document.getElementById('iconPaint').addEventListener('dblclick', openPaintWindow);
