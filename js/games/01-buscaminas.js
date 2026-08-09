/* =====================================================================
   NUEVO: BUSCAMINAS — jugable de verdad (clic izq. destapa, clic der. marca bandera)
   ===================================================================== */
let minesweeperWinRef = null;
function openMinesweeperWindow(){
  // mismo arreglo que el Solitario: evita ventanas duplicadas apiladas
  if(minesweeperWinRef && document.body.contains(minesweeperWinRef)){
    minesweeperWinRef.style.zIndex = ++dragZ;
    return;
  }
  const ROWS = 9, COLS = 9, MINES = 10;
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '12%'; win.style.left = '32%'; win.style.width = '270px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Buscaminas</div>
      <div class="winbtns"><button class="msClose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="inset" style="display:flex; align-items:center; justify-content:space-between; padding:4px 6px; margin-bottom:6px;">
        <div class="msMineCount" style="font-family:'Courier New',monospace; color:#c00; font-weight:bold;">010</div>
        <button class="btn98 msFace" style="font-size:16px; padding:2px 8px;">🙂</button>
        <div class="msTimer" style="font-family:'Courier New',monospace; color:#c00; font-weight:bold;">000</div>
      </div>
      <div class="msGrid" style="display:grid; grid-template-columns:repeat(${COLS},22px); grid-template-rows:repeat(${ROWS},22px); gap:1px; background:#808080; width:max-content; margin:0 auto;"></div>
      <div class="msMsg" style="font-size:12px; font-weight:bold; text-align:center; color:#008000; margin-top:6px; min-height:14px;"></div>
      <div style="font-size:10px; text-align:center; color:#404040; margin-top:2px;">Clic: destapar · Clic derecho (o mantener presionado): bandera · Clic en número: destapar vecinos</div>
    </div>
  `;
  document.body.appendChild(win);
  minesweeperWinRef = win;
  makeDraggable(win);
  makeResizable(win, 240, 200);
  win.querySelector('.msClose').addEventListener('click', ()=>{ win.remove(); minesweeperWinRef = null; });

  const gridEl = win.querySelector('.msGrid');
  const mineCountEl = win.querySelector('.msMineCount');
  const timerEl = win.querySelector('.msTimer');
  const faceBtn = win.querySelector('.msFace');
  const msMsgEl = win.querySelector('.msMsg');
  let board, revealedCount, flagCount, gameOver, timer, seconds, started, minesPlaced;
  let lastExploded = {r:-1,c:-1};

  function neighbors(r,c){
    const list = [];
    for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++){
      if(dr===0 && dc===0) continue;
      const nr=r+dr, nc=c+dc;
      if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS) list.push([nr,nc]);
    }
    return list;
  }

  function computeCounts(){
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      if(board[r][c].mine){ board[r][c].count = 0; continue; }
      board[r][c].count = neighbors(r,c).filter(([nr,nc])=>board[nr][nc].mine).length;
    }
  }

  function placeMines(avoidR, avoidC){
    // arreglo clásico de buscaminas: el primer clic nunca puede ser mina
    // (ni estar pegado a una), así el juego siempre empieza limpio.
    const forbidden = new Set([avoidR+','+avoidC, ...neighbors(avoidR,avoidC).map(([r,c])=>r+','+c)]);
    let placed = 0;
    let guard = 0;
    while(placed < MINES && guard < 20000){
      guard++;
      const r = Math.floor(Math.random()*ROWS), c = Math.floor(Math.random()*COLS);
      if(board[r][c].mine) continue;
      if(forbidden.has(r+','+c)) continue;
      board[r][c].mine = true; placed++;
    }
    // por si el tablero es tan chico que no caben todas las minas
    // fuera de la zona prohibida, se rellenan las que falten donde se pueda
    while(placed < MINES){
      const r = Math.floor(Math.random()*ROWS), c = Math.floor(Math.random()*COLS);
      if(board[r][c].mine || (r===avoidR && c===avoidC)) continue;
      board[r][c].mine = true; placed++;
    }
    computeCounts();
  }

  function initBoard(){
    board = Array.from({length:ROWS}, ()=> Array.from({length:COLS}, ()=>({mine:false,revealed:false,flagged:false,wrongFlag:false,count:0})));
    minesPlaced = false;
    lastExploded = {r:-1,c:-1};
    revealedCount = 0; flagCount = 0; gameOver = false; seconds = 0; started = false;
    if(timer) clearInterval(timer);
    timerEl.textContent = '000';
    mineCountEl.textContent = String(MINES).padStart(3,'0');
    faceBtn.textContent = '🙂';
    if(msMsgEl) msMsgEl.textContent = '';
  }

  function cellEl(r,c){ return gridEl.children[r*COLS+c]; }

  function render(){
    gridEl.innerHTML = '';
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const cell = board[r][c];
      const d = document.createElement('div');
      d.style.cssText = 'width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;user-select:none;';
      if(cell.revealed){
        d.style.background = '#c0c0c0';
        d.style.border = '1px solid #808080';
        if(cell.mine){
          d.textContent = '💣';
          d.style.background = (r===lastExploded.r && c===lastExploded.c) ? '#ff3030' : '#ff8080';
        }
        else if(cell.count>0){
          const colors = ['','#0000ff','#008000','#ff0000','#000080','#800000','#008080','#000000','#808080'];
          d.style.color = colors[cell.count]; d.textContent = cell.count;
        }
      } else {
        d.style.background = '#c0c0c0';
        d.style.border = '2px outset #fff';
        d.style.cursor = 'pointer';
        if(cell.flagged){
          d.textContent = cell.wrongFlag ? '🚩❌' : '🚩';
          d.style.fontSize = cell.wrongFlag ? '9px' : '12px';
        }
      }
      d.addEventListener('click', ()=>{
        if(cell.revealed && cell.count>0) chord(r,c);
        else reveal(r,c);
      });
      d.addEventListener('contextmenu', (e)=>{ e.preventDefault(); toggleFlag(r,c); });
      // soporte táctil: mantener presionado marca/desmarca bandera (como clic derecho)
      let touchTimer = null, touchMoved = false;
      d.addEventListener('touchstart', (e)=>{
        touchMoved = false;
        touchTimer = setTimeout(()=>{ if(!touchMoved){ toggleFlag(r,c); touchTimer = null; } }, 450);
      }, {passive:true});
      d.addEventListener('touchmove', ()=>{ touchMoved = true; }, {passive:true});
      d.addEventListener('touchend', (e)=>{
        if(touchTimer){
          clearTimeout(touchTimer); touchTimer = null;
          if(!touchMoved){
            e.preventDefault();
            if(cell.revealed && cell.count>0) chord(r,c);
            else reveal(r,c);
          }
        }
      });
      gridEl.appendChild(d);
    }
  }

  function revealFlood(r,c){
    if(r<0||r>=ROWS||c<0||c>=COLS) return;
    const cell = board[r][c];
    if(cell.revealed || cell.flagged) return;
    cell.revealed = true; revealedCount++;
    if(cell.count === 0 && !cell.mine){
      neighbors(r,c).forEach(([nr,nc])=> revealFlood(nr,nc));
    }
  }

  function endWin(){
    gameOver = true;
    clearInterval(timer);
    faceBtn.textContent = '😎';
    // al ganar, se marcan automáticamente todas las minas restantes con bandera
    for(let r2=0;r2<ROWS;r2++) for(let c2=0;c2<COLS;c2++){
      if(board[r2][c2].mine) board[r2][c2].flagged = true;
    }
    flagCount = MINES;
    mineCountEl.textContent = '000';
    msMsgEl.style.color = '#008000';
    msMsgEl.textContent = '🎉 ¡Ganaste! ¡Campo despejado! 🎉';
  }

  function endLoss(r,c){
    lastExploded = {r,c};
    if(board[r][c]) board[r][c].revealed = true;
    gameOver = true;
    clearInterval(timer);
    faceBtn.textContent = '😵';
    for(let r2=0;r2<ROWS;r2++) for(let c2=0;c2<COLS;c2++){
      const cc = board[r2][c2];
      if(cc.mine) cc.revealed = true;
      // muestra banderas mal puestas para que quede claro qué falló
      if(cc.flagged && !cc.mine){ cc.wrongFlag = true; }
    }
    msMsgEl.style.color = '#c00';
    msMsgEl.textContent = '💥 ¡Boom! Inténtalo de nuevo.';
  }

  function reveal(r,c){
    if(gameOver) return;
    const cell = board[r][c];
    if(cell.flagged || cell.revealed) return;
    if(!started){
      started = true;
      // ARREGLO: las minas se colocan recién en el primer clic, evitando
      // esa zona, así el primer clic nunca puede perder de entrada
      placeMines(r,c);
      minesPlaced = true;
      timer = setInterval(()=>{ seconds++; timerEl.textContent = String(Math.min(seconds,999)).padStart(3,'0'); }, 1000);
    }
    if(cell.mine){
      endLoss(r,c);
      render();
      return;
    }
    revealFlood(r,c);
    if(revealedCount === ROWS*COLS - MINES){
      endWin();
    }
    render();
  }

  function chord(r,c){
    // ARREGLO/MEJORA: clic sobre un número ya destapado, si la cantidad de
    // banderas alrededor coincide con el número, destapa el resto de vecinos
    // (comportamiento clásico de buscaminas profesional)
    if(gameOver) return;
    const cell = board[r][c];
    if(!cell.revealed || cell.count === 0) return;
    const nbs = neighbors(r,c);
    const flagged = nbs.filter(([nr,nc])=>board[nr][nc].flagged).length;
    if(flagged !== cell.count) return;
    for(const [nr,nc] of nbs){
      const n = board[nr][nc];
      if(n.flagged || n.revealed) continue;
      if(n.mine){ endLoss(nr,nc); render(); return; }
      revealFlood(nr,nc);
    }
    if(!gameOver && revealedCount === ROWS*COLS - MINES){
      endWin();
    }
    render();
  }

  function toggleFlag(r,c){
    if(gameOver) return;
    const cell = board[r][c];
    if(cell.revealed) return;
    cell.flagged = !cell.flagged;
    flagCount += cell.flagged ? 1 : -1;
    mineCountEl.textContent = String(Math.max(0, MINES - flagCount)).padStart(3,'0');
    render();
  }

  faceBtn.addEventListener('click', ()=>{ initBoard(); render(); });
  initBoard();
  render();
}
document.getElementById('iconMinesweeper').addEventListener('dblclick', openMinesweeperWindow);
