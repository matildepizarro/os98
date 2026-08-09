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
