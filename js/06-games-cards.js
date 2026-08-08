/* =====================================================================
   MODULO: js/06-games-cards.js
   JUEGOS — BUSCAMINAS + SOLITARIO + SUDOKU
   ===================================================================== */

/* =====================================================================
   NUEVO: BUSCAMINAS — jugable de verdad (clic izq. destapa, clic der. marca bandera)
   ===================================================================== */
function openMinesweeperWindow(){
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
  makeDraggable(win);
  makeResizable(win, 240, 200);
  win.querySelector('.msClose').addEventListener('click', ()=> win.remove());

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

/* =====================================================================
   NUEVO: SOLITARIO KAWAII ROSA — Klondike jugable de verdad 💗
   ===================================================================== */
function openSolitarioWindow(){
  const SUITS = [
    {sym:'♥', color:'#ff5c8a'},
    {sym:'♦', color:'#ff5c8a'},
    {sym:'♣', color:'#8a5cff'},
    {sym:'♠', color:'#8a5cff'}
  ];
  const RANK_LABEL = {1:'A',11:'J',12:'Q',13:'K'};

  const win = document.createElement('div');
  win.className = 'winfloat';
  // ARREGLO: en pantallas chicas, un ancho/alto fijo de 620x480 con top/left
  // en porcentaje podía terminar sobresaliendo del viewport (la ventana o
  // sus cartas quedaban parcialmente "fuera de la pantalla"). Ahora el
  // tamaño se ajusta al viewport disponible y la posición queda siempre
  // dentro de los límites visibles.
  const solW = Math.min(620, window.innerWidth - 24);
  const solH = Math.min(480, window.innerHeight - 24);
  win.style.width = solW + 'px'; win.style.height = solH + 'px';
  win.style.top = Math.max(8, window.innerHeight*0.06) + 'px';
  win.style.left = Math.max(8, Math.min(window.innerWidth - solW - 8, window.innerWidth*0.10)) + 'px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar" style="background:linear-gradient(90deg,#ff9ec7,#ff6fa5);">
      <div class="ttl"><span class="ico"></span> 💗 Solitario Kawaii 💗</div>
      <div class="winbtns"><button class="solClose">✕</button></div>
    </div>
    <div class="win-body" style="background:linear-gradient(180deg,#ffe6f2,#ffd1e8); padding:10px; overflow:auto;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <button class="btn98 solNew" style="background:#ffc2dd;">🌸 Nuevo juego</button>
        <div class="solMsg" style="font-family:'Comic Sans MS','Segoe UI',Tahoma,sans-serif; font-size:12px; color:#c2447a; font-weight:bold;"></div>
      </div>
      <div class="solTop" style="display:flex; gap:8px; margin-bottom:14px;"></div>
      <div class="solTableau" style="display:flex; gap:8px;"></div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 480, 380);
  win.querySelector('.solClose').addEventListener('click', ()=>{
    cleanupDrag();
    win.remove();
  });

  const topEl = win.querySelector('.solTop');
  const tableauEl = win.querySelector('.solTableau');
  const msgEl = win.querySelector('.solMsg');

  let stock, waste, foundations, tableau, selection;

  function makeDeck(){
    const deck = [];
    for(let s=0; s<4; s++) for(let r=1; r<=13; r++) deck.push({suit:s, rank:r, faceUp:false, id:s+'-'+r});
    for(let i=deck.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [deck[i],deck[j]] = [deck[j],deck[i]];
    }
    return deck;
  }

  function newGame(){
    const deck = makeDeck();
    tableau = [[],[],[],[],[],[],[]];
    for(let c=0; c<7; c++){
      for(let r=0; r<=c; r++){
        const card = deck.pop();
        card.faceUp = (r === c);
        tableau[c].push(card);
      }
    }
    stock = deck; // resto boca abajo
    waste = [];
    foundations = [[],[],[],[]];
    selection = null;
    msgEl.textContent = '';
    render();
  }

  function cardColor(card){ return SUITS[card.suit].color; }
  function cardLabel(card){ return RANK_LABEL[card.rank] || card.rank; }
  function isRed(card){ return card.suit === 0 || card.suit === 1; }

  function makeCardEl(card, faceUp, opts){
    opts = opts || {};
    const d = document.createElement('div');
    d.style.cssText = `
      width:46px; height:64px; border-radius:8px; position:relative;
      font-family:'Comic Sans MS','Segoe UI',Tahoma,sans-serif;
      box-shadow:1px 2px 3px rgba(0,0,0,0.25);
      user-select:none; -webkit-user-select:none; touch-action:none;
      cursor:${opts.clickable ? 'pointer':'default'};
      flex-shrink:0;
    `;
    if(faceUp){
      d.style.background = '#fff';
      d.style.border = opts.selected ? '3px solid #ff2f8a' : '1px solid #ffb6d5';
      if(opts.selected) d.style.boxShadow = '0 0 8px 2px rgba(255,47,138,0.55)';
      d.innerHTML = `
        <div style="position:absolute; top:2px; left:4px; font-size:11px; font-weight:bold; color:${cardColor(card)}; line-height:1;">
          ${cardLabel(card)}<br>${SUITS[card.suit].sym}
        </div>
        <div style="position:absolute; bottom:2px; right:4px; font-size:11px; font-weight:bold; color:${cardColor(card)}; line-height:1; transform:rotate(180deg);">
          ${cardLabel(card)}<br>${SUITS[card.suit].sym}
        </div>
        <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:16px; color:${cardColor(card)}; opacity:0.85;">
          ${SUITS[card.suit].sym}
        </div>
      `;
    } else {
      d.style.background = 'repeating-linear-gradient(45deg,#ff9ec7,#ff9ec7 6px,#ffc2dd 6px,#ffc2dd 12px)';
      d.style.border = '1px solid #ff6fa5';
      d.innerHTML = `<div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:16px;">🌸</div>`;
    }
    return d;
  }

  function emptySlotEl(label){
    const d = document.createElement('div');
    d.style.cssText = `
      width:46px; height:64px; border-radius:8px; border:2px dashed #ff9ec7;
      display:flex; align-items:center; justify-content:center; font-size:16px; color:#ff9ec7;
      flex-shrink:0;
    `;
    d.textContent = label || '';
    return d;
  }

  function clearSelection(){ selection = null; render(); }

  function canStackTableau(card, onCard){
    if(!onCard) return card.rank === 13; // solo Rey en columna vacía
    return onCard.faceUp && (onCard.rank === card.rank + 1) && (isRed(card) !== isRed(onCard));
  }
  function canStackFoundation(card, pile){
    if(pile.length === 0) return card.rank === 1;
    const top = pile[pile.length-1];
    return top.suit === card.suit && top.rank === card.rank - 1;
  }

  function getRunFrom(colIdx, cardIdx){
    const col = tableau[colIdx];
    const run = col.slice(cardIdx);
    if(!run.every(c=>c.faceUp)) return null;
    for(let i=0; i<run.length-1; i++){
      const a = run[i], b = run[i+1];
      if(!(a.rank === b.rank + 1 && isRed(a) !== isRed(b))) return null;
    }
    return run;
  }

  /* ---------- Ventanita kawaii que felicita a Deborah ---------- */
  const DEBORAH_MESSAGES = [
    '¡Excelente jugada, Deborah! 💗',
    '¡Vas increíble, Deborah! 🌸',
    '¡Otra carta más, Deborah! ¡Sigue así! 💕',
    '¡Eso es, Deborah! ✨',
    '¡Deborah, eres una crack del solitario! 💖'
  ];
  let deborahPopupCount = 0;
  function showDeborahCongrats(msg){
    deborahPopupCount++;
    if(deborahPopupCount > 4) return; // evita que se acumulen demasiadas
    const pop = document.createElement('div');
    pop.className = 'winfloat';
    const topPct = 15 + Math.random()*40;
    const leftPct = 15 + Math.random()*40;
    pop.style.top = topPct + '%';
    pop.style.left = leftPct + '%';
    pop.style.width = '260px';
    pop.style.zIndex = ++dragZ;
    pop.innerHTML = `
      <div class="titlebar" style="background:linear-gradient(90deg,#ff9ec7,#ff4fa0);">
        <div class="ttl"><span class="ico"></span> 💌 Mensaje especial</div>
        <div class="winbtns"><button class="debClose">✕</button></div>
      </div>
      <div class="win-body" style="background:linear-gradient(180deg,#fff0f7,#ffe0f0); text-align:center; font-family:'Comic Sans MS','Segoe UI',Tahoma,sans-serif; padding:14px;">
        <div style="font-size:26px; margin-bottom:6px;">💗🌸💕</div>
        <div style="font-size:13px; color:#c2447a; font-weight:bold;">${msg}</div>
        <div style="margin-top:10px;"><button class="btn98 debClose" style="background:#ffc2dd;">Gracias 💖</button></div>
      </div>
    `;
    document.body.appendChild(pop);
    makeDraggable(pop);
    function close(){ pop.remove(); deborahPopupCount = Math.max(0, deborahPopupCount-1); }
    pop.querySelectorAll('.debClose').forEach(b=> b.addEventListener('click', close));
    setTimeout(close, 4200);
  }

  /* =====================================================================
     LÓGICA DE MOVIMIENTOS — funciones "puras" reutilizadas tanto por el
     clic simple como por arrastrar y soltar, para que ambos sean 100%
     confiables y usen exactamente las mismas reglas.
     ===================================================================== */
  function getMovableCardsFrom(source){
    if(source.type === 'waste'){
      return waste.length ? [waste[waste.length-1]] : null;
    }
    if(source.type === 'foundation'){
      const pile = foundations[source.colIdx];
      return pile.length ? [pile[pile.length-1]] : null;
    }
    if(source.type === 'tableau'){
      const run = getRunFrom(source.colIdx, source.cardIdx);
      // ARREGLO: una columna vacía devolvía un arreglo vacío ([]), que en
      // JS es "truthy", así que el juego creía que había una carta para
      // seleccionar/arrastrar donde en realidad no había ninguna.
      return (run && run.length > 0) ? run : null;
    }
    return null;
  }
  function removeFromSource(source, count){
    if(source.type === 'waste'){ waste.pop(); return; }
    if(source.type === 'foundation'){ foundations[source.colIdx].pop(); return; }
    if(source.type === 'tableau'){ tableau[source.colIdx].splice(source.cardIdx, count); return; }
  }
  function isSameSpot(a,b){
    if(!a || !b) return false;
    return a.type===b.type && a.colIdx===b.colIdx && a.cardIdx===b.cardIdx;
  }
  function attemptMove(source, target){
    if(!source || !target) return false;
    if(isSameSpot(source, target)) return false;
    const cards = getMovableCardsFrom(source);
    if(!cards || cards.length === 0) return false;
    const firstCard = cards[0];
    let ok = false;

    if(target.type === 'foundation'){
      if(cards.length === 1 && canStackFoundation(firstCard, foundations[target.colIdx])){
        removeFromSource(source, cards.length);
        foundations[target.colIdx].push(firstCard);
        ok = true;
        showDeborahCongrats(DEBORAH_MESSAGES[Math.floor(Math.random()*DEBORAH_MESSAGES.length)]);
      }
    } else if(target.type === 'tableau'){
      const col = tableau[target.colIdx];
      const topCard = col.length ? col[col.length-1] : null;
      if(canStackTableau(firstCard, topCard)){
        removeFromSource(source, cards.length);
        tableau[target.colIdx].push(...cards);
        ok = true;
      }
    }
    if(ok){
      if(source.type === 'tableau') flipTopIfNeeded(source.colIdx);
      checkWin();
    }
    return ok;
  }
  function tryAutoFoundation(source){
    const cards = getMovableCardsFrom(source);
    if(!cards || cards.length !== 1) return false;
    const card = cards[0];
    for(let f=0; f<4; f++){
      if(card.suit === f && canStackFoundation(card, foundations[f])){
        return attemptMove(source, {type:'foundation', colIdx:f});
      }
    }
    return false;
  }
  function flipTopIfNeeded(colIdx){
    const col = tableau[colIdx];
    if(col.length && !col[col.length-1].faceUp){
      col[col.length-1].faceUp = true;
    }
  }
  function checkWin(){
    const total = foundations.reduce((a,p)=>a+p.length,0);
    if(total === 52){
      msgEl.textContent = '🎉💗 ¡Ganaste! ¡Feliz cumpleaños, Matilde! 💗🎉';
      showDeborahCongrats('¡GANASTE, DEBORAH! 🏆💗 ¡Eres la reina absoluta del solitario! 👑💕');
    }
  }

  /* =====================================================================
     ARRASTRAR Y SOLTAR — usa mouse y touch. Si el puntero casi no se mueve
     se trata como un simple clic (más abajo). Mientras arrastra, la carta
     sigue al puntero y al soltar se detecta el destino con elementFromPoint.
     ===================================================================== */
  let dragCtx = null; // {source, cards, ghosts, startX, startY, moved}

  function cleanupDrag(){
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend', onPointerUp);
    document.removeEventListener('touchcancel', onPointerCancel);
    if(dragCtx && dragCtx.ghosts){
      dragCtx.ghosts.forEach(g=> g.remove());
    }
    // por si quedara algún fantasma huérfano de un arrastre anterior
    document.querySelectorAll('.solDragGhost').forEach(g=> g.remove());
    dragCtx = null;
    render();
  }
  // cancela el arrastre en curso sin intentar mover nada (se usa cuando el
  // toque se interrumpe a mitad de camino)
  function onPointerCancel(){
    if(!dragCtx) return;
    cleanupDrag();
    selection = null;
    render();
  }
  // red de seguridad extra: si por cualquier motivo el navegador pierde el
  // puntero (se cambia de pestaña/app, se bloquea la pantalla, etc.) sin
  // disparar ni touchend ni touchcancel, esto asegura que no quede una
  // carta fantasma flotando para siempre.
  document.addEventListener('visibilitychange', ()=>{ if(document.hidden) onPointerCancel(); });
  window.addEventListener('blur', onPointerCancel);
  // ARREGLO: si el mouse sale del todo del documento (por ejemplo se suelta
  // encima de la barra de tareas u otra ventana del sistema, fuera del
  // <html>) a veces ni "blur" ni "mouseup" llegaban a dispararse, dejando
  // la carta arrastrada pegada y flotando afuera del solitario para
  // siempre. Este listener detecta ese caso puntual y cancela el arrastre.
  document.addEventListener('mouseout', (e)=>{
    if(dragCtx && dragCtx.moved && !e.relatedTarget && !e.toElement) onPointerCancel();
  });

  function attachInteraction(el, source, opts){
    opts = opts || {};
    el.addEventListener('mousedown', (e)=> onPointerDown(e, source));
    el.addEventListener('touchstart', (e)=> onPointerDown(e, source), {passive:false});
  }

  function onPointerDown(e, source){
    if(e.cancelable) e.preventDefault();
    e.stopPropagation();
    // ARREGLO: el mazo (stock) no es arrastrable, solo clickeable. Antes
    // getMovableCardsFrom() no reconocía 'stock' y devolvía null, así que
    // el clic sobre el mazo nunca hacía nada y era imposible robar cartas
    // ni reciclar el descarte, dejando el juego imposible de terminar.
    if(source.type === 'stock'){
      handleClick(source);
      return;
    }
    const cards = getMovableCardsFrom(source);
    if(!cards || cards.length === 0) return;
    if(dragCtx) cleanupDrag(); // por seguridad, nunca dos arrastres a la vez
    const p = e.touches ? e.touches[0] : e;
    dragCtx = { source, cards, startX:p.clientX, startY:p.clientY, moved:false, ghosts:[] };
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchmove', onPointerMove, {passive:false});
    document.addEventListener('touchend', onPointerUp);
    // ARREGLO CLAVE: si el dedo se levanta por una interrupción del sistema
    // (una notificación, un gesto de navegación, cambiar de app, etc.) el
    // navegador dispara "touchcancel" en vez de "touchend", y como antes
    // no se escuchaba ese evento, dragCtx quedaba "vivo" para siempre con
    // su carta fantasma pegada al dedo: por eso las cartas se podían
    // arrastrar a cualquier parte de la pantalla y quedaban flotando por
    // encima de todo (incluso por encima de otras ventanas y de las
    // ventanas de error/glitch), ya que nunca se limpiaban.
    document.addEventListener('touchcancel', onPointerCancel);
  }

  function findSourceEl(source){
    if(source.type === 'waste') return win.querySelector('.solWasteCard');
    if(source.type === 'foundation') return win.querySelector('.solFoundationCard[data-col="'+source.colIdx+'"]');
    if(source.type === 'tableau') return win.querySelector('.solTabCard[data-col="'+source.colIdx+'"][data-idx="'+source.cardIdx+'"]');
    return null;
  }

  function onPointerMove(e){
    if(!dragCtx) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - dragCtx.startX;
    const dy = p.clientY - dragCtx.startY;
    if(!dragCtx.moved && Math.hypot(dx,dy) > 6){
      dragCtx.moved = true;
      const srcEl = findSourceEl(dragCtx.source);
      const rect = srcEl ? srcEl.getBoundingClientRect() : {left:p.clientX-23, top:p.clientY-32};
      dragCtx.baseLeft = rect.left; dragCtx.baseTop = rect.top;
      dragCtx.cards.forEach((card, i)=>{
        const g = makeCardEl(card, true, {});
        g.className += ' solDragGhost';
        g.style.position = 'fixed';
        g.style.left = rect.left + 'px';
        g.style.top = (rect.top + i*18) + 'px';
        // ARREGLO: antes usaba un z-index fijo altísimo (99999), así que si
        // el arrastre quedaba "pegado" (ver onPointerCancel más abajo) la
        // carta terminaba flotando por ENCIMA de cualquier otra ventana,
        // incluidas las ventanitas de error/virus del glitch. Ahora queda
        // apenas por encima de la propia ventana del Solitario.
        g.style.zIndex = (parseInt(win.style.zIndex,10) || dragZ) + 50 + i;
        g.style.pointerEvents = 'none';
        g.style.transform = 'scale(1.04)';
        g.style.boxShadow = '2px 4px 10px rgba(0,0,0,0.35)';
        document.body.appendChild(g);
        dragCtx.ghosts.push(g);
      });
      render(); // oculta el origen (las cartas movidas no se dibujan mientras se arrastran)
    }
    if(dragCtx.moved){
      if(e.cancelable) e.preventDefault();
      // ARREGLO: antes la carta fantasma seguía al mouse sin límites, así
      // que si el puntero se iba de golpe hacia el borde de la pantalla (o
      // el evento se perdía a mitad de camino) la carta terminaba flotando
      // fuera de la ventana del solitario, incluso sobre el escritorio.
      // Ahora se recorta siempre dentro del área visible.
      const gw = 46, gh = 64;
      // ARREGLO: antes se recortaba contra window.innerWidth/innerHeight (todo
      // el navegador), así que la carta igual podía terminar visualmente
      // fuera de la ventana del Solitario, sobre el escritorio. Ahora se
      // recorta contra los límites de la propia ventana del juego.
      const winRect = win.getBoundingClientRect();
      dragCtx.ghosts.forEach((g,i)=>{
        let gx = dragCtx.baseLeft + dx;
        let gy = dragCtx.baseTop + dy + i*18;
        gx = Math.max(winRect.left, Math.min(winRect.right - gw, gx));
        gy = Math.max(winRect.top, Math.min(winRect.bottom - gh, gy));
        g.style.left = gx + 'px';
        g.style.top = gy + 'px';
      });
    }
  }

  function detectDropTarget(clientX, clientY){
    dragCtx.ghosts.forEach(g=> g.style.display = 'none');
    const el = document.elementFromPoint(clientX, clientY);
    dragCtx.ghosts.forEach(g=> g.style.display = '');
    if(!el) return null;
    const foundationEl = el.closest('.solFoundationSlot');
    if(foundationEl) return {type:'foundation', colIdx: parseInt(foundationEl.dataset.col,10)};
    const colEl = el.closest('.solColSlot');
    if(colEl) return {type:'tableau', colIdx: parseInt(colEl.dataset.col,10)};
    return null;
  }

  function onPointerUp(e){
    if(!dragCtx) return;
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend', onPointerUp);
    document.removeEventListener('touchcancel', onPointerCancel);

    const ctx = dragCtx;
    dragCtx = null;

    if(!ctx.moved){
      // fue un clic simple, no un arrastre
      handleClick(ctx.source);
      return;
    }

    const p = e.changedTouches ? e.changedTouches[0] : e;
    const target = detectDropTarget(p.clientX, p.clientY);
    ctx.ghosts.forEach(g=> g.remove());

    let didMove = false;
    if(target) didMove = attemptMove(ctx.source, target);
    selection = null;
    render();
    if(!didMove){
      // pequeña sacudida visual de feedback cuando el movimiento no es válido
      win.classList.add('shake');
      setTimeout(()=> win.classList.remove('shake'), 150);
    }
  }

  /* ---------- Clic simple (sin arrastre): auto-fundación o selección ---------- */
  function handleClick(source){
    if(source.type === 'stock'){
      if(stock.length > 0){
        const card = stock.pop();
        card.faceUp = true;
        waste.push(card);
      } else {
        while(waste.length){ const c = waste.pop(); c.faceUp = false; stock.push(c); }
      }
      selection = null;
      render();
      return;
    }

    if(selection){
      if(isSameSpot(selection, source)){
        selection = null; render(); return;
      }
      const moved = attemptMove(selection, source);
      selection = null;
      if(!moved && (source.type === 'waste' || source.type === 'tableau' || source.type === 'foundation')){
        // si no se pudo mover ahí, seleccionamos esta nueva carta en su lugar
        const cards = getMovableCardsFrom(source);
        if(cards) selection = source;
      }
      render();
      return;
    }

    // sin selección previa: primero probamos mandarla directo a la fundación
    if(source.type === 'waste' || source.type === 'tableau'){
      if(tryAutoFoundation(source)){ render(); return; }
    }
    const cards = getMovableCardsFrom(source);
    if(cards){ selection = source; render(); }
  }

  function render(){
    topEl.innerHTML = '';
    tableauEl.innerHTML = '';

    // Stock
    const stockWrap = document.createElement('div');
    if(stock.length > 0){
      const c = makeCardEl(null, false, {clickable:true});
      attachInteraction(c, {type:'stock'});
      stockWrap.appendChild(c);
    } else {
      const slot = emptySlotEl('♻️');
      slot.style.cursor = 'pointer';
      attachInteraction(slot, {type:'stock'});
      stockWrap.appendChild(slot);
    }
    topEl.appendChild(stockWrap);

    // Waste
    const wasteWrap = document.createElement('div');
    if(waste.length > 0 && !(dragCtx && dragCtx.source.type==='waste' && dragCtx.moved)){
      const top = waste[waste.length-1];
      const sel = selection && selection.type === 'waste';
      const c = makeCardEl(top, true, {clickable:true, selected:sel});
      c.className += ' solWasteCard';
      attachInteraction(c, {type:'waste'});
      wasteWrap.appendChild(c);
    } else {
      wasteWrap.appendChild(emptySlotEl());
    }
    topEl.appendChild(wasteWrap);

    const spacer = document.createElement('div');
    spacer.style.cssText = 'flex:1;';
    topEl.appendChild(spacer);

    // Foundations
    for(let f=0; f<4; f++){
      const pile = foundations[f];
      const wrap = document.createElement('div');
      wrap.className = 'solFoundationSlot';
      wrap.dataset.col = f;
      wrap.style.cssText = 'width:46px; height:64px;';
      const isDraggingThis = dragCtx && dragCtx.source.type==='foundation' && dragCtx.source.colIdx===f && dragCtx.moved;
      if(pile.length > 0 && !isDraggingThis){
        const top = pile[pile.length-1];
        const sel = selection && selection.type === 'foundation' && selection.colIdx === f;
        const c = makeCardEl(top, true, {clickable:true, selected:sel});
        c.className += ' solFoundationCard';
        c.dataset.col = f;
        attachInteraction(c, {type:'foundation', colIdx:f});
        wrap.appendChild(c);
      } else {
        const slot = emptySlotEl(SUITS[f].sym);
        slot.style.color = SUITS[f].color;
        slot.style.cursor = 'pointer';
        wrap.appendChild(slot);
      }
      topEl.appendChild(wrap);
    }

    // Tableau
    for(let colIdx=0; colIdx<7; colIdx++){
      const col = tableau[colIdx];
      const colWrap = document.createElement('div');
      colWrap.className = 'solColSlot';
      colWrap.dataset.col = colIdx;
      colWrap.style.cssText = 'position:relative; width:46px; min-height:220px;';
      const draggingFromHere = dragCtx && dragCtx.source.type==='tableau' && dragCtx.source.colIdx===colIdx && dragCtx.moved
        ? dragCtx.source.cardIdx : null;
      if(col.length === 0){
        const slot = emptySlotEl('');
        slot.style.position = 'absolute'; slot.style.top = '0';
        slot.style.cursor = 'pointer';
        // ARREGLO: antes las columnas vacías no tenían ningún listener,
        // así que solo se les podía soltar una carta arrastrando, pero un
        // clic simple (seleccionar carta + clic en la columna vacía) no
        // funcionaba nunca, bloqueando la jugada clásica de mover un Rey
        // a un espacio vacío.
        attachInteraction(slot, {type:'tableau', colIdx, cardIdx:0});
        colWrap.appendChild(slot);
      } else {
        col.forEach((card, cardIdx)=>{
          if(draggingFromHere !== null && cardIdx >= draggingFromHere) return; // se dibuja como carta "fantasma" flotante
          const sel = selection && selection.type === 'tableau' && selection.colIdx === colIdx && cardIdx >= selection.cardIdx;
          const c = makeCardEl(card, card.faceUp, {clickable:card.faceUp, selected:sel});
          c.style.position = 'absolute';
          c.style.top = (cardIdx * 18) + 'px';
          c.style.zIndex = cardIdx;
          if(card.faceUp){
            c.className += ' solTabCard';
            c.dataset.col = colIdx; c.dataset.idx = cardIdx;
            attachInteraction(c, {type:'tableau', colIdx, cardIdx});
          } else {
            c.style.cursor = 'default';
          }
          colWrap.appendChild(c);
        });
      }
      tableauEl.appendChild(colWrap);
    }
  }

  win.querySelector('.solNew').addEventListener('click', newGame);
  newGame();
}
document.getElementById('iconSolitario').addEventListener('dblclick', openSolitarioWindow);

