/* =====================================================================
   NUEVO: SUDOKU KAWAII ROSA — completo, con generador, validación,
   dificultades, notas, resaltado de errores y verificación de victoria 🌸
   ===================================================================== */
let sudokuWinRef = null;
function openSudokuWindow(){
  // mismo arreglo que el Solitario: evita ventanas duplicadas apiladas
  if(sudokuWinRef && document.body.contains(sudokuWinRef)){
    sudokuWinRef.style.zIndex = ++dragZ;
    return;
  }
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
  sudokuWinRef = win;
  makeDraggable(win);
  makeResizable(win, 360, 460);
  win.querySelector('.sudClose').addEventListener('click', ()=>{ win.remove(); sudokuWinRef = null; });

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
