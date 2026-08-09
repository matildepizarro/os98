/* =====================================================================
   NUEVO: PROPIEDADES DE PANTALLA (fondo de escritorio interactivo)
   ===================================================================== */
const wallpapers = [
  { name:'Teal clásico', bg:'#008080', dot:'#00767a' },
  { name:'Kawaii rosa', bg:'#ffb3d9', dot:'#ff8fc7' },
  { name:'Lavanda Y2K', bg:'#b8a6e8', dot:'#9c86d8' },
  { name:'Menta 2000', bg:'#a6e8c9', dot:'#7fd8ab' },
  { name:'Cielo dulce', bg:'#a6d8ff', dot:'#7fc0ff' },
  { name:'Sunset disco', bg:'#ffcf8f', dot:'#ffb35c' },
];
function openDisplayProperties(){
  ctxMenu.style.display = 'none';
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '20%'; win.style.left = '30%'; win.style.width = '300px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Propiedades de pantalla</div>
      <div class="winbtns"><button class="dpClose">✕</button></div>
    </div>
    <div class="win-body">
      <div style="font-size:12px;">Fondo de escritorio:</div>
      <div class="previewscreen" id="dpPreview">MATILDE_OS</div>
      <div class="swatchrow" id="dpSwatches"></div>
      <div style="text-align:right;"><button class="btn98 dpClose">Aceptar</button></div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 160);
  const sw = win.querySelector('#dpSwatches');
  const prev = win.querySelector('#dpPreview');
  wallpapers.forEach(w=>{
    const s = document.createElement('div');
    s.className = 'swatch'; s.style.background = w.bg; s.title = w.name;
    s.addEventListener('click', ()=>{
      prev.style.background = w.bg;
      prev.style.backgroundImage = `radial-gradient(${w.dot} 1px, transparent 1px)`;
      document.body.style.background = w.bg;
      document.body.style.backgroundImage = `radial-gradient(${w.dot} 1px, transparent 1px)`;
    });
    sw.appendChild(s);
  });
  win.querySelectorAll('.dpClose').forEach(b=> b.addEventListener('click', ()=> win.remove()));
}