/* =====================================================================
   NUEVO: SUDOKU KAWAII ROSA — completo, con generador, validación,
   dificultades, notas, resaltado de errores y verificación de victoria 🌸
   ===================================================================== */
function openSudokuWindow(){
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '6%'; win.style.left = '18%'; win.style.width = '480px'; win.style.height = '560px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar" style="background:linear-gradient(90deg,#ff9ec7,#ff6fa5);">
      <div class="ttl"><span class="ico"></span> 🌸 Sudoku Kawaii 🌸</div>
      <div class="winbtns"><button class="sudClose">✕</button></div>
    </div>
    <div class="win-body" style="background:linear-gradient(180deg,#ffe6f2,#ffd1e8); padding:10px; overflow:auto; font-family:'Comic Sans MS','Segoe UI',Tahoma,sans-serif;">
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
        <div style="display:flex; gap:4px; align-items:center;">
          <select class="sudDifficulty btn98" style="font-family:inherit; font-size:11px;">
            <option value="36">🌷 Fácil</option>
            <option value="46" selected>🌸 Medio</option>
            <option value="54">🌺 Difícil</option>
          </select>
          <button class="btn98 sudNew" style="background:#ffc2dd;">✨ Nuevo</button>
        </div>
        <div style="display:flex; gap:4px;">
          <button class="btn98 sudNotes" style="background:#ffe0ef;">✏️ Notas: OFF</button>
          <button class="btn98 sudErase" style="background:#ffe0ef;">🧹 Borrar</button>
          <button class="btn98 sudCheck" style="background:#ffe0ef;">💗 Revisar</button>
          <button class="btn98 sudSolve" style="background:#ffb6d9;">🎀 Resolver</button>
        </div>
      </div>
      <div class="sudGrid" style="display:grid; grid-template-columns:repeat(9,1fr); width:100%; max-width:400px; aspect-ratio:1/1; margin:0 auto; background:#c2447a; gap:1px; border:3px solid #c2447a; border-radius:8px; overflow:hidden;"></div>
      <div class="sudPad" style="display:grid; grid-template-columns:repeat(9,1fr); gap:4px; max-width:400px; margin:10px auto 0;"></div>
      <div class="sudMsg" style="text-align:center; font-size:12px; color:#c2447a; font-weight:bold; margin-top:8px; min-height:16px;"></div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 360, 460);
  win.querySelector('.sudClose').addEventListener('click', ()=> win.remove());

  const gridEl = win.querySelector('.sudGrid');
  const padEl = win.querySelector('.sudPad');
  const msgEl = win.querySelector('.sudMsg');
  const notesBtn = win.querySelector('.sudNotes');
  const difficultySel = win.querySelector('.sudDifficulty');

  let solution, puzzle, given, userGrid, notesGrid, selectedCell, notesMode = false;

  /* ---------- generación de un sudoku válido (backtracking + shuffle) ---------- */
  function emptyGrid(){ return Array.from({length:9}, ()=> Array(9).fill(0)); }

  function isValidPlacement(grid, r, c, val){
    for(let i=0; i<9; i++){
      if(grid[r][i] === val) return false;
      if(grid[i][c] === val) return false;
    }
    const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
    for(let dr=0; dr<3; dr++) for(let dc=0; dc<3; dc++){
      if(grid[br+dr][bc+dc] === val) return false;
    }
    return true;
  }

  function shuffledNums(){
    const nums = [1,2,3,4,5,6,7,8,9];
    for(let i=nums.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [nums[i],nums[j]] = [nums[j],nums[i]];
    }
    return nums;
  }

  function fillGrid(grid){
    for(let r=0; r<9; r++){
      for(let c=0; c<9; c++){
        if(grid[r][c] === 0){
          for(const val of shuffledNums()){
            if(isValidPlacement(grid, r, c, val)){
              grid[r][c] = val;
              if(fillGrid(grid)) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function countSolutions(grid, limit){
    // cuenta soluciones hasta 'limit' para asegurar que el sudoku generado sea único
    for(let r=0; r<9; r++){
      for(let c=0; c<9; c++){
        if(grid[r][c] === 0){
          let count = 0;
          for(let val=1; val<=9; val++){
            if(isValidPlacement(grid, r, c, val)){
              grid[r][c] = val;
              count += countSolutions(grid, limit - count);
              grid[r][c] = 0;
              if(count >= limit) return count;
            }
          }
          return count;
        }
      }
    }
    return 1;
  }

  function generatePuzzle(cellsToRemove){
    const solved = emptyGrid();
    fillGrid(solved);
    const puz = solved.map(row=>row.slice());
    const positions = [];
    for(let r=0; r<9; r++) for(let c=0; c<9; c++) positions.push([r,c]);
    for(let i=positions.length-1; i>0; i--){
      const j = Math.floor(Math.random()*(i+1));
      [positions[i],positions[j]] = [positions[j],positions[i]];
    }
    let removed = 0;
    for(const [r,c] of positions){
      if(removed >= cellsToRemove) break;
      const backup = puz[r][c];
      puz[r][c] = 0;
      const copy = puz.map(row=>row.slice());
      if(countSolutions(copy, 2) !== 1){
        puz[r][c] = backup; // no rompe unicidad si se puede evitar
      } else {
        removed++;
      }
    }
    return { solved, puzzle: puz };
  }

  function newGame(){
    msgEl.textContent = '⏳ Generando un sudoku bonito...';
    setTimeout(()=>{
      const cellsToRemove = parseInt(difficultySel.value, 10);
      const gen = generatePuzzle(cellsToRemove);
      solution = gen.solved;
      puzzle = gen.puzzle;
      given = puzzle.map(row=> row.map(v=> v !== 0));
      userGrid = puzzle.map(row=> row.slice());
      notesGrid = Array.from({length:9}, ()=> Array.from({length:9}, ()=> new Set()));
      selectedCell = null;
      msgEl.textContent = '';
      render();
    }, 30);
  }

  /* ---------- interacción ---------- */
  function selectCell(r, c){
    selectedCell = {r, c};
    render();
  }

  function setCellValue(r, c, val){
    if(given[r][c]) return;
    if(notesMode){
      if(val === 0){ notesGrid[r][c].clear(); }
      else {
        if(notesGrid[r][c].has(val)) notesGrid[r][c].delete(val);
        else notesGrid[r][c].add(val);
      }
    } else {
      userGrid[r][c] = val;
      if(val !== 0) notesGrid[r][c].clear();
    }
    render();
    checkWinSilently();
  }

  function checkWinSilently(){
    for(let r=0; r<9; r++) for(let c=0; c<9; c++){
      if(userGrid[r][c] !== solution[r][c]) return;
    }
    msgEl.textContent = '🎉🌸 ¡Sudoku completo y perfecto! ¡Felicidades! 🌸🎉';
  }

  function checkErrorsNow(){
    let anyError = false;
    for(let r=0; r<9; r++) for(let c=0; c<9; c++){
      if(userGrid[r][c] !== 0 && !given[r][c] && userGrid[r][c] !== solution[r][c]) anyError = true;
    }
    let filled = true;
    for(let r=0; r<9; r++) for(let c=0; c<9; c++) if(userGrid[r][c] === 0) filled = false;
    if(anyError) msgEl.textContent = '💗 Hay numeritos que no van ahí, revisa el rosado fuerte.';
    else if(filled) msgEl.textContent = '🎉🌸 ¡Sudoku completo y perfecto! ¡Felicidades! 🌸🎉';
    else msgEl.textContent = '✅ Vas bien, ningún error por ahora.';
    render(true);
  }

  function solveNow(){
    for(let r=0; r<9; r++) for(let c=0; c<9; c++){
      userGrid[r][c] = solution[r][c];
      notesGrid[r][c].clear();
    }
    selectedCell = null;
    msgEl.textContent = '🎀 Sudoku resuelto por ti mismo (bueno, casi). ¡Aquí está la solución! 💗';
    render();
  }

  /* ---------- render ---------- */
  function render(showErrors){
    gridEl.innerHTML = '';
    for(let r=0; r<9; r++){
      for(let c=0; c<9; c++){
        const cell = document.createElement('div');
        const val = userGrid[r][c];
        const isGiven = given[r][c];
        const isSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;
        const isPeer = selectedCell && !isSelected && (selectedCell.r === r || selectedCell.c === c ||
          (Math.floor(selectedCell.r/3) === Math.floor(r/3) && Math.floor(selectedCell.c/3) === Math.floor(c/3)));
        const sameNumber = selectedCell && val !== 0 && userGrid[selectedCell.r][selectedCell.c] === val && !isSelected;
        const isError = showErrors && val !== 0 && !isGiven && val !== solution[r][c];

        let bg = '#fff';
        if(isSelected) bg = '#ffb6d9';
        else if(sameNumber) bg = '#ffd7ea';
        else if(isPeer) bg = '#fff0f7';
        if(isError) bg = '#ffc2c2';

        cell.style.cssText = `
          background:${bg}; display:flex; align-items:center; justify-content:center;
          font-size:16px; font-weight:${isGiven ? 'bold':'normal'};
          color:${isGiven ? '#8a3a63' : (isError ? '#c00' : '#c2447a')};
          cursor:pointer; position:relative; aspect-ratio:1/1;
          border-right:${(c%3===2 && c!==8) ? '2px solid #c2447a' : '1px solid #ffd1e8'};
          border-bottom:${(r%3===2 && r!==8) ? '2px solid #c2447a' : '1px solid #ffd1e8'};
        `;
        if(val !== 0){
          cell.textContent = val;
        } else if(notesGrid[r][c].size){
          const notesWrap = document.createElement('div');
          notesWrap.style.cssText = 'position:absolute; inset:1px; display:grid; grid-template-columns:repeat(3,1fr); font-size:8px; color:#c2447a; opacity:0.85;';
          for(let n=1; n<=9; n++){
            const ns = document.createElement('div');
            ns.style.cssText = 'display:flex; align-items:center; justify-content:center;';
            ns.textContent = notesGrid[r][c].has(n) ? n : '';
            notesWrap.appendChild(ns);
          }
          cell.appendChild(notesWrap);
        }
        cell.addEventListener('click', ()=> selectCell(r,c));
        gridEl.appendChild(cell);
      }
    }

    // teclado numérico
    padEl.innerHTML = '';
    for(let n=1; n<=9; n++){
      const b = document.createElement('button');
      b.className = 'btn98';
      b.style.cssText = 'background:#fff0f7; font-size:14px; padding:6px 0; font-family:inherit;';
      b.textContent = n;
      b.addEventListener('click', ()=>{
        if(!selectedCell) return;
        setCellValue(selectedCell.r, selectedCell.c, n);
      });
      padEl.appendChild(b);
    }
  }

  win.querySelector('.sudErase').addEventListener('click', ()=>{
    if(!selectedCell) return;
    setCellValue(selectedCell.r, selectedCell.c, 0);
  });
  win.querySelector('.sudCheck').addEventListener('click', checkErrorsNow);
  win.querySelector('.sudSolve').addEventListener('click', ()=>{
    // ARREGLO: antes revelaba la solución completa con un solo clic sin
    // avisar, perdiendo sin querer todo el progreso; ahora pide confirmación
    if(confirm('¿Segura que quieres ver la solución completa? Perderás tu progreso actual 💗')){
      solveNow();
    }
  });
  notesBtn.addEventListener('click', ()=>{
    notesMode = !notesMode;
    notesBtn.textContent = notesMode ? '✏️ Notas: ON' : '✏️ Notas: OFF';
    notesBtn.style.background = notesMode ? '#ffb6d9' : '#ffe0ef';
  });
  win.querySelector('.sudNew').addEventListener('click', newGame);

  // soporte de teclado físico cuando la ventana está enfocada
  win.tabIndex = 0;
  win.addEventListener('keydown', (e)=>{
    if(!selectedCell) return;
    if(e.key >= '1' && e.key <= '9'){ setCellValue(selectedCell.r, selectedCell.c, parseInt(e.key,10)); }
    else if(e.key === 'Backspace' || e.key === 'Delete' || e.key === '0'){ setCellValue(selectedCell.r, selectedCell.c, 0); }
    else if(e.key === 'ArrowUp' && selectedCell.r>0){ selectCell(selectedCell.r-1, selectedCell.c); }
    else if(e.key === 'ArrowDown' && selectedCell.r<8){ selectCell(selectedCell.r+1, selectedCell.c); }
    else if(e.key === 'ArrowLeft' && selectedCell.c>0){ selectCell(selectedCell.r, selectedCell.c-1); }
    else if(e.key === 'ArrowRight' && selectedCell.c<8){ selectCell(selectedCell.r, selectedCell.c+1); }
  });

  newGame();
}
document.getElementById('iconSudoku').addEventListener('dblclick', openSudokuWindow);
