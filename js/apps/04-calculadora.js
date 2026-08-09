/* =====================================================================
   NUEVO: CALCULADORA — operativa (suma, resta, multiplica, divide, %, etc.)
   ===================================================================== */
let calcWinRef = null;
function openCalcWindow(){
  if(calcWinRef && document.body.contains(calcWinRef)){
    calcWinRef.style.zIndex = ++dragZ;
    return;
  }
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '20%'; win.style.left = '40%'; win.style.width = '210px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Calculadora</div>
      <div class="winbtns"><button class="calcClose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="inset" style="margin-bottom:6px;">
        <div class="calcDisplay" style="text-align:right; font-family:'Courier New',monospace; font-size:18px; padding:6px; min-height:22px; overflow:hidden; white-space:nowrap;">0</div>
      </div>
      <div class="calcGrid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:4px;">
        <button class="btn98 calcBtn" data-act="clear" style="grid-column:span 2;">C</button>
        <button class="btn98 calcBtn" data-act="back">⌫</button>
        <button class="btn98 calcBtn" data-op="/">÷</button>
        <button class="btn98 calcBtn" data-num="7">7</button>
        <button class="btn98 calcBtn" data-num="8">8</button>
        <button class="btn98 calcBtn" data-num="9">9</button>
        <button class="btn98 calcBtn" data-op="*">×</button>
        <button class="btn98 calcBtn" data-num="4">4</button>
        <button class="btn98 calcBtn" data-num="5">5</button>
        <button class="btn98 calcBtn" data-num="6">6</button>
        <button class="btn98 calcBtn" data-op="-">−</button>
        <button class="btn98 calcBtn" data-num="1">1</button>
        <button class="btn98 calcBtn" data-num="2">2</button>
        <button class="btn98 calcBtn" data-num="3">3</button>
        <button class="btn98 calcBtn" data-op="+">+</button>
        <button class="btn98 calcBtn" data-num="0" style="grid-column:span 2;">0</button>
        <button class="btn98 calcBtn" data-num=".">.</button>
        <button class="btn98 calcBtn" data-act="equals">=</button>
      </div>
    </div>
  `;
  document.body.appendChild(win);
  calcWinRef = win;
  makeDraggable(win);
  makeResizable(win, 180, 220);
  win.querySelector('.calcClose').addEventListener('click', ()=>{ win.remove(); calcWinRef = null; });

  const display = win.querySelector('.calcDisplay');
  let current = '0', stored = null, pendingOp = null, justEvaluated = false;
  function render(){ display.textContent = current; }
  function inputNum(n){
    if(justEvaluated){ current = '0'; justEvaluated = false; }
    if(n === '.'){
      if(current.includes('.')) return;
      current = current + '.';
    } else {
      current = (current === '0') ? n : current + n;
    }
    render();
  }
  function compute(a,b,op){
    a = parseFloat(a); b = parseFloat(b);
    if(op === '+') return a + b;
    if(op === '-') return a - b;
    if(op === '*') return a * b;
    if(op === '/') return b === 0 ? 'Error' : a / b;
    return b;
  }
  function setOp(op){
    if(pendingOp && !justEvaluated){
      const res = compute(stored, current, pendingOp);
      stored = (res === 'Error') ? '0' : String(res);
      current = stored;
      render();
    } else {
      stored = current;
    }
    pendingOp = op;
    justEvaluated = false;
    current = '0';
  }
  win.querySelectorAll('.calcBtn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const num = btn.getAttribute('data-num');
      const op = btn.getAttribute('data-op');
      const act = btn.getAttribute('data-act');
      if(num !== null){ inputNum(num); return; }
      if(op){ setOp(op); return; }
      if(act === 'clear'){ current='0'; stored=null; pendingOp=null; justEvaluated=false; render(); return; }
      if(act === 'back'){ current = current.length>1 ? current.slice(0,-1) : '0'; render(); return; }
      if(act === 'equals'){
        if(pendingOp !== null){
          const res = compute(stored, current, pendingOp);
          current = String(res);
          stored = null; pendingOp = null; justEvaluated = true;
          render();
        }
        return;
      }
    });
  });
}
document.getElementById('iconCalc').addEventListener('dblclick', openCalcWindow);
