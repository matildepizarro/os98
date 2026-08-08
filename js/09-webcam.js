/* =====================================================================
   MODULO: js/09-webcam.js
   WEBCAM.EXE
   ===================================================================== */

/* =====================================================================
   NUEVO: WEBCAM.EXE — módulo simple, siempre abierto en el escritorio,
   arrastrable (usa makeDraggable) y redimensionable (handle propio),
   que muestra en vivo lo que capta la cámara con "filtros" estilo Win98.
   ===================================================================== */
(function(){
  const webcamWin = document.getElementById('webcamWin');
  const video = document.getElementById('webcamVideo');
  const canvas = document.getElementById('webcamCanvas');
  const frame = document.getElementById('webcamFrame');
  const noSignal = document.getElementById('webcamNoSignal');
  const statusEl = document.getElementById('webcamStatus');
  const deviceSelect = document.getElementById('webcamDeviceSelect');
  const filterSelect = document.getElementById('webcamFilterSelect');
  const fxToggle = document.getElementById('webcamFxToggle');
  const fxIntensity = document.getElementById('webcamFxIntensity');
  const resizeHandle = document.getElementById('webcamResizeHandle');
  const webcamCloseBtn = document.getElementById('webcamCloseBtn');
  if(!webcamWin || !video || !canvas) return;

  if(webcamCloseBtn){
    webcamCloseBtn.addEventListener('click', ()=>{
      if(typeof recIsRecording !== 'undefined' && recIsRecording) stopVideoRecording();
      webcamWin.style.display = 'none';
      if(rafId) cancelAnimationFrame(rafId);
      stopStream();
    });
  }

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const W = canvas.width, H = canvas.height;
  let currentStream = null;
  let rafId = null;

  // buffer temporal para leer frames del video a resolución baja (retro/perf)
  const src = document.createElement('canvas');
  src.width = W; src.height = H;
  const srcCtx = src.getContext('2d', { willReadFrequently: true });

  const INTENSITY = { soft: 0.35, hard: 0.75, chaos: 1.15 };
  let glitchBurstUntil = 0;   // timestamp hasta cuando dura un "burst" fuerte
  let nextAutoBurst = 0;

  function scheduleNextBurst(now){
    nextAutoBurst = now + 1500 + Math.random()*3500;
  }

  function posterize(data, levels){
    const step = 255 / (levels - 1);
    for(let i=0;i<data.length;i+=4){
      data[i]   = Math.round(Math.round(data[i]/step)*step);
      data[i+1] = Math.round(Math.round(data[i+1]/step)*step);
      data[i+2] = Math.round(Math.round(data[i+2]/step)*step);
    }
  }

  function tint(data, mode){
    for(let i=0;i<data.length;i+=4){
      const r=data[i], g=data[i+1], b=data[i+2];
      if(mode==='mono'){
        const l = (r*0.3+g*0.59+b*0.11);
        data[i]=l*0.25; data[i+1]=Math.min(255,l*1.25); data[i+2]=l*0.25;
      } else if(mode==='grey'){
        const l = (r*0.3+g*0.59+b*0.11);
        data[i]=l; data[i+1]=l; data[i+2]=l;
      } else if(mode==='vhs'){
        data[i]   = Math.min(255, r*1.05 + 10);
        data[i+1] = g*0.95;
        data[i+2] = Math.min(255, b*1.15 + 8);
      } else if(mode==='crt98'){
        data[i]   = r*0.95;
        data[i+1] = Math.min(255, g*1.05);
        data[i+2] = b*0.9;
      }
    }
  }

  // aberración cromática: separa canal R y B horizontalmente
  function chromaShift(src, dst, w, h, dx){
    if(dx<=0){ dst.set(src); return; }
    for(let y=0;y<h;y++){
      const row = y*w*4;
      for(let x=0;x<w;x++){
        const i = row + x*4;
        const rx = Math.min(w-1, Math.max(0, x-dx));
        const bx = Math.min(w-1, Math.max(0, x+dx));
        dst[i]   = src[row + rx*4];       // R desplazado a la izq
        dst[i+1] = src[i+1];              // G queda
        dst[i+2] = src[row + bx*4 + 2];   // B desplazado a la der
        dst[i+3] = 255;
      }
    }
  }

  // corte/tearing horizontal: franjas de filas desplazadas lateralmente
  function rowTear(data, w, h, amount){
    const bands = 2 + Math.floor(amount*10);
    for(let b=0; b<bands; b++){
      if(Math.random() > amount*0.9 + 0.1) continue;
      const y0 = Math.floor(Math.random()*h);
      const bandH = 1 + Math.floor(Math.random()*(h*0.08));
      const shift = Math.floor((Math.random()*2-1) * w * 0.25 * amount);
      for(let y=y0; y<Math.min(h, y0+bandH); y++){
        const row = y*w*4;
        const rowCopy = data.slice(row, row+w*4);
        for(let x=0;x<w;x++){
          let sx = x - shift;
          sx = ((sx % w) + w) % w;
          const di = row + x*4, si = sx*4;
          data[di]=rowCopy[si]; data[di+1]=rowCopy[si+1]; data[di+2]=rowCopy[si+2];
        }
      }
    }
  }

  // bloque "corrupto": rectángulo con color plano / invertido, tipo pérdida de señal
  function corruptBlocks(data, w, h, amount){
    const count = Math.floor(amount*4);
    for(let c=0;c<count;c++){
      if(Math.random() > amount) continue;
      const bw = 8 + Math.floor(Math.random()*w*0.35);
      const bh = 3 + Math.floor(Math.random()*h*0.12);
      const bx = Math.floor(Math.random()*(w-bw));
      const by = Math.floor(Math.random()*(h-bh));
      const invert = Math.random() < 0.5;
      for(let y=by;y<by+bh;y++){
        for(let x=bx;x<bx+bw;x++){
          const i = (y*w+x)*4;
          if(invert){
            data[i]=255-data[i]; data[i+1]=255-data[i+1]; data[i+2]=255-data[i+2];
          } else {
            data[i]=0; data[i+1]=Math.random()<0.5?255:0; data[i+2]=Math.random()<0.5?255:0;
          }
        }
      }
    }
  }

  function noise(data, amount){
    const strength = amount*60;
    for(let i=0;i<data.length;i+=4){
      if(Math.random() < 0.35){
        const n = (Math.random()*2-1)*strength;
        data[i]+=n; data[i+1]+=n; data[i+2]+=n;
      }
    }
  }

  function scanlines(data, w, h, strength){
    for(let y=0;y<h;y+=2){
      const row = y*w*4;
      for(let x=0;x<w;x++){
        const i = row+x*4;
        data[i]*= (1-strength); data[i+1]*=(1-strength); data[i+2]*=(1-strength);
      }
    }
  }

  const tmp = new Uint8ClampedArray(W*H*4);

  function renderFrame(now){
    rafId = requestAnimationFrame(renderFrame);
    if(video.readyState < 2 || !currentStream) return;

    srcCtx.drawImage(video, 0, 0, W, H);
    let imgData;
    try{ imgData = srcCtx.getImageData(0,0,W,H); }catch(e){ return; }
    const data = imgData.data;

    const fxOn = fxToggle && fxToggle.checked;
    const base = fxOn ? (INTENSITY[fxIntensity.value] || 0.75) : 0;

    // ¿estamos dentro de un "burst" de glitch fuerte?
    let intensity = base;
    if(fxOn){
      if(now >= nextAutoBurst){ glitchBurstUntil = now + 120 + Math.random()*260; scheduleNextBurst(now); }
      if(now < glitchBurstUntil) intensity = Math.min(1.4, base + 0.7);
    }

    const mode = filterSelect.value;

    // aberración cromática (según filtro y burst)
    const chromaAmt = mode==='vhs' ? (2+Math.round(intensity*4)) : (mode==='corrupt' ? (3+Math.round(intensity*6)) : Math.round(intensity*2));
    chromaShift(data, tmp, W, H, chromaAmt);
    data.set(tmp);

    if(fxOn){
      rowTear(data, W, H, mode==='corrupt' ? Math.min(1.5,intensity*1.3) : intensity);
      if(mode==='corrupt') corruptBlocks(data, W, H, Math.min(1,intensity*0.8));
      noise(data, mode==='vhs' ? intensity*1.2 : intensity*0.7);
    }

    if(mode==='crt98') posterize(data, 5);
    if(mode!=='none') tint(data, mode);
    if(mode==='crt98' || mode==='mono') scanlines(data, W, H, 0.22);
    if(mode==='vhs') scanlines(data, W, H, 0.12);

    ctx.putImageData(imgData, 0, 0);
  }

  function stopStream(){
    if(currentStream){
      currentStream.getTracks().forEach(t => t.stop());
      currentStream = null;
    }
  }

  function startRenderLoop(){
    if(rafId) return; // ya corriendo
    nextAutoBurst = performance.now() + 800;
    rafId = requestAnimationFrame(renderFrame);
  }

  async function listDevices(){
    try{
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter(d => d.kind === 'videoinput');
      deviceSelect.innerHTML = '';
      cams.forEach((d, i) => {
        const opt = document.createElement('option');
        opt.value = d.deviceId;
        opt.textContent = d.label || ('Cámara ' + (i+1));
        deviceSelect.appendChild(opt);
      });
    }catch(e){ /* enumerateDevices puede fallar sin permiso previo; no es crítico */ }
  }

  async function startCamera(deviceId){
    stopStream();
    statusEl.textContent = 'Conectando…';
    noSignal.style.display = 'flex';
    noSignal.textContent = 'Conectando…';
    try{
      const constraints = {
        audio: false,
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'user' }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      currentStream = stream;
      video.srcObject = stream;
      await video.play().catch(()=>{});
      noSignal.style.display = 'none';
      statusEl.textContent = 'Cámara en vivo';
      startRenderLoop();
      await listDevices();
    }catch(err){
      noSignal.style.display = 'flex';
      noSignal.textContent = 'Sin señal de cámara (permiso denegado o no disponible)';
      statusEl.textContent = 'Error: ' + (err && err.message ? err.message : 'no se pudo acceder a la cámara');
    }
  }

  deviceSelect.addEventListener('change', ()=> startCamera(deviceSelect.value));

  const glitchBtn = document.getElementById('webcamGlitchBtn');
  if(glitchBtn){
    glitchBtn.addEventListener('click', ()=>{
      const now = performance.now();
      glitchBurstUntil = now + 350 + Math.random()*300;
      nextAutoBurst = now + 2000 + Math.random()*2000;
    });
  }

  /* ===================================================================
     TOMAR FOTO: cuenta regresiva 3-2-1 y luego guarda automáticamente
     la captura en el disco del usuario, en la mejor calidad posible.
     Importante: la foto se toma del <video> crudo (resolución nativa de
     la cámara), NO del canvas chico con los filtros/glitches, para que
     la calidad final sea la mejor posible en vez de una captura
     reducida y con efectos.
     =================================================================== */
  const photoBtn = document.getElementById('webcamPhotoBtn');
  const countdownEl = document.getElementById('webcamCountdown');
  const flashEl = document.getElementById('webcamFlash');
  let photoBusy = false;

  function capturePhotoBestQuality(){
    if(!currentStream || video.readyState < 2){
      if(typeof spawnToastMessage === 'function') spawnToastMessage('La cámara no está lista todavía.');
      return;
    }
    const w = video.videoWidth || W, h = video.videoHeight || H;
    const shot = document.createElement('canvas');
    shot.width = w; shot.height = h;
    const sctx = shot.getContext('2d');
    sctx.drawImage(video, 0, 0, w, h);

    // destello tipo flash de cámara
    flashEl.style.transition = 'none';
    flashEl.style.opacity = '0.85';
    requestAnimationFrame(()=>{
      flashEl.style.transition = 'opacity 400ms ease';
      flashEl.style.opacity = '0';
    });

    shot.toBlob((blob)=>{
      if(!blob){
        if(typeof spawnToastMessage === 'function') spawnToastMessage('No se pudo generar la foto.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const d = new Date();
      const pad = n => String(n).padStart(2,'0');
      const name = `webcam_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.png`;
      a.href = url; a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=> URL.revokeObjectURL(url), 4000);
      if(typeof spawnToastMessage === 'function') spawnToastMessage('📸 Foto guardada: ' + name);
    }, 'image/png', 1.0); // PNG sin pérdida = mejor calidad posible
  }

  function startPhotoCountdown(){
    if(photoBusy) return;
    if(!currentStream || video.readyState < 2){
      if(typeof spawnToastMessage === 'function') spawnToastMessage('Esperá a que la cámara esté lista.');
      return;
    }
    photoBusy = true;
    if(photoBtn) photoBtn.disabled = true;
    let n = 3;
    countdownEl.style.display = 'flex';
    countdownEl.textContent = String(n);
    const tick = ()=>{
      n--;
      if(n > 0){
        countdownEl.textContent = String(n);
        setTimeout(tick, 800);
      } else {
        countdownEl.textContent = '📸';
        setTimeout(()=>{
          countdownEl.style.display = 'none';
          photoBusy = false;
          if(photoBtn) photoBtn.disabled = false;
          capturePhotoBestQuality();
        }, 250);
      }
    };
    setTimeout(tick, 800);
  }

  if(photoBtn){
    photoBtn.addEventListener('click', startPhotoCountdown);
  }

  /* ===================================================================
     GRABAR VIDEO (con audio): usa MediaRecorder sobre el video crudo de
     la cámara (misma idea que la foto: la mejor calidad posible, no el
     canvas chico con filtros) + el micrófono. Se puede iniciar y detener
     cuando se quiera, y al detener se descarga sola al PC. Se intenta
     exportar en MP4; si el navegador no lo soporta (ej. Firefox), se cae
     automáticamente a WebM, que es lo "más fácil" que sí funciona en
     todos lados sin depender de conversores externos.
     =================================================================== */
  const videoBtn = document.getElementById('webcamVideoBtn');
  const videoStatusEl = document.getElementById('webcamVideoStatus');
  const recBadge = document.getElementById('webcamRecBadge');
  const recTimeEl = document.getElementById('webcamRecTime');
  let mediaRecorder = null;
  let recChunksVideo = [];
  let recMicStream = null;
  let recIsRecording = false;
  let recVideoStartTime = 0;
  let recVideoTimerHandle = null;

  function pickBestMimeType(){
    const candidates = [
      'video/mp4;codecs=h264,aac',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    for(const c of candidates){
      if(window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c)) return c;
    }
    return '';
  }

  async function startVideoRecording(){
    if(!currentStream){
      if(typeof spawnToastMessage === 'function') spawnToastMessage('La cámara no está lista todavía.');
      return;
    }
    if(!window.MediaRecorder){
      if(typeof spawnToastMessage === 'function') spawnToastMessage('Este navegador no soporta grabar video.');
      return;
    }
    let mimeType = pickBestMimeType();
    if(!mimeType){
      if(typeof spawnToastMessage === 'function') spawnToastMessage('No se encontró un formato de video soportado.');
      return;
    }

    videoStatusEl.textContent = 'Pidiendo micrófono...';
    try{
      recMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }catch(e){
      recMicStream = null;
      videoStatusEl.textContent = 'Sin micrófono: se graba solo el video.';
    }

    const tracks = [...currentStream.getVideoTracks()];
    if(recMicStream) tracks.push(...recMicStream.getAudioTracks());
    const combined = new MediaStream(tracks);

    recChunksVideo = [];
    try{
      mediaRecorder = new MediaRecorder(combined, { mimeType });
    }catch(e){
      if(typeof spawnToastMessage === 'function') spawnToastMessage('No se pudo iniciar la grabación de video.');
      if(recMicStream){ recMicStream.getTracks().forEach(t=>t.stop()); recMicStream=null; }
      return;
    }
    mediaRecorder.ondataavailable = (e)=>{ if(e.data && e.data.size>0) recChunksVideo.push(e.data); };
    mediaRecorder.onstop = ()=>{
      const blob = new Blob(recChunksVideo, { type: mimeType });
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const d = new Date();
      const pad = n => String(n).padStart(2,'0');
      const name = `webcam_video_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.${ext}`;
      a.href = url; a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=> URL.revokeObjectURL(url), 8000);
      if(typeof spawnToastMessage === 'function') spawnToastMessage('🎬 Video guardado: ' + name);
      videoStatusEl.textContent = ext==='mp4' ? 'Video exportado en MP4.' : 'Video exportado en WebM (tu navegador no soporta MP4 al grabar).';
      if(recMicStream){ recMicStream.getTracks().forEach(t=>t.stop()); recMicStream=null; }
    };

    mediaRecorder.start();
    recIsRecording = true;
    recVideoStartTime = Date.now();
    videoBtn.textContent = '⏹ Detener grabación';
    videoBtn.classList.add('recording');
    if(photoBtn) photoBtn.disabled = true;
    recBadge.style.display = 'flex';
    recTimeEl.textContent = '00:00';
    videoStatusEl.textContent = 'Grabando...';
    recVideoTimerHandle = setInterval(()=>{
      const sec = Math.floor((Date.now()-recVideoStartTime)/1000);
      const m = String(Math.floor(sec/60)).padStart(2,'0');
      const s = String(sec%60).padStart(2,'0');
      recTimeEl.textContent = `${m}:${s}`;
    }, 250);
  }

  function stopVideoRecording(){
    if(!recIsRecording || !mediaRecorder) return;
    recIsRecording = false;
    clearInterval(recVideoTimerHandle);
    recBadge.style.display = 'none';
    videoBtn.textContent = '🔴 Grabar video (con audio)';
    videoBtn.classList.remove('recording');
    if(photoBtn) photoBtn.disabled = false;
    videoStatusEl.textContent = 'Procesando video...';
    mediaRecorder.stop();
  }

  if(videoBtn){
    videoBtn.addEventListener('click', ()=>{
      if(recIsRecording) stopVideoRecording(); else startVideoRecording();
    });
  }

  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    // pedir la cámara apenas carga el escritorio, sin esperar interacción
    startCamera(null);
    if(navigator.mediaDevices.addEventListener){
      navigator.mediaDevices.addEventListener('devicechange', listDevices);
    }
  }else{
    noSignal.textContent = 'Este navegador no soporta acceso a webcam';
    statusEl.textContent = 'No disponible';
  }

  // la ventana de webcam se puede arrastrar igual que el resto (reutiliza el sistema existente)
  makeDraggable(webcamWin);

  // redimensionado manual: arrastrar la esquina inferior derecha
  (function makeResizable(winEl, handleEl){
    let resizing = false, startX=0, startY=0, startW=0, startH=0;
    const MIN_W = 180, MIN_H = 200;

    function onDown(e){
      const isTouch = e.type === 'touchstart';
      const point = isTouch ? e.touches[0] : e;
      resizing = true;
      const r = winEl.getBoundingClientRect();
      winEl.style.position = 'fixed';
      winEl.style.left = r.left + 'px';
      winEl.style.top = r.top + 'px';
      winEl.style.right = 'auto'; winEl.style.margin = '0';
      startX = point.clientX; startY = point.clientY;
      startW = r.width; startH = r.height;
      winEl.style.zIndex = ++dragZ;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, {passive:false});
      document.addEventListener('touchend', onUp);
      e.preventDefault();
      e.stopPropagation();
    }
    function onMove(e){
      if(!resizing) return;
      if(e.type === 'touchmove') e.preventDefault();
      const point = e.type === 'touchmove' ? e.touches[0] : e;
      const dx = point.clientX - startX;
      const dy = point.clientY - startY;
      const newW = Math.max(MIN_W, startW + dx);
      const newH = Math.max(MIN_H, startH + dy);
      winEl.style.width = newW + 'px';
      winEl.style.height = newH + 'px';
    }
    function onUp(){
      resizing = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    }
    handleEl.addEventListener('mousedown', onDown);
    handleEl.addEventListener('touchstart', onDown, {passive:false});
  })(webcamWin, resizeHandle);

  // el body de la ventana debe estirarse junto con la ventana cuando esta crece
  const style = document.createElement('style');
  style.textContent = '#webcamWin{ display:flex; flex-direction:column; } #webcamBody{ flex:1; display:flex; flex-direction:column; min-height:0; } #webcamFrame{ flex:0 0 auto; }';
  document.head.appendChild(style);

  /* ===================================================================
     "VIRUS" AFECTA A LA WEBCAM: se conecta al sistema de glitches global
     (weightedPool / runGlitchTick) para que de la nada la imagen se vea
     trippy, y a veces la ventana se duplique/multiplique en pantalla.
     =================================================================== */
  window.triggerWebcamVirusBurst = function(){
    if(!currentStream) return;
    const now = performance.now();
    glitchBurstUntil = Math.max(glitchBurstUntil, now + 900 + Math.random()*900);
    webcamWin.classList.remove('infected'); void webcamWin.offsetWidth;
    webcamWin.classList.add('infected');
    setTimeout(()=> webcamWin.classList.remove('infected'), 1150);
  };

  window.spawnWebcamClones = function(){
    if(!currentStream || video.readyState < 2) return;
    let dataUrl;
    try{ dataUrl = canvas.toDataURL('image/jpeg', 0.7); }catch(e){ return; }
    const count = 2 + Math.floor(Math.random()*3); // 2 a 4 clones
    const srcRect = webcamWin.getBoundingClientRect();
    for(let i=0;i<count;i++){
      const ghost = document.createElement('div');
      ghost.className = 'webcam-ghost';
      const w = 90 + Math.random()*140;
      const h = w * 0.75;
      const x0 = srcRect.left + srcRect.width/2 - w/2;
      const y0 = srcRect.top + srcRect.height/2 - h/2;
      const ang = Math.random()*Math.PI*2;
      const dist = 60 + Math.random()*220;
      const x2 = Math.max(4, Math.min(window.innerWidth - w - 4, x0 + Math.cos(ang)*dist));
      const y2 = Math.max(4, Math.min(window.innerHeight - h - 4, y0 + Math.sin(ang)*dist));
      ghost.style.width = w+'px';
      ghost.style.height = h+'px';
      ghost.style.setProperty('--gx0', x0+'px');
      ghost.style.setProperty('--gy0', y0+'px');
      ghost.style.setProperty('--gx1', x0+'px');
      ghost.style.setProperty('--gy1', y0+'px');
      ghost.style.setProperty('--gx2', x2+'px');
      ghost.style.setProperty('--gy2', y2+'px');
      ghost.style.setProperty('--grot', (Math.random()*30-15)+'deg');
      ghost.style.setProperty('--ghue', Math.floor(Math.random()*360)+'deg');
      ghost.style.setProperty('--gdur', (1.3 + Math.random()*1.4)+'s');
      ghost.style.left = '0'; ghost.style.top = '0';
      const img = document.createElement('img');
      img.src = dataUrl;
      ghost.appendChild(img);
      document.body.appendChild(ghost);
      setTimeout(()=> ghost.remove(), 3200);
    }
    window.triggerWebcamVirusBurst();
  };

  // sumar estos eventos al ciclo de glitches/virus global, si ya existe
  if(typeof weightedPool !== 'undefined' && Array.isArray(weightedPool)){
    weightedPool.push(
      ()=> window.triggerWebcamVirusBurst && window.triggerWebcamVirusBurst(),
      ()=> window.triggerWebcamVirusBurst && window.triggerWebcamVirusBurst(),
      ()=> window.spawnWebcamClones && window.spawnWebcamClones()
    );
  }
})();
