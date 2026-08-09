/* =====================================================================
   NUEVO: VENTANA "INTERNET EXPLORER" — EPK / sitio web de Matilde Pizarro
   ===================================================================== */
let ieCounterVal = 1998 + Math.floor(Math.random()*4021);
let ieWinRef = null;
function openIEWindow(){
  // mismo arreglo que en los juegos: evita ventanas duplicadas apiladas.
  // Si la ventana existente estaba minimizada (display:none), también la
  // restaura, porque si no, doble-clic en el ícono no parecería hacer nada.
  if(ieWinRef && document.body.contains(ieWinRef)){
    ieWinRef.style.display = '';
    ieWinRef.style.zIndex = ++dragZ;
    return;
  }
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
  ieWinRef = win;
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

  function close(){ win.remove(); taskChip.remove(); ieWinRef = null; }
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
