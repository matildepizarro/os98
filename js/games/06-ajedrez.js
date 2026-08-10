/* =====================================================================
   MODULO: js/games/06-ajedrez.js
   AJEDREZ KAWAII PASTEL — muy simple: movimientos reales de cada pieza
   (peón, torre, caballo, alfil, reina, rey), sin jaque/jaque mate ni
   enroque ni al paso — se gana capturando el rey rival. Dos equipos
   pastel: 🩷 Rosa vs 💜 Lavanda.
   ===================================================================== */
let ajedrezWinRef = null;

function openAjedrezWindow(){
  if(ajedrezWinRef && document.body.contains(ajedrezWinRef)){
    ajedrezWinRef.style.zIndex = ++dragZ;
    return;
  }

  const PIECE_GLYPH = {
    king:'♚', queen:'♛', rook:'♜', bishop:'♝', knight:'♞', pawn:'♟'
  };

  function makeStartBoard(){
    const back = ['rook','knight','bishop','queen','king','bishop','knight','rook'];
    const board = Array.from({length:8}, ()=> Array(8).fill(null));
    for(let c=0;c<8;c++){
      board[0][c] = {type: back[c], color:'lav'};
      board[1][c] = {type:'pawn', color:'lav'};
      board[6][c] = {type:'pawn', color:'rosa'};
      board[7][c] = {type: back[c], color:'rosa'};
    }
    return board;
  }

  let board = makeStartBoard();
  let turn = 'rosa'; // 'rosa' empieza, como las blancas
  let selected = null; // {r,c}
  let legalTargets = []; // [{r,c}, ...] para la pieza seleccionada
  let gameOver = false;

  function inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8; }

  function slideMoves(r, c, color, dirs){
    const moves = [];
    dirs.forEach(([dr,dc])=>{
      let nr = r+dr, nc = c+dc;
      while(inBounds(nr,nc)){
        const target = board[nr][nc];
        if(!target){ moves.push({r:nr,c:nc}); }
        else{
          if(target.color !== color) moves.push({r:nr,c:nc});
          break;
        }
        nr += dr; nc += dc;
      }
    });
    return moves;
  }

  function getLegalMoves(r, c){
    const piece = board[r][c];
    if(!piece) return [];
    const color = piece.color;
    let moves = [];
    if(piece.type === 'pawn'){
      const dir = color === 'rosa' ? -1 : 1;
      const startRow = color === 'rosa' ? 6 : 1;
      // avance recto
      if(inBounds(r+dir, c) && !board[r+dir][c]){
        moves.push({r:r+dir, c});
        if(r === startRow && !board[r+2*dir][c]){
          moves.push({r:r+2*dir, c});
        }
      }
      // capturas diagonales
      [c-1, c+1].forEach(nc=>{
        if(inBounds(r+dir, nc)){
          const target = board[r+dir][nc];
          if(target && target.color !== color) moves.push({r:r+dir, c:nc});
        }
      });
    } else if(piece.type === 'knight'){
      const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      offsets.forEach(([dr,dc])=>{
        const nr=r+dr, nc=c+dc;
        if(inBounds(nr,nc)){
          const target = board[nr][nc];
          if(!target || target.color !== color) moves.push({r:nr,c:nc});
        }
      });
    } else if(piece.type === 'bishop'){
      moves = slideMoves(r,c,color,[[-1,-1],[-1,1],[1,-1],[1,1]]);
    } else if(piece.type === 'rook'){
      moves = slideMoves(r,c,color,[[-1,0],[1,0],[0,-1],[0,1]]);
    } else if(piece.type === 'queen'){
      moves = slideMoves(r,c,color,[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
    } else if(piece.type === 'king'){
      for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
        if(dr===0 && dc===0) continue;
        const nr=r+dr, nc=c+dc;
        if(inBounds(nr,nc)){
          const target = board[nr][nc];
          if(!target || target.color !== color) moves.push({r:nr,c:nc});
        }
      }
    }
    return moves;
  }

  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '6%'; win.style.left = '20%'; win.style.width = '420px'; win.style.height = '500px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar" style="background:linear-gradient(90deg,#c9a8ff,#ff9ec7);">
      <div class="ttl"><span class="ico"></span> ♟️ Ajedrez Kawaii ♟️</div>
      <div class="winbtns"><button class="ajClose">✕</button></div>
    </div>
    <div class="win-body" style="background:linear-gradient(180deg,#ffe6f2,#ecdcff); padding:10px; overflow:auto; font-family:'Comic Sans MS','Segoe UI',Tahoma,sans-serif;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <button class="btn98 ajNew" style="background:#ffc2dd;">🌸 Nuevo juego</button>
        <div class="ajTurn" style="font-size:12px; font-weight:bold; color:#8a4fae;"></div>
      </div>
      <div class="ajBoard" style="display:grid; grid-template-columns:repeat(8,1fr); width:100%; max-width:360px; aspect-ratio:1/1; margin:0 auto; border:4px solid #c9a8ff; border-radius:10px; overflow:hidden; box-shadow:0 4px 14px rgba(180,120,200,0.25);"></div>
      <div class="ajMsg" style="text-align:center; font-size:12px; color:#c2447a; font-weight:bold; margin-top:10px; min-height:16px;"></div>
    </div>
  `;
  document.body.appendChild(win);
  ajedrezWinRef = win;
  makeDraggable(win);
  makeResizable(win, 320, 400);
  win.querySelector('.ajClose').addEventListener('click', ()=>{ win.remove(); ajedrezWinRef = null; });

  const boardEl = win.querySelector('.ajBoard');
  const msgEl = win.querySelector('.ajMsg');
  const turnEl = win.querySelector('.ajTurn');

  function newGame(){
    board = makeStartBoard();
    turn = 'rosa';
    selected = null;
    legalTargets = [];
    gameOver = false;
    msgEl.textContent = '';
    render();
  }

  function squareIsTarget(r,c){
    return legalTargets.some(m=> m.r===r && m.c===c);
  }

  function onSquareClick(r,c){
    if(gameOver) return;
    const piece = board[r][c];

    if(selected && squareIsTarget(r,c)){
      const captured = board[r][c];
      board[r][c] = board[selected.r][selected.c];
      board[selected.r][selected.c] = null;
      // promoción simple: peón que llega al final se vuelve reina
      const moved = board[r][c];
      if(moved.type === 'pawn' && (r === 0 || r === 7)){
        moved.type = 'queen';
      }
      selected = null;
      legalTargets = [];

      if(captured && captured.type === 'king'){
        gameOver = true;
        const winnerName = turn === 'rosa' ? '🩷 Rosa' : '💜 Lavanda';
        msgEl.textContent = `¡${winnerName} gana capturando al rey! 👑`;
        render();
        return;
      }

      turn = (turn === 'rosa') ? 'lav' : 'rosa';
      render();
      return;
    }

    if(piece && piece.color === turn){
      selected = {r,c};
      legalTargets = getLegalMoves(r,c);
      render();
      return;
    }

    // clic en casillero inválido: deselecciona
    selected = null;
    legalTargets = [];
    render();
  }

  function render(){
    boardEl.innerHTML = '';
    for(let r=0;r<8;r++){
      for(let c=0;c<8;c++){
        const sq = document.createElement('div');
        const isLight = (r+c) % 2 === 0;
        const isSelected = selected && selected.r===r && selected.c===c;
        const isTarget = squareIsTarget(r,c);
        sq.style.display = 'flex';
        sq.style.alignItems = 'center';
        sq.style.justifyContent = 'center';
        sq.style.fontSize = 'clamp(16px, 4.2vw, 26px)';
        sq.style.cursor = 'pointer';
        sq.style.position = 'relative';
        sq.style.userSelect = 'none';
        sq.style.background = isSelected
          ? '#ffe27a'
          : (isLight ? '#ffe0f0' : '#e3d2ff');
        const piece = board[r][c];
        if(piece){
          sq.textContent = PIECE_GLYPH[piece.type];
          sq.style.color = piece.color === 'rosa' ? '#ff5c9e' : '#8a4fae';
          sq.style.textShadow = piece.color === 'rosa'
            ? '0 0 3px rgba(255,255,255,0.9)'
            : '0 0 3px rgba(255,255,255,0.9)';
        }
        if(isTarget){
          const dot = document.createElement('div');
          dot.style.position = 'absolute';
          dot.style.width = '30%';
          dot.style.height = '30%';
          dot.style.borderRadius = '50%';
          dot.style.background = piece ? 'rgba(255,92,158,0.55)' : 'rgba(255,92,158,0.35)';
          if(piece){
            dot.style.width = '92%';
            dot.style.height = '92%';
            dot.style.background = 'transparent';
            dot.style.border = '3px solid rgba(255,92,158,0.65)';
            dot.style.borderRadius = '8px';
          }
          sq.appendChild(dot);
        }
        sq.addEventListener('click', ()=> onSquareClick(r,c));
        boardEl.appendChild(sq);
      }
    }
    turnEl.textContent = gameOver ? '' : (turn === 'rosa' ? 'Turno: 🩷 Rosa' : 'Turno: 💜 Lavanda');
  }

  win.querySelector('.ajNew').addEventListener('click', newGame);
  newGame();
}

document.getElementById('iconAjedrez').addEventListener('dblclick', openAjedrezWindow);
