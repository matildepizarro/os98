/* =====================================================================
   TETRIS KAWAII — todo rosa, piezas con carita, tablero 10x20
   ===================================================================== */
(function(){
  'use strict';

  if(!document.getElementById('kpTetrisStyle')){
    const style = document.createElement('style');
    style.id = 'kpTetrisStyle';
    style.textContent = `
      .ktBody{ position:relative; width:100%; height:100%; overflow:hidden; display:flex;
        align-items:center; justify-content:center; touch-action:none;
        background: radial-gradient(ellipse at 50% 0%, #fff0fa 0%, #ffc9e6 55%, #ff8fc9 100%); }
      .ktWrap{ display:flex; gap:10px; align-items:flex-start; padding:10px; }
      .ktBoardWrap{ background:#fff0fa; border:3px solid #ff8fc9; border-radius:10px; padding:6px;
        box-shadow:0 6px 16px rgba(150,20,90,.3); }
      .ktCanvas{ display:block; background:#ffe3f2; border-radius:4px; }
      .ktSide{ display:flex; flex-direction:column; gap:10px; width:110px;
        font-family:'W98',Tahoma,sans-serif; color:#7a1257; }
      .ktPanel{ background:#fff0fa; border:3px solid #ff8fc9; border-radius:10px; padding:8px;
        box-shadow:0 6px 16px rgba(150,20,90,.3); text-align:center; }
      .ktPanel .lbl{ font-size:11px; font-weight:bold; opacity:.8; margin-bottom:4px; }
      .ktPanel .val{ font-size:16px; font-weight:bold; }
      .ktNextCanvas{ display:block; margin:0 auto; background:#ffe3f2; border-radius:4px; }
      .ktBtns{ display:flex; flex-direction:column; gap:6px; }
      .ktBtns button{ font-family:'W98',Tahoma,sans-serif; font-size:11px; padding:5px 4px;
        border-radius:8px; border:2px solid #ff8fc9; background:#ffd6ec; color:#7a1257;
        cursor:pointer; font-weight:bold; }
      .ktBtns button:active{ background:#ff8fc9; }
      .ktTouchRow{ position:absolute; left:0; right:0; bottom:0; display:flex; z-index:6;
        pointer-events:none; }
      .ktTBtn{ flex:1; pointer-events:auto; padding:10px 0; text-align:center; font-size:20px;
        background:rgba(255,255,255,0.55); border-top:2px solid #ff8fc9; user-select:none; }
      .ktTBtn:active{ background:rgba(255,143,201,0.6); }
      .ktGameOver{ position:absolute; inset:0; display:none; align-items:center; justify-content:center;
        background:rgba(255,192,225,0.6); z-index:8; backdrop-filter:blur(1px); }
      .ktGoCard{ background:#fff0fa; border:3px solid #ff8fc9; border-radius:16px;
        padding:18px 22px; text-align:center; box-shadow:0 6px 18px rgba(120,10,70,.4);
        font-family:'W98',Tahoma,sans-serif; color:#7a1257; }
      .ktGoCard .ttl{ font-size:18px; font-weight:bold; margin-bottom:6px; }
      .ktGoCard .sc{ font-size:14px; margin-bottom:10px; }
      .ktGoCard button{ font-family:'W98',Tahoma,sans-serif; font-size:12px; padding:6px 14px;
        border-radius:10px; border:2px solid #ff8fc9; background:#ffd6ec; color:#7a1257;
        cursor:pointer; font-weight:bold; }
      .ktGoCard button:active{ background:#ff8fc9; }
      .ktPaused{ position:absolute; inset:0; display:none; align-items:center; justify-content:center;
        background:rgba(255,230,245,0.55); z-index:7; font-family:'W98',Tahoma,sans-serif;
        color:#7a1257; font-size:16px; font-weight:bold; }
      .ktHelp{ font-size:12px; line-height:1.5; }
      @media (max-width:520px){
        .ktWrap{ flex-direction:column; align-items:center; }
        .ktSide{ flex-direction:row; width:auto; flex-wrap:wrap; justify-content:center; }
        .ktPanel{ flex:1 1 70px; }
      }
    `;
    document.head.appendChild(style);
  }

  const COLS = 10, ROWS = 20;
  // paleta 100% rosada/kawaii — cada pieza en un tono distinto de rosa/lila
  const PIECE_COLORS = {
    I: ['#ff9fd6','#ffe1f2'],
    O: ['#ffd166','#fff2cf'],
    T: ['#c99bff','#f1e3ff'],
    S: ['#ff6fb8','#ffe1f0'],
    Z: ['#ff5f9e','#ffd9e8'],
    J: ['#8fb8ff','#e3edff'],
    L: ['#ff8fc9','#ffe6f5'],
  };
  const SHAPES = {
    I: [[0,1],[1,1],[2,1],[3,1]],
    O: [[1,0],[2,0],[1,1],[2,1]],
    T: [[1,0],[0,1],[1,1],[2,1]],
    S: [[1,0],[2,0],[0,1],[1,1]],
    Z: [[0,0],[1,0],[1,1],[2,1]],
    J: [[0,0],[0,1],[1,1],[2,1]],
    L: [[2,0],[0,1],[1,1],[2,1]],
  };
  const KEYS = Object.keys(SHAPES);

  function rotateCells(cells, times){
    let c = cells;
    for(let t=0;t<((times%4)+4)%4;t++){
      c = c.map(([x,y])=>[y, 3-x]);
    }
    return c;
  }

  function newPiece(kind){
    return { kind, rot:0, cells: SHAPES[kind], x:3, y:-1 };
  }
  function randomKind(){ return KEYS[Math.floor(Math.random()*KEYS.length)]; }

  function cellsFor(piece){ return rotateCells(piece.cells, piece.rot); }

  function makeBoard(){
    const g = [];
    for(let r=0;r<ROWS;r++) g.push(new Array(COLS).fill(null));
    return g;
  }

  function collides(board, piece, dx, dy, rotDelta){
    const cells = rotateCells(piece.cells, piece.rot + (rotDelta||0));
    for(const [cx,cy] of cells){
      const x = piece.x+cx+dx, y = piece.y+cy+dy;
      if(x<0||x>=COLS||y>=ROWS) return true;
      if(y>=0 && board[y][x]) return true;
    }
    return false;
  }

  function lockPiece(board, piece){
    const cells = cellsFor(piece);
    for(const [cx,cy] of cells){
      const x=piece.x+cx, y=piece.y+cy;
      if(y>=0 && y<ROWS && x>=0 && x<COLS) board[y][x] = piece.kind;
    }
  }

  function clearLines(board){
    let cleared = 0;
    for(let r=ROWS-1;r>=0;r--){
      if(board[r].every(c=>c)){
        board.splice(r,1);
        board.unshift(new Array(COLS).fill(null));
        cleared++; r++;
      }
    }
    return cleared;
  }

  const LINE_SCORES = [0, 100, 300, 500, 800];
  const DROP_BASE = 800; // ms nivel 1

  function makeState(){
    const state = {
      board: makeBoard(),
      current: newPiece(randomKind()),
      next: randomKind(),
      score:0, lines:0, level:1,
      dropTimer:0, dropInterval: DROP_BASE,
      gameOver:false, paused:false,
      flashRows: [], flashTimer:0,
    };
    return state;
  }

  function trySpawn(state){
    state.current = newPiece(state.next);
    state.next = randomKind();
    if(collides(state.board, state.current, 0, 0, 0)){
      state.gameOver = true;
    }
  }

  function hardDropDistance(state){
    let d = 0;
    while(!collides(state.board, state.current, 0, d+1, 0)) d++;
    return d;
  }

  function lockAndScore(state, SND){
    lockPiece(state.board, state.current);
    const cleared = clearLines(state.board);
    if(cleared>0){
      state.score += LINE_SCORES[cleared] * state.level;
      state.lines += cleared;
      const newLevel = 1 + Math.floor(state.lines/10);
      if(newLevel !== state.level){ state.level = newLevel; }
      state.dropInterval = Math.max(90, DROP_BASE - (state.level-1)*70);
      if(SND) SND.clear(cleared);
    } else if(SND){ SND.lock(); }
    trySpawn(state);
  }

  /* ---------------- Sonidos (comparte tono simple con Pinball, propio aquí) ---------------- */
  let sharedCtx = null;
  function getCtx(){
    if(!sharedCtx){
      try{ sharedCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; }
    }
    if(sharedCtx.state === 'suspended'){ sharedCtx.resume().catch(()=>{}); }
    return sharedCtx;
  }
  function tone(freq, dur, opts){
    const ctx = getCtx(); if(!ctx) return;
    opts = opts||{};
    const t0 = ctx.currentTime + (opts.delay||0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = opts.type||'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if(opts.sweepTo){ osc.frequency.linearRampToValueAtTime(opts.sweepTo, t0+dur); }
    const peak = opts.gain!==undefined ? opts.gain : 0.16;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak, t0+Math.min(0.015,dur*0.3));
    gain.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t0); osc.stop(t0+dur+0.02);
  }
  const SND = {
    move(){ tone(300,0.03,{type:'square',gain:0.06}); },
    rotate(){ tone(420,0.05,{type:'square',gain:0.08}); },
    lock(){ tone(220,0.06,{type:'triangle',gain:0.10}); },
    clear(n){
      const base = 500 + n*80;
      [0,1,2].forEach(i=> tone(base+i*160, 0.09, {type:'sine', gain:0.14, delay:i*0.05}));
    },
    gameover(){
      [523.25,440,349.23,261.63].forEach((f,i)=> tone(f,0.18,{type:'sine',gain:0.15,delay:i*0.12}));
    },
    hard(){ tone(150,0.08,{type:'sawtooth',gain:0.12}); },
  };

  /* ---------------- Render ---------------- */
  function roundRectPath(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }
  function drawCell(ctx, px, py, size, colors, flash){
    const pad = 1.5;
    ctx.save();
    if(flash){ ctx.shadowColor='#fff'; ctx.shadowBlur=10; }
    const grad = ctx.createLinearGradient(px,py,px,py+size);
    grad.addColorStop(0, flash ? '#fff' : colors[1]);
    grad.addColorStop(1, flash ? '#ffe1f2' : colors[0]);
    ctx.fillStyle = grad;
    roundRectPath(ctx, px+pad, py+pad, size-pad*2, size-pad*2, 4);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    // carita chiquita
    ctx.fillStyle = 'rgba(122,18,87,0.55)';
    ctx.beginPath(); ctx.arc(px+size*0.36, py+size*0.42, size*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(px+size*0.64, py+size*0.42, size*0.05, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function render(ctx, size, state){
    ctx.clearRect(0,0,COLS*size, ROWS*size);
    ctx.fillStyle = '#ffe3f2';
    ctx.fillRect(0,0,COLS*size,ROWS*size);
    ctx.strokeStyle = 'rgba(255,143,201,0.25)';
    ctx.lineWidth = 1;
    for(let c=0;c<=COLS;c++){ ctx.beginPath(); ctx.moveTo(c*size,0); ctx.lineTo(c*size,ROWS*size); ctx.stroke(); }
    for(let r=0;r<=ROWS;r++){ ctx.beginPath(); ctx.moveTo(0,r*size); ctx.lineTo(COLS*size,r*size); ctx.stroke(); }

    for(let r=0;r<ROWS;r++){
      const flashing = state.flashRows.includes(r) && state.flashTimer>0;
      for(let c=0;c<COLS;c++){
        const v = state.board[r][c];
        if(v) drawCell(ctx, c*size, r*size, size, PIECE_COLORS[v], flashing);
      }
    }
    if(!state.gameOver){
      // sombra de caída (ghost piece)
      const ghostDist = hardDropDistance(state);
      const ghostCells = cellsFor(state.current);
      ctx.save();
      ctx.globalAlpha = 0.28;
      for(const [cx,cy] of ghostCells){
        const x = state.current.x+cx, y = state.current.y+cy+ghostDist;
        if(y>=0) drawCell(ctx, x*size, y*size, size, PIECE_COLORS[state.current.kind], false);
      }
      ctx.restore();

      const cells = cellsFor(state.current);
      for(const [cx,cy] of cells){
        const x = state.current.x+cx, y = state.current.y+cy;
        if(y>=0) drawCell(ctx, x*size, y*size, size, PIECE_COLORS[state.current.kind], false);
      }
    }
  }

  function renderNext(ctx, size, kind){
    ctx.clearRect(0,0,4*size,3*size);
    const cells = SHAPES[kind];
    let minX=9,maxX=-9,minY=9,maxY=-9;
    for(const [x,y] of cells){ minX=Math.min(minX,x); maxX=Math.max(maxX,x); minY=Math.min(minY,y); maxY=Math.max(maxY,y); }
    const w=(maxX-minX+1), h=(maxY-minY+1);
    const offX = (4-w)/2 - minX, offY = (3-h)/2 - minY;
    for(const [x,y] of cells){
      drawCell(ctx, (x+offX)*size, (y+offY)*size, size, PIECE_COLORS[kind], false);
    }
  }

  /* ---------------- Integración con ventana del sistema ---------------- */
  let tetrisWinCount = 0;
  const activeGames = [];
  let globalKeysBound = false;

  function bindGlobalKeysOnce(){
    if(globalKeysBound) return;
    globalKeysBound = true;
    document.addEventListener('keydown', (e)=>{
      const g = activeGames.find(g=>g.active);
      if(!g || g.state.gameOver) {
        if(g && g.state.gameOver && e.key.toLowerCase()==='r') g.restart();
        return;
      }
      const k = e.key.toLowerCase();
      if(k==='arrowleft'||k==='a'){ g.move(-1); e.preventDefault(); }
      if(k==='arrowright'||k==='d'){ g.move(1); e.preventDefault(); }
      if(k==='arrowup'||k==='w'||k==='x'){ g.rotate(1); e.preventDefault(); }
      if(k==='z'){ g.rotate(-1); e.preventDefault(); }
      if(k==='arrowdown'||k==='s'){ g.softDrop(true); e.preventDefault(); }
      if(k===' '){ g.hardDrop(); e.preventDefault(); }
      if(k==='p'){ g.togglePause(); e.preventDefault(); }
    });
    document.addEventListener('keyup', (e)=>{
      const g = activeGames.find(g=>g.active);
      if(!g) return;
      const k = e.key.toLowerCase();
      if(k==='arrowdown'||k==='s'){ g.softDrop(false); }
    });
  }

  window.openTetrisWindow = function openTetrisWindow(){
    bindGlobalKeysOnce();
    tetrisWinCount++;
    const win = document.createElement('div');
    win.className = 'winfloat';
    win.style.top = (6 + tetrisWinCount*2) + '%';
    win.style.left = (18 + tetrisWinCount*2) + '%';
    win.style.width = '420px'; win.style.height = '560px';
    win.style.zIndex = ++dragZ;
    win.innerHTML = `
      <div class="titlebar">
        <div class="ttl"><span class="ico"></span> 💗 Tetris Kawaii</div>
        <div class="winbtns">
          <button class="ktHelpBtn" title="Controles">?</button>
          <button class="ktClose">✕</button>
        </div>
      </div>
      <div class="ktHelpPanel ktHelp" style="display:none; flex:0 0 auto; background:#ffffe1; border-bottom:1px solid #808080; padding:6px 8px;">
        <b>Controles:</b>
        ← → / A D = mover &nbsp;|&nbsp; ↑ / X = rotar &nbsp;|&nbsp; Z = rotar al revés &nbsp;|&nbsp;
        ↓ / S = bajar rápido &nbsp;|&nbsp; Espacio = caída instantánea &nbsp;|&nbsp; P = pausa &nbsp;|&nbsp; R = reiniciar al perder<br>
        En pantallas táctiles usá los botones de abajo.
      </div>
      <div class="win-body" style="padding:0; position:relative; overflow:hidden;">
        <div class="ktBody">
          <div class="ktWrap">
            <div class="ktBoardWrap"><canvas class="ktCanvas"></canvas></div>
            <div class="ktSide">
              <div class="ktPanel"><div class="lbl">PUNTAJE</div><div class="val ktScore">0</div></div>
              <div class="ktPanel"><div class="lbl">LÍNEAS</div><div class="val ktLines">0</div></div>
              <div class="ktPanel"><div class="lbl">NIVEL</div><div class="val ktLevel">1</div></div>
              <div class="ktPanel"><div class="lbl">SIGUIENTE</div><canvas class="ktNextCanvas" width="88" height="66"></canvas></div>
              <div class="ktBtns">
                <button class="ktPauseBtn">⏸ Pausa</button>
              </div>
            </div>
          </div>
          <div class="ktTouchRow">
            <div class="ktTBtn" data-act="left">◀</div>
            <div class="ktTBtn" data-act="rotate">⟳</div>
            <div class="ktTBtn" data-act="down">▼</div>
            <div class="ktTBtn" data-act="drop">⤓</div>
            <div class="ktTBtn" data-act="right">▶</div>
          </div>
          <div class="ktPaused">⏸ PAUSA 💗</div>
          <div class="ktGameOver">
            <div class="ktGoCard">
              <div class="ttl">💗 GAME OVER 💗</div>
              <div class="sc">Puntaje: <span class="ktFinalScore">0</span></div>
              <button class="ktRestart">Jugar de nuevo ✨</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(win);
    makeDraggable(win);
    makeResizable(win, 300, 420);

    const body = win.querySelector('.win-body');
    const ktBody = win.querySelector('.ktBody');
    const canvas = win.querySelector('.ktCanvas');
    const ctx = canvas.getContext('2d');
    const nextCanvas = win.querySelector('.ktNextCanvas');
    const nextCtx = nextCanvas.getContext('2d');
    const scoreEl = win.querySelector('.ktScore');
    const linesEl = win.querySelector('.ktLines');
    const levelEl = win.querySelector('.ktLevel');
    const goScreen = win.querySelector('.ktGameOver');
    const finalScoreEl = win.querySelector('.ktFinalScore');
    const restartBtn = win.querySelector('.ktRestart');
    const pausedOverlay = win.querySelector('.ktPaused');
    const pauseBtn = win.querySelector('.ktPauseBtn');
    const helpBtn = win.querySelector('.ktHelpBtn');
    const helpPanel = win.querySelector('.ktHelpPanel');

    let state = makeState();
    let cellSize = 24;

    const game = {
      active:true, state,
      move(dir){
        if(state.paused||state.gameOver) return;
        if(!collides(state.board, state.current, dir, 0, 0)){ state.current.x += dir; SND.move(); }
      },
      rotate(dir){
        if(state.paused||state.gameOver) return;
        const kicks = [0,-1,1,-2,2];
        for(const k of kicks){
          if(!collides(state.board, state.current, k, 0, dir)){
            state.current.rot = ((state.current.rot + dir)%4+4)%4;
            state.current.x += k;
            SND.rotate();
            return;
          }
        }
      },
      softDrop(v){ softDropping = v; },
      hardDrop(){
        if(state.paused||state.gameOver) return;
        const d = hardDropDistance(state);
        state.current.y += d;
        state.score += d*2;
        SND.hard();
        lockAndScore(state, SND);
        state.dropTimer = 0;
      },
      togglePause(){
        if(state.gameOver) return;
        state.paused = !state.paused;
        pausedOverlay.style.display = state.paused ? 'flex' : 'none';
      },
      restart(){
        state = makeState();
        game.state = state;
        goScreen.style.display = 'none';
        pausedOverlay.style.display = 'none';
      },
    };
    activeGames.push(game);
    activeGames.forEach(g=> g.active = (g===game));
    let softDropping = false;

    function setActive(){
      activeGames.forEach(g=> g.active = (g===game));
      win.style.zIndex = ++dragZ;
      getCtx();
    }
    ktBody.addEventListener('mousedown', setActive);
    ktBody.addEventListener('touchstart', setActive, {passive:true});
    win.querySelector('.titlebar').addEventListener('mousedown', ()=>{ win.style.zIndex = ++dragZ; });

    function fitCanvas(){
      const availW = body.clientWidth - 130;
      const availH = body.clientHeight - 30;
      const size = Math.max(10, Math.floor(Math.min(availW/COLS, availH/ROWS)));
      cellSize = size;
      canvas.width = COLS*size;
      canvas.height = ROWS*size;
    }
    let ro;
    if(typeof ResizeObserver !== 'undefined'){
      ro = new ResizeObserver(fitCanvas);
      ro.observe(body);
    } else {
      window.addEventListener('resize', fitCanvas);
    }
    fitCanvas();

    // controles táctiles
    win.querySelectorAll('.ktTBtn').forEach(btn=>{
      const act = btn.dataset.act;
      function down(e){
        e.preventDefault(); setActive();
        if(act==='left') game.move(-1);
        else if(act==='right') game.move(1);
        else if(act==='rotate') game.rotate(1);
        else if(act==='down') game.softDrop(true);
        else if(act==='drop') game.hardDrop();
      }
      function up(e){ if(act==='down') game.softDrop(false); }
      btn.addEventListener('mousedown', down);
      btn.addEventListener('touchstart', down, {passive:false});
      ['mouseup','mouseleave','touchend','touchcancel'].forEach(ev=> btn.addEventListener(ev, up));
    });

    pauseBtn.addEventListener('mousedown', (e)=> e.stopPropagation());
    pauseBtn.addEventListener('click', ()=> game.togglePause());
    restartBtn.addEventListener('mousedown', (e)=> e.stopPropagation());
    restartBtn.addEventListener('click', ()=> game.restart());
    helpBtn.addEventListener('mousedown', (e)=> e.stopPropagation());
    helpBtn.addEventListener('click', ()=>{
      helpPanel.style.display = helpPanel.style.display === 'none' ? 'flex' : 'none';
    });

    win.querySelector('.ktClose').addEventListener('click', ()=>{
      cancelAnimationFrame(raf);
      const idx = activeGames.indexOf(game);
      if(idx>=0) activeGames.splice(idx,1);
      if(ro) ro.disconnect(); else window.removeEventListener('resize', fitCanvas);
      win.remove();
    });

    window.addEventListener('blur', ()=>{ softDropping = false; });

    let last = performance.now();
    let softDropAccum = 0;
    let raf;
    function loop(now){
      raf = requestAnimationFrame(loop);
      let dt = (now-last)/1000;
      last = now;
      dt = Math.min(dt, 1/20);

      if(!state.paused && !state.gameOver){
        state.dropTimer += dt*1000;
        const interval = softDropping ? Math.min(state.dropInterval, 50) : state.dropInterval;
        if(state.dropTimer >= interval){
          state.dropTimer = 0;
          if(!collides(state.board, state.current, 0, 1, 0)){
            state.current.y += 1;
            if(softDropping) state.score += 1;
          } else {
            lockAndScore(state, SND);
            if(state.gameOver){
              SND.gameover();
              finalScoreEl.textContent = state.score;
              goScreen.style.display = 'flex';
            }
          }
        }
      }

      render(ctx, cellSize, state);
      renderNext(nextCtx, 20, state.next);
      scoreEl.textContent = state.score;
      linesEl.textContent = state.lines;
      levelEl.textContent = state.level;
    }
    raf = requestAnimationFrame(loop);
  };

})();
document.getElementById('iconTetris').addEventListener('dblclick', openTetrisWindow);
document.getElementById('pmTetris').addEventListener('click', ()=>{
  openTetrisWindow(); closeStartMenu();
});
