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
      // ARREGLO REAL: antes esto no comprobaba que el palo de la carta
      // coincidiera con el de la fundación de destino (esa validación solo
      // existía en tryAutoFoundation, para el doble-clic). Al arrastrar o
      // clickear manualmente una carta hacia una fundación específica, se
      // podía soltar cualquier palo en cualquier fundación vacía (solo
      // exigía que fuera un As), mezclando palos en la misma pila y
      // rompiendo tanto la validez del juego como la condición de victoria.
      if(cards.length === 1 && firstCard.suit === target.colIdx && canStackFoundation(firstCard, foundations[target.colIdx])){
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
