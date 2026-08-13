/* =====================================================================
   MODULO: js/games/06-ajedrez.js
   AJEDREZ KAWAII — versión completa y 100% offline:
   - Movimientos reales de todas las piezas
   - Jaque, jaque mate y ahogado (tablas)
   - Enroque corto/largo, captura al paso, promoción con elección
   - IA local (minimax + poda alfa-beta) para el bando Lavanda,
     sin ningún pedido a servidores: todo corre en el navegador.
   Dos equipos pastel: 🩷 Rosa (humano, abre) vs 💜 Lavanda (IA).
   ===================================================================== */
let ajedrezWinRef = null;

function openAjedrezWindow(){
  if(ajedrezWinRef && document.body.contains(ajedrezWinRef)){
    ajedrezWinRef.style.zIndex = ++dragZ;
    return;
  }

  const PIECE_GLYPH = { king:'♚', queen:'♛', rook:'♜', bishop:'♝', knight:'♞', pawn:'♟' };
  const PIECE_LETTER = { king:'R', queen:'D', rook:'T', bishop:'A', knight:'C', pawn:'' };
  const FILES = ['a','b','c','d','e','f','g','h'];
  const VALUES = { pawn:100, knight:320, bishop:330, rook:500, queen:900, king:20000 };

  const PAWN_PST = [
    [0,0,0,0,0,0,0,0],
    [50,50,50,50,50,50,50,50],
    [10,10,20,30,30,20,10,10],
    [5,5,10,25,25,10,5,5],
    [0,0,0,20,20,0,0,0],
    [5,-5,-10,0,0,-10,-5,5],
    [5,10,10,-20,-20,10,10,5],
    [0,0,0,0,0,0,0,0]
  ];
  const KNIGHT_PST = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,0,0,0,0,-20,-40],
    [-30,0,10,15,15,10,0,-30],
    [-30,5,15,20,20,15,5,-30],
    [-30,0,15,20,20,15,0,-30],
    [-30,5,10,15,15,10,5,-30],
    [-40,-20,0,5,5,0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ];
  const CENTER_PST = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,0,0,0,0,0,0,-10],
    [-10,0,5,5,5,5,0,-10],
    [-10,0,5,10,10,5,0,-10],
    [-10,0,5,10,10,5,0,-10],
    [-10,0,5,5,5,5,0,-10],
    [-10,0,0,0,0,0,0,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ];

  function opposite(color){ return color === 'rosa' ? 'lav' : 'rosa'; }
  function inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8; }

  function makeStartBoard(){
    const back = ['rook','knight','bishop','queen','king','bishop','knight','rook'];
    const board = Array.from({length:8}, ()=> Array(8).fill(null));
    for(let c=0;c<8;c++){
      board[0][c] = {type: back[c], color:'lav', moved:false};
      board[1][c] = {type:'pawn', color:'lav', moved:false};
      board[6][c] = {type:'pawn', color:'rosa', moved:false};
      board[7][c] = {type: back[c], color:'rosa', moved:false};
    }
    return board;
  }

  function cloneBoard(board){
    return board.map(row => row.map(cell => cell ? {...cell} : null));
  }

  /* ---------------- Estado del juego ---------------- */
  let board = makeStartBoard();
  let turn = 'rosa';
  let selected = null;
  let legalTargets = [];
  let gameOver = false;
  let enPassantTarget = null;
  let lastMove = null;
  let capturedByRosa = [];
  let capturedByLav = [];
  let history = [];
  let difficulty = 'normal';
  let aiThinking = false;
  let pendingPromotion = null;

  /* ---------------- Ataques / amenazas ---------------- */
  function slideAttacksTo(board, R, C, dirs, tr, tc){
    for(const [dr,dc] of dirs){
      let nr=R+dr, nc=C+dc;
      while(inBounds(nr,nc)){
        if(nr===tr && nc===tc) return true;
        if(board[nr][nc]) break;
        nr+=dr; nc+=dc;
      }
    }
    return false;
  }

  function isSquareAttacked(board, r, c, byColor){
    for(let R=0;R<8;R++){
      for(let C=0;C<8;C++){
        const p = board[R][C];
        if(!p || p.color !== byColor) continue;
        if(p.type === 'pawn'){
          const dir = byColor === 'rosa' ? -1 : 1;
          if(R+dir === r && (C-1===c || C+1===c)) return true;
        } else if(p.type === 'knight'){
          const dr = Math.abs(R-r), dc = Math.abs(C-c);
          if((dr===2&&dc===1)||(dr===1&&dc===2)) return true;
        } else if(p.type === 'king'){
          if(Math.abs(R-r)<=1 && Math.abs(C-c)<=1 && !(R===r&&C===c)) return true;
        } else if(p.type === 'bishop'){
          if(slideAttacksTo(board,R,C,[[-1,-1],[-1,1],[1,-1],[1,1]],r,c)) return true;
        } else if(p.type === 'rook'){
          if(slideAttacksTo(board,R,C,[[-1,0],[1,0],[0,-1],[0,1]],r,c)) return true;
        } else if(p.type === 'queen'){
          if(slideAttacksTo(board,R,C,[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]],r,c)) return true;
        }
      }
    }
    return false;
  }

  function findKing(board, color){
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const p = board[r][c];
      if(p && p.type==='king' && p.color===color) return {r,c};
    }
    return null;
  }

  function isInCheck(board, color){
    const k = findKing(board, color);
    if(!k) return false;
    return isSquareAttacked(board, k.r, k.c, opposite(color));
  }

  /* ---------------- Movimientos pseudo-legales ---------------- */
  function slideMoves(board, r, c, color, dirs){
    const moves = [];
    dirs.forEach(([dr,dc])=>{
      let nr=r+dr, nc=c+dc;
      while(inBounds(nr,nc)){
        const target = board[nr][nc];
        if(!target){ moves.push({r:nr,c:nc}); }
        else{
          if(target.color !== color) moves.push({r:nr,c:nc});
          break;
        }
        nr+=dr; nc+=dc;
      }
    });
    return moves;
  }

  function pseudoMoves(board, r, c, epTarget){
    const piece = board[r][c];
    if(!piece) return [];
    const color = piece.color;
    let moves = [];
    if(piece.type === 'pawn'){
      const dir = color === 'rosa' ? -1 : 1;
      const startRow = color === 'rosa' ? 6 : 1;
      const lastRow = color === 'rosa' ? 0 : 7;
      if(inBounds(r+dir,c) && !board[r+dir][c]){
        moves.push({r:r+dir, c, promotion: (r+dir===lastRow)});
        if(r===startRow && !board[r+2*dir][c]){
          moves.push({r:r+2*dir, c, doubleStep:true});
        }
      }
      [c-1,c+1].forEach(nc=>{
        if(!inBounds(r+dir,nc)) return;
        const target = board[r+dir][nc];
        if(target && target.color !== color){
          moves.push({r:r+dir, c:nc, promotion:(r+dir===lastRow)});
        } else if(!target && epTarget && epTarget.r===r+dir && epTarget.c===nc){
          moves.push({r:r+dir, c:nc, enPassant:true});
        }
      });
    } else if(piece.type === 'knight'){
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>{
        const nr=r+dr, nc=c+dc;
        if(inBounds(nr,nc)){
          const target = board[nr][nc];
          if(!target || target.color !== color) moves.push({r:nr,c:nc});
        }
      });
    } else if(piece.type === 'bishop'){
      moves = slideMoves(board,r,c,color,[[-1,-1],[-1,1],[1,-1],[1,1]]);
    } else if(piece.type === 'rook'){
      moves = slideMoves(board,r,c,color,[[-1,0],[1,0],[0,-1],[0,1]]);
    } else if(piece.type === 'queen'){
      moves = slideMoves(board,r,c,color,[[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
    } else if(piece.type === 'king'){
      for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
        if(dr===0&&dc===0) continue;
        const nr=r+dr, nc=c+dc;
        if(inBounds(nr,nc)){
          const target = board[nr][nc];
          if(!target || target.color !== color) moves.push({r:nr,c:nc});
        }
      }
      if(!piece.moved && !isInCheck(board, color)){
        const row = r;
        const rookK = board[row][7];
        if(rookK && rookK.type==='rook' && rookK.color===color && !rookK.moved &&
           !board[row][5] && !board[row][6] &&
           !isSquareAttacked(board,row,5,opposite(color)) &&
           !isSquareAttacked(board,row,6,opposite(color))){
          moves.push({r:row, c:6, castle:'K'});
        }
        const rookQ = board[row][0];
        if(rookQ && rookQ.type==='rook' && rookQ.color===color && !rookQ.moved &&
           !board[row][1] && !board[row][2] && !board[row][3] &&
           !isSquareAttacked(board,row,2,opposite(color)) &&
           !isSquareAttacked(board,row,3,opposite(color))){
          moves.push({r:row, c:2, castle:'Q'});
        }
      }
    }
    return moves;
  }

  function applyMove(board, from, to, mv, promotionType){
    const piece = board[from.r][from.c];
    let captured = board[to.r][to.c];
    let newEnPassant = null;

    if(mv.enPassant){
      captured = board[from.r][to.c];
      board[from.r][to.c] = null;
    }

    board[to.r][to.c] = piece;
    board[from.r][from.c] = null;
    piece.moved = true;

    if(piece.type==='pawn' && mv.doubleStep){
      newEnPassant = {r:(from.r+to.r)/2, c: from.c};
    }
    if(piece.type==='pawn' && mv.promotion){
      piece.type = promotionType || 'queen';
    }
    if(mv.castle === 'K'){
      const rook = board[from.r][7];
      board[from.r][5] = rook;
      board[from.r][7] = null;
      if(rook) rook.moved = true;
    } else if(mv.castle === 'Q'){
      const rook = board[from.r][0];
      board[from.r][3] = rook;
      board[from.r][0] = null;
      if(rook) rook.moved = true;
    }
    return { captured, newEnPassant };
  }

  function getLegalMoves(boardRef, r, c, epTarget){
    const piece = boardRef[r][c];
    if(!piece) return [];
    const color = piece.color;
    const pseudo = pseudoMoves(boardRef, r, c, epTarget);
    const legal = [];
    for(const mv of pseudo){
      const testBoard = cloneBoard(boardRef);
      applyMove(testBoard, {r,c}, {r:mv.r,c:mv.c}, mv, 'queen');
      if(!isInCheck(testBoard, color)) legal.push(mv);
    }
    return legal;
  }

  function allLegalMoves(boardRef, color, epTarget){
    const all = [];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const p = boardRef[r][c];
      if(p && p.color===color){
        getLegalMoves(boardRef, r, c, epTarget).forEach(mv=>{
          all.push({from:{r,c}, to:{r:mv.r,c:mv.c}, mv});
        });
      }
    }
    return all;
  }

  /* ---------------- Evaluación e IA ---------------- */
  function pstValue(piece, r, c){
    const row = piece.color === 'rosa' ? r : 7-r;
    if(piece.type==='pawn') return PAWN_PST[row][c];
    if(piece.type==='knight') return KNIGHT_PST[row][c];
    if(piece.type==='bishop'||piece.type==='queen'||piece.type==='king') return CENTER_PST[row][c];
    return 0;
  }

  function evaluateBoard(boardRef){
    let score = 0;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){
      const p = boardRef[r][c];
      if(!p) continue;
      const val = VALUES[p.type] + pstValue(p,r,c);
      score += (p.color==='lav') ? val : -val;
    }
    return score;
  }

  function orderMoves(moves, boardRef){
    return moves.slice().sort((a,b)=>{
      const ca = boardRef[a.to.r][a.to.c] ? 1 : 0;
      const cb = boardRef[b.to.r][b.to.c] ? 1 : 0;
      return cb - ca;
    });
  }

  function minimax(boardRef, depth, alpha, beta, color, epTarget){
    const moves = allLegalMoves(boardRef, color, epTarget);
    if(moves.length === 0){
      if(isInCheck(boardRef, color)){
        return color==='lav' ? -100000 - depth : 100000 + depth;
      }
      return 0;
    }
    if(depth === 0){
      return evaluateBoard(boardRef);
    }
    const ordered = orderMoves(moves, boardRef);
    if(color === 'lav'){
      let best = -Infinity;
      for(const m of ordered){
        const nb = cloneBoard(boardRef);
        const {newEnPassant} = applyMove(nb, m.from, m.to, m.mv, 'queen');
        const val = minimax(nb, depth-1, alpha, beta, opposite(color), newEnPassant);
        best = Math.max(best, val);
        alpha = Math.max(alpha, val);
        if(beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for(const m of ordered){
        const nb = cloneBoard(boardRef);
        const {newEnPassant} = applyMove(nb, m.from, m.to, m.mv, 'queen');
        const val = minimax(nb, depth-1, alpha, beta, opposite(color), newEnPassant);
        best = Math.min(best, val);
        beta = Math.min(beta, val);
        if(beta <= alpha) break;
      }
      return best;
    }
  }

  function pickAiMove(){
    const moves = allLegalMoves(board, 'lav', enPassantTarget);
    if(moves.length === 0) return null;

    if(difficulty === 'facil'){
      const withScore = moves.map(m=>{
        const cap = board[m.to.r][m.to.c];
        let s = cap ? VALUES[cap.type] : 0;
        s += Math.random()*120;
        return {m, s};
      });
      withScore.sort((a,b)=> b.s - a.s);
      return withScore[0].m;
    }

    const depth = difficulty === 'dificil' ? 3 : 2;
    let bestMoves = [];
    let bestVal = -Infinity;
    const ordered = orderMoves(moves, board);
    for(const m of ordered){
      const nb = cloneBoard(board);
      const {newEnPassant} = applyMove(nb, m.from, m.to, m.mv, 'queen');
      const val = minimax(nb, depth-1, -Infinity, Infinity, 'rosa', newEnPassant);
      if(val > bestVal + 0.001){
        bestVal = val; bestMoves = [m];
      } else if(Math.abs(val-bestVal) <= 0.001){
        bestMoves.push(m);
      }
    }
    if(bestMoves.length===0) bestMoves = ordered;
    return bestMoves[Math.floor(Math.random()*bestMoves.length)];
  }

  /* ---------------- UI ---------------- */
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '6%'; win.style.left = '18%'; win.style.width = '440px'; win.style.height = '620px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar" style="background:linear-gradient(90deg,#c9a8ff,#ff9ec7);">
      <div class="ttl"><span class="ico"></span> ♟️ Ajedrez Kawaii ♟️</div>
      <div class="winbtns"><button class="ajClose">✕</button></div>
    </div>
    <div class="win-body ajWrap" style="background:linear-gradient(180deg,#ffe6f2,#ecdcff); padding:10px; overflow:auto;">
      <div class="ajTopBar">
        <button class="btn98 ajNew" style="background:#ffc2dd;">🌸 Nuevo juego</button>
        <div class="ajDifficulty">
          🧠 IA:
          <select class="ajDifficultySel">
            <option value="facil">Fácil</option>
            <option value="normal" selected>Normal</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>
      </div>
      <div class="ajTurn"><span class="dot rosa"></span><span class="ajTurnTxt">Turno: 🩷 Rosa (vos)</span></div>
      <div class="ajCapturedRow"><span class="lbl">💜 capturó:</span><div class="ajCaptured ajCapturedByLav"></div></div>
      <div class="ajBoardOuter">
        <div class="ajGrid"></div>
      </div>
      <div class="ajCapturedRow"><span class="lbl">🩷 capturó:</span><div class="ajCaptured ajCapturedByRosa"></div></div>
      <div class="ajThinking"></div>
      <div class="ajMsg" style="text-align:center; font-size:12px; color:#c2447a; font-weight:bold; margin-top:4px; min-height:16px;"></div>
      <div class="ajHistoryWrap"><b>Jugadas:</b> <span class="ajHistoryTxt">—</span></div>
    </div>
  `;
  document.body.appendChild(win);
  ajedrezWinRef = win;
  makeDraggable(win);
  makeResizable(win, 340, 480);
  win.querySelector('.ajClose').addEventListener('click', ()=>{ win.remove(); ajedrezWinRef = null; });

  const gridEl = win.querySelector('.ajGrid');
  const msgEl = win.querySelector('.ajMsg');
  const turnTxtEl = win.querySelector('.ajTurnTxt');
  const turnDotEl = win.querySelector('.ajTurn .dot');
  const capByRosaEl = win.querySelector('.ajCapturedByRosa');
  const capByLavEl = win.querySelector('.ajCapturedByLav');
  const historyEl = win.querySelector('.ajHistoryTxt');
  const thinkingEl = win.querySelector('.ajThinking');
  const difficultySel = win.querySelector('.ajDifficultySel');
  difficultySel.value = difficulty;
  difficultySel.addEventListener('change', ()=>{ difficulty = difficultySel.value; });

  function newGame(){
    board = makeStartBoard();
    turn = 'rosa';
    selected = null;
    legalTargets = [];
    gameOver = false;
    enPassantTarget = null;
    lastMove = null;
    capturedByRosa = [];
    capturedByLav = [];
    history = [];
    pendingPromotion = null;
    aiThinking = false;
    msgEl.textContent = '';
    thinkingEl.textContent = '';
    render();
  }

  function squareIsTarget(r,c){
    return legalTargets.find(m=> m.r===r && m.c===c) || null;
  }

  function algebraic(r,c){ return FILES[c] + (8-r); }

  function pushHistory(color, piece, from, to, captured, extra){
    const who = color === 'rosa' ? '🩷' : '💜';
    let txt = `${who}${PIECE_LETTER[piece.type]}${algebraic(from.r,from.c)}${captured?'x':'-'}${algebraic(to.r,to.c)}`;
    if(extra) txt += extra;
    history.push(txt);
    historyEl.textContent = history.join('  ');
    historyEl.parentElement.scrollTop = historyEl.parentElement.scrollHeight;
  }

  function afterMoveCheckEnd(colorThatMoved){
    const rival = opposite(colorThatMoved);
    const rivalMoves = allLegalMoves(board, rival, enPassantTarget);
    const rivalInCheck = isInCheck(board, rival);
    if(rivalMoves.length === 0){
      gameOver = true;
      if(rivalInCheck){
        const winnerName = colorThatMoved === 'rosa' ? '🩷 Rosa' : '💜 Lavanda';
        msgEl.textContent = `¡Jaque mate! ${winnerName} gana 👑`;
      } else {
        msgEl.textContent = '¡Tablas por ahogado! 🤝';
      }
      return true;
    }
    if(rivalInCheck){
      msgEl.textContent = (rival==='rosa' ? '🩷 Rosa' : '💜 Lavanda') + ' está en jaque ⚠️';
    } else {
      msgEl.textContent = '';
    }
    return false;
  }

  function finalizeMove(from, to, mv, promotionType){
    const piece = board[from.r][from.c];
    const color = piece.color;
    const { captured, newEnPassant } = applyMove(board, from, to, mv, promotionType);

    if(captured){
      if(color === 'rosa') capturedByRosa.push(captured);
      else capturedByLav.push(captured);
    }

    let extra = '';
    if(mv.castle==='K') extra = ' (enroque corto)';
    else if(mv.castle==='Q') extra = ' (enroque largo)';
    else if(mv.enPassant) extra = ' (al paso)';
    else if(mv.promotion) extra = '=' + PIECE_LETTER[promotionType||'queen'];
    pushHistory(color, {type: mv.promotion ? (promotionType||'queen') : piece.type}, from, to, captured, extra);

    enPassantTarget = newEnPassant;
    lastMove = {from, to};
    selected = null;
    legalTargets = [];

    const ended = afterMoveCheckEnd(color);
    turn = opposite(color);
    render();

    if(!ended && turn === 'lav'){
      scheduleAiTurn();
    }
  }

  function scheduleAiTurn(){
    aiThinking = true;
    thinkingEl.textContent = '💜 Lavanda está pensando...';
    render();
    setTimeout(()=>{
      if(gameOver){ aiThinking = false; thinkingEl.textContent=''; return; }
      const choice = pickAiMove();
      aiThinking = false;
      thinkingEl.textContent = '';
      if(!choice){ render(); return; }
      if(choice.mv.promotion){
        finalizeMove(choice.from, choice.to, choice.mv, 'queen');
      } else {
        finalizeMove(choice.from, choice.to, choice.mv);
      }
    }, 260 + Math.random()*380);
  }

  function onSquareClick(r,c){
    if(gameOver || aiThinking || pendingPromotion || turn !== 'rosa') return;
    const piece = board[r][c];
    const target = selected ? squareIsTarget(r,c) : null;

    if(selected && target){
      if(target.promotion){
        pendingPromotion = {from: {...selected}, to:{r,c}, mv: target};
        render();
        return;
      }
      finalizeMove(selected, {r,c}, target);
      return;
    }

    if(piece && piece.color === turn){
      selected = {r,c};
      legalTargets = getLegalMoves(board, r, c, enPassantTarget);
      render();
      return;
    }

    selected = null;
    legalTargets = [];
    render();
  }

  function choosePromotion(type){
    if(!pendingPromotion) return;
    const {from, to, mv} = pendingPromotion;
    pendingPromotion = null;
    finalizeMove(from, to, mv, type);
  }

  function render(){
    gridEl.innerHTML = '';
    const kingInCheckPos = gameOver ? null : (isInCheck(board, turn) ? findKing(board, turn) : null);

    for(let r=0;r<8;r++){
      const rankLbl = document.createElement('div');
      rankLbl.className = 'ajLabel';
      rankLbl.textContent = 8-r;
      gridEl.appendChild(rankLbl);

      for(let c=0;c<8;c++){
        const sq = document.createElement('div');
        const isLight = (r+c) % 2 === 0;
        sq.className = 'ajSquare ' + (isLight ? 'light' : 'dark');
        const piece = board[r][c];
        if(piece) sq.classList.add(piece.color);

        if(selected && selected.r===r && selected.c===c) sq.classList.add('selected');
        if(lastMove && ((lastMove.from.r===r&&lastMove.from.c===c)||(lastMove.to.r===r&&lastMove.to.c===c))){
          sq.classList.add(lastMove.from.r===r&&lastMove.from.c===c ? 'lastFrom' : 'lastTo');
        }
        if(kingInCheckPos && kingInCheckPos.r===r && kingInCheckPos.c===c) sq.classList.add('inCheck');

        if(piece){
          const span = document.createElement('span');
          span.className = 'ajPiece';
          span.textContent = PIECE_GLYPH[piece.type];
          sq.appendChild(span);
        }

        const tgt = squareIsTarget(r,c);
        if(tgt){
          const dot = document.createElement('div');
          dot.className = 'ajDot' + (piece ? ' capture' : '');
          sq.appendChild(dot);
        }

        sq.addEventListener('click', ()=> onSquareClick(r,c));
        gridEl.appendChild(sq);
      }
    }
    const corner = document.createElement('div');
    corner.className = 'ajLabel';
    gridEl.appendChild(corner);
    FILES.forEach(f=>{
      const lbl = document.createElement('div');
      lbl.className = 'ajLabel';
      lbl.textContent = f;
      gridEl.appendChild(lbl);
    });

    if(pendingPromotion){
      const overlay = document.createElement('div');
      overlay.className = 'ajPromoOverlay';
      const box = document.createElement('div');
      box.className = 'ajPromoBox';
      ['queen','rook','bishop','knight'].forEach(type=>{
        const btn = document.createElement('button');
        btn.textContent = PIECE_GLYPH[type];
        btn.title = type;
        btn.addEventListener('click', ()=> choosePromotion(type));
        box.appendChild(btn);
      });
      overlay.appendChild(box);
      win.querySelector('.ajBoardOuter').appendChild(overlay);
    }

    capByRosaEl.innerHTML = capturedByRosa.map(p=>`<span style="color:#8a4fae;">${PIECE_GLYPH[p.type]}</span>`).join('') || '<span style="opacity:.4;">—</span>';
    capByLavEl.innerHTML = capturedByLav.map(p=>`<span style="color:#ff4f97;">${PIECE_GLYPH[p.type]}</span>`).join('') || '<span style="opacity:.4;">—</span>';

    turnDotEl.className = 'dot ' + (turn==='rosa' ? 'rosa' : 'lav');
    if(gameOver){
      turnTxtEl.textContent = 'Partida terminada';
    } else if(aiThinking){
      turnTxtEl.textContent = 'Turno: 💜 Lavanda (IA)';
    } else {
      turnTxtEl.textContent = turn === 'rosa' ? 'Turno: 🩷 Rosa (vos)' : 'Turno: 💜 Lavanda (IA)';
    }
  }

  win.querySelector('.ajNew').addEventListener('click', newGame);
  newGame();
}

document.getElementById('iconAjedrez').addEventListener('dblclick', openAjedrezWindow);
