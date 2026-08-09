/* =====================================================================
   KAWAII PINBALL 3D — reemplazo completo del viejo pinball (iframe externo
   que no respondía). Motor de física propio (círculo vs. segmentos, con
   normales fijas anti-tunneling en los bordes reales de la mesa), render en
   canvas con inclinación 3D via CSS, y sonidos kawaii sintetizados con
   WebAudio (no se depende de ningún archivo/host externo).
   ===================================================================== */
(function(){
  'use strict';

  /* ---------------- CSS del juego (una sola vez) ---------------- */
  if(!document.getElementById('kawaiiPinballStyle')){
    const style = document.createElement('style');
    style.id = 'kawaiiPinballStyle';
    style.textContent = `
      .kpbBody{ position:relative; width:100%; height:100%; overflow:hidden;
        background: radial-gradient(ellipse at 50% 0%, #ffe6f5 0%, #ffc3e6 45%, #ff8fc9 100%);
        display:flex; align-items:center; justify-content:center; touch-action:none; }
      .kpbTiltWrap{ perspective: 900px; perspective-origin:50% 20%; }
      .kpbCanvas{ display:block; background:transparent;
        transform: rotateX(16deg) scale(1.02);
        transform-origin: 50% 85%;
        filter: drop-shadow(0 10px 14px rgba(150,20,90,0.35)); }
      .kpbTop{ position:absolute; top:0; left:0; right:0; display:flex;
        align-items:center; justify-content:space-between; padding:6px 10px;
        font-family:'W98',Tahoma,sans-serif; font-weight:bold; font-size:13px;
        color:#7a1257; text-shadow:0 1px 0 #fff, 0 0 6px #fff; pointer-events:none; z-index:5; }
      .kpbScore{ background:rgba(255,255,255,0.75); border-radius:10px; padding:2px 10px;
        border:2px solid #ff8fc9; letter-spacing:1px; }
      .kpbCombo{ background:rgba(255,214,102,0.9); border-radius:10px; padding:2px 10px;
        border:2px solid #ffb545; letter-spacing:1px; font-size:11px; }
      .kpbHearts{ background:rgba(255,255,255,0.75); border-radius:10px; padding:2px 10px;
        border:2px solid #ff8fc9; }
      .kpbLaunchBtn{ position:absolute; right:8px; bottom:10px; width:46px; height:46px;
        border-radius:50%; background:radial-gradient(circle at 35% 30%, #fff0fa, #ff8fc9 70%, #e8579f);
        border:2px solid #fff; box-shadow:0 3px 6px rgba(120,10,70,.5); color:#7a1257;
        font-size:20px; display:flex; align-items:center; justify-content:center;
        user-select:none; z-index:6; cursor:pointer; }
      .kpbLaunchBtn:active{ filter:brightness(0.9); transform:scale(0.96); }
      .kpbTouchZone{ position:absolute; bottom:0; width:42%; height:55%; z-index:4; }
      .kpbTouchZone.left{ left:0; } .kpbTouchZone.right{ right:0; }
      .kpbGameOver{ position:absolute; inset:0; display:none; align-items:center; justify-content:center;
        background:rgba(255,192,225,0.55); z-index:8; backdrop-filter:blur(1px); }
      .kpbGoCard{ background:#fff0fa; border:3px solid #ff8fc9; border-radius:16px;
        padding:18px 22px; text-align:center; box-shadow:0 6px 18px rgba(120,10,70,.4);
        font-family:'W98',Tahoma,sans-serif; color:#7a1257; }
      .kpbGoCard .ttl{ font-size:18px; font-weight:bold; margin-bottom:6px; }
      .kpbGoCard .sc{ font-size:14px; margin-bottom:10px; }
      .kpbGoCard button{ font-family:'W98',Tahoma,sans-serif; font-size:12px; padding:6px 14px;
        border-radius:10px; border:2px solid #ff8fc9; background:#ffd6ec; color:#7a1257;
        cursor:pointer; font-weight:bold; }
      .kpbGoCard button:active{ background:#ff8fc9; }
      .kpbHelp{ font-size:12px; line-height:1.5; }
    `;
    document.head.appendChild(style);
  }

  /* ---------------- Física (coordenadas de mesa: 340 x 580) ---------------- */
  const TW = 340, TH = 580;
  const INSIDE_REF = {x:170, y:300};

  function seg(x1,y1,x2,y2, hard){
    const dx=x2-x1, dy=y2-y1;
    const L = Math.sqrt(dx*dx+dy*dy)||1;
    let nx=-dy/L, ny=dx/L;
    const mx=(x1+x2)/2, my=(y1+y2)/2;
    const toRef = {x:INSIDE_REF.x-mx, y:INSIDE_REF.y-my};
    if(nx*toRef.x+ny*toRef.y < 0){ nx=-nx; ny=-ny; }
    return {x1,y1,x2,y2,nx,ny,hard:hard!==false};
  }
  function segDynamic(x1,y1,x2,y2){ return seg(x1,y1,x2,y2,false); }

  const WALLS = [
    seg(18,520, 18,130, true),
    seg(18,130, 20,70, true),
    seg(20,70, 55,28, true),
    seg(55,28, 110,8, true),
    seg(110,8, 170,4, true),
    seg(170,4, 230,8, true),
    seg(230,8, 270,26, true),
    seg(270,26, 297,64, true),
    seg(322,520, 322,60, true),
    seg(300,66, 300,520, false),
    seg(322,50, 292,16, false),
    seg(300,520, 322,520, false),
  ];
  const SLINGSHOTS = [
    seg(33,462, 68,412, false),
    seg(285,462, 250,412, false),
  ];
  const BUMPERS = [
    {x:100,y:180,r:22,kind:'star'},
    {x:210,y:150,r:22,kind:'heart'},
    {x:159,y:236,r:25,kind:'boss'},
    {x:70,y:300,r:16,kind:'star'},
    {x:250,y:290,r:16,kind:'heart'},
    {x:159,y:110,r:16,kind:'star'},
    {x:159,y:330,r:14,kind:'heart'},
  ];
  const LEFT_PIVOT = {x:102,y:486};
  const RIGHT_PIVOT = {x:238,y:486};
  const FLIP_LEN = 62;
  const LEFT_REST = 1.05, LEFT_ACTIVE = -0.62;
  const RIGHT_REST = Math.PI-1.05, RIGHT_ACTIVE = Math.PI+0.62;
  const FLIP_SPEED = 18;
  const GRAVITY = 620;
  const MAX_SPEED = 1300;

  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
  function vlen(x,y){ return Math.sqrt(x*x+y*y); }

  function closestPointOnSegment(px,py,x1,y1,x2,y2){
    const dx=x2-x1, dy=y2-y1;
    const l2 = dx*dx+dy*dy;
    if(l2===0) return {x:x1,y:y1,t:0,tRaw:0};
    let tRaw = ((px-x1)*dx+(py-y1)*dy)/l2;
    const t = clamp(tRaw,0,1);
    return {x:x1+t*dx, y:y1+t*dy, t, tRaw};
  }

  function resolveCircleSegment(ball, s, restitution, extraKick, angVel){
    const cp = closestPointOnSegment(ball.x,ball.y,s.x1,s.y1,s.x2,s.y2);
    const dx = ball.x-cp.x, dy = ball.y-cp.y;
    let nx, ny, pen;
    const inMiddle = cp.tRaw >= 0 && cp.tRaw <= 1;
    if(s.hard && inMiddle){
      nx = s.nx; ny = s.ny;
      pen = ball.r - (dx*nx+dy*ny);
    } else {
      const d = vlen(dx,dy);
      if(d < 1e-6 || d >= ball.r) return false;
      nx = dx/d; ny = dy/d;
      pen = ball.r - d;
    }
    if(pen > 0){
      ball.x += nx*pen; ball.y += ny*pen;
      const vn = ball.vx*nx+ball.vy*ny;
      // el kick extra (paredes elásticas / slingshots) y el evento de impacto
      // sólo se disparan en el instante del choque real (vn<0). Si no, una
      // bola apoyada contra la pared quedaría "flotando"/sonando sin parar.
      if(vn < 0){
        ball.vx -= (1+restitution)*vn*nx;
        ball.vy -= (1+restitution)*vn*ny;
        if(extraKick){ ball.vx += nx*extraKick; ball.vy += ny*extraKick; }
        if(angVel){ ball.vx += -ny*angVel*15; ball.vy += nx*angVel*15; }
        return true;
      }
      return false;
    }
    return false;
  }

  function resolveCircleCircle(ball, c, restitution, kick){
    const dx = ball.x-c.x, dy = ball.y-c.y;
    const d = vlen(dx,dy);
    const minD = ball.r+c.r;
    if(d < minD && d>0.0001){
      const nx=dx/d, ny=dy/d;
      const overlap = minD-d;
      ball.x += nx*overlap; ball.y += ny*overlap;
      const vn = ball.vx*nx+ball.vy*ny;
      // igual que en los segmentos: el kick sólo se aplica en el impacto real
      // (vn<0, la bola venía entrando). Si no, una bola en reposo justo
      // encima del bumper recibiría el kick cada frame y quedaría "flotando"
      // ahí para siempre en vez de caer. El puntaje/combo también sólo debe
      // sumar en el impacto real, no en cada frame de contacto.
      if(vn < 0){
        ball.vx -= (1+restitution)*vn*nx;
        ball.vy -= (1+restitution)*vn*ny;
        ball.vx += nx*kick; ball.vy += ny*kick;
        return true;
      }
      // igual la separamos un poquito más rápido para que no quede
      // "pegada" rebotando en el mismo punto por errores de redondeo
      ball.vx += nx*30; ball.vy += ny*30;
      return false;
    }
    return false;
  }

  function flipperSegment(pivot, angle){
    return segDynamic(pivot.x, pivot.y, pivot.x+FLIP_LEN*Math.cos(angle), pivot.y+FLIP_LEN*Math.sin(angle));
  }

  function makeState(){
    return {
      ball: {x:311, y:505, vx:0, vy:0, r:8, alive:true, launched:false},
      leftAngle: LEFT_REST, rightAngle: RIGHT_REST,
      plungerPower:0,
      score:0, balls:3, gameOver:false,
      bumperFlash:[0,0,0,0,0,0,0],
      slingFlash:[0,0],
      combo:0, comboTimer:0, extraBallAt:15,
      events: [],
    };
  }
  function resetBall(state){
    state.ball = {x:311, y:505, vx:0, vy:0, r:8, alive:true, launched:false};
    state.plungerPower = 0;
  }

  function physicsStep(state, dt, input){
    state.events = [];
    if(state.gameOver) return state;
    input = input||{};

    const prevLeft = state.leftAngle, prevRight = state.rightAngle;
    const leftTarget = input.leftDown ? LEFT_ACTIVE : LEFT_REST;
    const rightTarget = input.rightDown ? RIGHT_ACTIVE : RIGHT_REST;
    const maxStep = FLIP_SPEED*dt;
    state.leftAngle += clamp(leftTarget-state.leftAngle, -maxStep, maxStep);
    state.rightAngle += clamp(rightTarget-state.rightAngle, -maxStep, maxStep);
    const leftAngVel = (state.leftAngle-prevLeft)/Math.max(dt,1e-6);
    const rightAngVel = (state.rightAngle-prevRight)/Math.max(dt,1e-6);

    if(input.plungerCharging){
      state.plungerPower = clamp(state.plungerPower + dt*1.4, 0, 1);
    } else if(state.plungerPower>0 && !state.ball.launched){
      const power = state.plungerPower;
      state.ball.vy = -(420+power*520);
      state.ball.vx = (Math.random()*10-5);
      state.ball.launched = true;
      state.plungerPower = 0;
      state.events.push(['launch']);
    }

    for(let i=0;i<state.bumperFlash.length;i++) state.bumperFlash[i] = Math.max(0, state.bumperFlash[i]-dt*2.2);
    for(let i=0;i<state.slingFlash.length;i++) state.slingFlash[i] = Math.max(0, state.slingFlash[i]-dt*2.2);

    if(state.comboTimer > 0){
      state.comboTimer -= dt;
      if(state.comboTimer <= 0){ state.comboTimer = 0; state.combo = 0; }
    }

    const ball = state.ball;
    if(!ball.alive) return state;

    const speedNow = vlen(ball.vx,ball.vy);
    const frameDisp = speedNow*dt;
    let substeps = Math.ceil(frameDisp/(ball.r*0.35));
    substeps = clamp(substeps, 8, 80);
    const sdt = dt/substeps;
    for(let i=0;i<substeps;i++){
      ball.vy += GRAVITY*sdt;
      const sp = vlen(ball.vx,ball.vy);
      if(sp>MAX_SPEED){ ball.vx*=MAX_SPEED/sp; ball.vy*=MAX_SPEED/sp; }
      ball.x += ball.vx*sdt;
      ball.y += ball.vy*sdt;

      for(const s of WALLS){
        if(resolveCircleSegment(ball, s, 0.55)) state.events.push(['wall']);
      }
      for(let si=0; si<SLINGSHOTS.length; si++){
        if(resolveCircleSegment(ball, SLINGSHOTS[si], 0.6, 140)){
          state.events.push(['sling', si]);
          state.slingFlash[si] = 1;
        }
      }
      for(let bi=0;bi<BUMPERS.length;bi++){
        const b = BUMPERS[bi];
        if(resolveCircleCircle(ball, b, 0.5, b.kind==='boss'?260:200)){
          state.combo += 1;
          state.comboTimer = 1.8;
          const mult = 1 + Math.floor(state.combo/3)*0.5;
          const base = b.kind==='boss'?150:100;
          state.score += Math.round(base*mult);
          state.bumperFlash[bi] = 1;
          state.events.push(['bumper', bi]);
          if(state.combo >= state.extraBallAt){
            state.balls += 1;
            state.extraBallAt += 15;
            state.events.push(['extraball']);
          }
        }
      }
      const lf = flipperSegment(LEFT_PIVOT, state.leftAngle);
      if(resolveCircleSegment(ball, lf, 0.7, 0, leftAngVel)) state.events.push(['flipper']);
      const rf = flipperSegment(RIGHT_PIVOT, state.rightAngle);
      if(resolveCircleSegment(ball, rf, 0.7, 0, rightAngVel)) state.events.push(['flipper']);

      // Si el lanzamiento fue débil y la bola no logró pasar la compuerta de
      // la pista lateral, vuelve a caer y queda apoyada otra vez en el canal
      // del lanzador. Sin esto, "launched" seguía en true para siempre y el
      // jugador ya no podía volver a cargar el resorte con espacio.
      if(ball.launched && ball.x > 296 && ball.y > 66 && ball.vy >= -5 && vlen(ball.vx,ball.vy) < 60){
        ball.launched = false;
      }

      if(ball.y - ball.r > TH){
        ball.alive = false;
        state.events.push(['drain']);
        state.balls -= 1;
        state.combo = 0;
        state.comboTimer = 0;
        if(state.balls <= 0){
          state.gameOver = true;
          state.events.push(['gameover']);
        }
        break;
      }
    }
    return state;
  }

  /* ---------------- Sonidos kawaii (WebAudio, sin archivos externos) ---------------- */
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
    const peak = opts.gain!==undefined ? opts.gain : 0.18;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(peak, t0+Math.min(0.015,dur*0.3));
    gain.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t0); osc.stop(t0+dur+0.02);
  }
  const SND = {
    bumper(kind){
      tone(kind==='boss'?520:760, 0.11, {type:'sine', sweepTo:(kind==='boss'?820:1180), gain:0.22});
      tone(kind==='boss'?1040:1520, 0.09, {type:'sine', gain:0.08, delay:0.02});
    },
    flipper(){
      tone(480, 0.045, {type:'square', gain:0.10});
      tone(360, 0.05, {type:'square', gain:0.07, delay:0.02});
    },
    sling(){
      tone(260, 0.14, {type:'triangle', sweepTo:520, gain:0.16});
    },
    launch(){
      tone(160, 0.22, {type:'sawtooth', sweepTo:640, gain:0.10});
    },
    drain(){
      tone(520, 0.10, {type:'sine', sweepTo:340, gain:0.14});
      tone(420, 0.16, {type:'sine', sweepTo:220, gain:0.12, delay:0.11});
    },
    gameover(){
      [523.25,659.25,783.99,1046.5].forEach((f,i)=> tone(f, 0.16, {type:'sine', gain:0.16, delay:i*0.12}));
    },
    extraball(){
      [660,880,1100,1320].forEach((f,i)=> tone(f, 0.12, {type:'sine', gain:0.18, delay:i*0.06}));
    },
  };

  /* ---------------- Render ---------------- */
  function roundStar(ctx,cx,cy,r,points,inset){
    ctx.beginPath();
    for(let i=0;i<points*2;i++){
      const ang = (Math.PI/points)*i - Math.PI/2;
      const rad = i%2===0 ? r : r*inset;
      const x = cx+Math.cos(ang)*rad, y = cy+Math.sin(ang)*rad;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath();
  }
  function heartPath(ctx,cx,cy,r){
    ctx.beginPath();
    ctx.moveTo(cx, cy+r*0.6);
    ctx.bezierCurveTo(cx-r*1.3, cy-r*0.5, cx-r*0.5, cy-r*1.3, cx, cy-r*0.35);
    ctx.bezierCurveTo(cx+r*0.5, cy-r*1.3, cx+r*1.3, cy-r*0.5, cx, cy+r*0.6);
    ctx.closePath();
  }
  function kawaiiFace(ctx,cx,cy,r,blush){
    ctx.fillStyle = '#7a1257';
    ctx.beginPath(); ctx.arc(cx-r*0.32, cy-r*0.05, r*0.09, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+r*0.32, cy-r*0.05, r*0.09, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy+r*0.22, r*0.14, 0, Math.PI); ctx.stroke();
    if(blush){
      ctx.fillStyle = 'rgba(255,120,170,0.55)';
      ctx.beginPath(); ctx.ellipse(cx-r*0.5, cy+r*0.15, r*0.16, r*0.1, 0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+r*0.5, cy+r*0.15, r*0.16, r*0.1, 0,0,Math.PI*2); ctx.fill();
    }
  }

  function drawWalls(ctx){
    ctx.lineCap = 'round'; ctx.lineJoin='round';
    ctx.strokeStyle = '#ff6fb8'; ctx.lineWidth = 10;
    for(const s of WALLS){ ctx.beginPath(); ctx.moveTo(s.x1,s.y1); ctx.lineTo(s.x2,s.y2); ctx.stroke(); }
    ctx.strokeStyle = '#ffe1f2'; ctx.lineWidth = 3;
    for(const s of WALLS){ ctx.beginPath(); ctx.moveTo(s.x1,s.y1); ctx.lineTo(s.x2,s.y2); ctx.stroke(); }
    ctx.strokeStyle = '#e85bab'; ctx.lineWidth = 7; ctx.setLineDash([2,7]);
    for(const s of SLINGSHOTS){ ctx.beginPath(); ctx.moveTo(s.x1,s.y1); ctx.lineTo(s.x2,s.y2); ctx.stroke(); }
    ctx.setLineDash([]);
  }

  function drawBumper(ctx,b,flash){
    const glow = flash>0;
    ctx.save();
    if(glow){ ctx.shadowColor = '#fff2ac'; ctx.shadowBlur = 18*flash; }
    const grad = ctx.createRadialGradient(b.x-b.r*0.3,b.y-b.r*0.35,b.r*0.15,b.x,b.y,b.r);
    if(b.kind==='star'){ grad.addColorStop(0,'#fff6d8'); grad.addColorStop(1,'#ffb545'); }
    else if(b.kind==='heart'){ grad.addColorStop(0,'#ffe3ef'); grad.addColorStop(1,'#ff5f9e'); }
    else { grad.addColorStop(0,'#f6e2ff'); grad.addColorStop(1,'#b47bff'); }
    ctx.fillStyle = glow ? '#fff8e0' : grad;
    if(b.kind==='star'){ roundStar(ctx,b.x,b.y,b.r,5,0.55); ctx.fill(); }
    else if(b.kind==='heart'){ heartPath(ctx,b.x,b.y,b.r*0.95); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); }
    ctx.lineWidth=2; ctx.strokeStyle='#fff';
    if(b.kind==='star'){ roundStar(ctx,b.x,b.y,b.r,5,0.55); ctx.stroke(); }
    else if(b.kind==='heart'){ heartPath(ctx,b.x,b.y,b.r*0.95); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.stroke(); }
    if(b.kind==='boss'){
      // orejitas de gatito para el bumper jefe
      ctx.fillStyle = '#c99bff';
      ctx.beginPath(); ctx.moveTo(b.x-b.r*0.7,b.y-b.r*0.6); ctx.lineTo(b.x-b.r*0.25,b.y-b.r*1.15); ctx.lineTo(b.x-b.r*0.05,b.y-b.r*0.55); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(b.x+b.r*0.7,b.y-b.r*0.6); ctx.lineTo(b.x+b.r*0.25,b.y-b.r*1.15); ctx.lineTo(b.x+b.r*0.05,b.y-b.r*0.55); ctx.closePath(); ctx.fill();
    }
    kawaiiFace(ctx,b.x,b.y+b.r*0.08,b.r,true);
    ctx.restore();
  }

  function drawFlipper(ctx,pivot,angle,color){
    const tipX = pivot.x+FLIP_LEN*Math.cos(angle), tipY = pivot.y+FLIP_LEN*Math.sin(angle);
    ctx.save();
    ctx.lineCap='round';
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 20;
    ctx.beginPath(); ctx.moveTo(pivot.x,pivot.y); ctx.lineTo(tipX,tipY); ctx.stroke();
    const grad = ctx.createLinearGradient(pivot.x,pivot.y,tipX,tipY);
    grad.addColorStop(0, color[0]); grad.addColorStop(1, color[1]);
    ctx.strokeStyle = grad; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(pivot.x,pivot.y); ctx.lineTo(tipX,tipY); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(pivot.x,pivot.y, 9, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ff5f9e';
    ctx.beginPath(); ctx.arc(pivot.x,pivot.y, 4, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function drawBall(ctx,ball){
    ctx.save();
    const grad = ctx.createRadialGradient(ball.x-ball.r*0.35,ball.y-ball.r*0.4,ball.r*0.1, ball.x,ball.y,ball.r);
    grad.addColorStop(0,'#ffffff'); grad.addColorStop(0.5,'#ffe8f4'); grad.addColorStop(1,'#ff9fcd');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth=1; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(ball.x-ball.r*0.35,ball.y-ball.r*0.4,ball.r*0.28,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function render(ctx, state, deco){
    ctx.clearRect(0,0,TW,TH);
    // fondo de la mesa (interior)
    const bg = ctx.createLinearGradient(0,0,0,TH);
    bg.addColorStop(0,'#fff2fb'); bg.addColorStop(1,'#ffd3ec');
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.moveTo(18,520);
    ctx.lineTo(18,130); ctx.lineTo(20,70); ctx.lineTo(55,28); ctx.lineTo(110,8);
    ctx.lineTo(170,4); ctx.lineTo(230,8); ctx.lineTo(270,26); ctx.lineTo(297,64); ctx.lineTo(300,520);
    ctx.closePath(); ctx.fill();
    // carril del lanzador
    ctx.fillStyle = '#ffe6f5';
    ctx.fillRect(300,60,22,460);

    // decoración: estrellitas titilando
    for(const d of deco){
      ctx.save();
      ctx.globalAlpha = 0.35+0.35*Math.sin(d.phase);
      ctx.fillStyle = '#fff';
      roundStar(ctx, d.x, d.y, d.r, 4, 0.4); ctx.fill();
      ctx.restore();
    }

    drawWalls(ctx);
    for(let i=0;i<BUMPERS.length;i++) drawBumper(ctx,BUMPERS[i], state.bumperFlash[i]);
    drawFlipper(ctx, LEFT_PIVOT, state.leftAngle, ['#ff8fc9','#c96bff']);
    drawFlipper(ctx, RIGHT_PIVOT, state.rightAngle, ['#c96bff','#ff8fc9']);
    // indicador de potencia del plunger
    if(state.plungerPower>0){
      ctx.fillStyle = '#ff5f9e';
      const h = 140*state.plungerPower;
      ctx.fillRect(304, 512-h, 14, h);
    }
    if(state.ball.alive) drawBall(ctx, state.ball);
  }

  /* ---------------- Integración con la ventana del sistema ---------------- */
  let pinballWinCount = 0;
  const activeGames = []; // { active, leftDown, rightDown, plungerCharging }
  let globalKeysBound = false;

  function bindGlobalKeysOnce(){
    if(globalKeysBound) return;
    globalKeysBound = true;
    document.addEventListener('keydown', (e)=>{
      const g = activeGames.find(g=>g.active);
      if(!g) return;
      const k = e.key.toLowerCase();
      if(k==='z'||k==='arrowleft'){ g.leftDown = true; e.preventDefault(); }
      if(k==='m'||k==='/'||k==='arrowright'){ g.rightDown = true; e.preventDefault(); }
      if(k===' '){ g.plungerCharging = true; e.preventDefault(); }
      if(k==='r' && g.state.gameOver){ g.restart(); }
    });
    document.addEventListener('keyup', (e)=>{
      const g = activeGames.find(g=>g.active);
      if(!g) return;
      const k = e.key.toLowerCase();
      if(k==='z'||k==='arrowleft') g.leftDown = false;
      if(k==='m'||k==='/'||k==='arrowright') g.rightDown = false;
      if(k===' ') g.plungerCharging = false;
    });
  }

  function makeDeco(){
    const arr = [];
    for(let i=0;i<14;i++){
      arr.push({x: 25+Math.random()*290, y: 20+Math.random()*480, r: 3+Math.random()*4, phase: Math.random()*Math.PI*2, speed: 1+Math.random()*2});
    }
    return arr;
  }

  window.openPinballWindow = function openPinballWindow(){
    bindGlobalKeysOnce();
    pinballWinCount++;
    const win = document.createElement('div');
    win.className = 'winfloat';
    win.style.top = (7 + pinballWinCount*2) + '%';
    win.style.left = (16 + pinballWinCount*2) + '%';
    win.style.width = '400px'; win.style.height = '600px';
    win.style.zIndex = ++dragZ;
    win.innerHTML = `
      <div class="titlebar">
        <div class="ttl"><span class="ico"></span> 💗 Kawaii Pinball 3D</div>
        <div class="winbtns">
          <button class="pinballHelp" title="Controles">?</button>
          <button class="pinballFull" title="Pantalla completa">▢</button>
          <button class="pinballClose">✕</button>
        </div>
      </div>
      <div class="pinballHelpPanel kpbHelp" style="display:none; flex:0 0 auto; background:#ffffe1; border-bottom:1px solid #808080; padding:6px 8px;">
        <b>Controles:</b>
        Z / ← = paleta izquierda &nbsp;|&nbsp;
        M · / · → = paleta derecha &nbsp;|&nbsp;
        Espacio = cargar y lanzar la bola &nbsp;|&nbsp;
        R = reiniciar al perder<br>
        En pantallas táctiles: mantené presionado a la izquierda o derecha para las paletas, y el botón 🚀 para lanzar.
      </div>
      <div class="win-body" style="padding:0; position:relative; overflow:hidden;">
        <div class="kpbBody">
          <div class="kpbTiltWrap"><canvas class="kpbCanvas" width="340" height="580"></canvas></div>
          <div class="kpbTop">
            <div class="kpbScore">0</div>
            <div class="kpbCombo" style="display:none;"></div>
            <div class="kpbHearts">💗💗💗</div>
          </div>
          <div class="kpbTouchZone left"></div>
          <div class="kpbTouchZone right"></div>
          <div class="kpbLaunchBtn" title="Mantené presionado para cargar, soltá para lanzar">🚀</div>
          <div class="kpbGameOver">
            <div class="kpbGoCard">
              <div class="ttl">💗 GAME OVER 💗</div>
              <div class="sc">Puntaje: <span class="kpbFinalScore">0</span></div>
              <button class="kpbRestart">Jugar de nuevo ✨</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(win);
    makeDraggable(win);
    makeResizable(win, 260, 380);

    const helpBtn = win.querySelector('.pinballHelp');
    const helpPanel = win.querySelector('.pinballHelpPanel');
    const fullBtn = win.querySelector('.pinballFull');
    const pinballBody = win.querySelector('.win-body');
    const kpbBody = win.querySelector('.kpbBody');
    const tiltWrap = win.querySelector('.kpbTiltWrap');
    const canvas = win.querySelector('.kpbCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = win.querySelector('.kpbScore');
    const comboEl = win.querySelector('.kpbCombo');
    const heartsEl = win.querySelector('.kpbHearts');
    const goScreen = win.querySelector('.kpbGameOver');
    const finalScoreEl = win.querySelector('.kpbFinalScore');
    const restartBtn = win.querySelector('.kpbRestart');
    const launchBtn = win.querySelector('.kpbLaunchBtn');
    const touchLeft = win.querySelector('.kpbTouchZone.left');
    const touchRight = win.querySelector('.kpbTouchZone.right');

    const state = makeState();
    const deco = makeDeco();
    const game = { active:true, leftDown:false, rightDown:false, plungerCharging:false, state,
      restart(){ Object.assign(state, makeState()); goScreen.style.display='none'; } };
    activeGames.push(game);
    activeGames.forEach(g=> g.active = (g===game));

    function setActive(){
      activeGames.forEach(g=> g.active = (g===game));
      win.style.zIndex = ++dragZ;
      getCtx(); // intenta destrabar audio con el gesto del usuario
    }

    // resize: escalar el canvas manteniendo proporción dentro del cuerpo
    function fitCanvas(){
      const availW = pinballBody.clientWidth - 4;
      const availH = pinballBody.clientHeight - 4;
      const scale = Math.min(availW/TW, availH/TH);
      const w = TW*scale, h = TH*scale;
      tiltWrap.style.width = w+'px';
      tiltWrap.style.height = h+'px';
      canvas.style.width = w+'px';
      canvas.style.height = h+'px';
    }
    let ro;
    if(typeof ResizeObserver !== 'undefined'){
      ro = new ResizeObserver(fitCanvas);
      ro.observe(pinballBody);
    } else {
      window.addEventListener('resize', fitCanvas);
    }
    fitCanvas();

    kpbBody.addEventListener('mousedown', setActive);
    kpbBody.addEventListener('touchstart', setActive, {passive:true});
    win.querySelector('.titlebar').addEventListener('mousedown', ()=>{ win.style.zIndex = ++dragZ; });

    function pressLeft(v){ return (e)=>{ e.preventDefault(); setActive(); game.leftDown = v; }; }
    function pressRight(v){ return (e)=>{ e.preventDefault(); setActive(); game.rightDown = v; }; }
    touchLeft.addEventListener('mousedown', pressLeft(true));
    touchLeft.addEventListener('touchstart', pressLeft(true), {passive:false});
    ['mouseup','mouseleave'].forEach(ev=> touchLeft.addEventListener(ev, pressLeft(false)));
    touchLeft.addEventListener('touchend', pressLeft(false));
    touchLeft.addEventListener('touchcancel', pressLeft(false));
    touchRight.addEventListener('mousedown', pressRight(true));
    touchRight.addEventListener('touchstart', pressRight(true), {passive:false});
    ['mouseup','mouseleave'].forEach(ev=> touchRight.addEventListener(ev, pressRight(false)));
    touchRight.addEventListener('touchend', pressRight(false));
    touchRight.addEventListener('touchcancel', pressRight(false));

    function pressLaunch(v){ return (e)=>{ e.preventDefault(); setActive(); game.plungerCharging = v; }; }
    launchBtn.addEventListener('mousedown', pressLaunch(true));
    launchBtn.addEventListener('touchstart', pressLaunch(true), {passive:false});
    ['mouseup','mouseleave'].forEach(ev=> launchBtn.addEventListener(ev, pressLaunch(false)));
    launchBtn.addEventListener('touchend', pressLaunch(false));
    launchBtn.addEventListener('touchcancel', pressLaunch(false));

    // seguro global: si la ventana pierde foco no deben quedar las paletas
    // o el lanzador trabados en "activo" para siempre
    window.addEventListener('blur', ()=>{ game.leftDown=false; game.rightDown=false; game.plungerCharging=false; });
    document.addEventListener('visibilitychange', ()=>{
      if(document.hidden){ game.leftDown=false; game.rightDown=false; game.plungerCharging=false; }
    });

    restartBtn.addEventListener('mousedown', (e)=> e.stopPropagation());
    restartBtn.addEventListener('click', ()=> game.restart());

    helpBtn.addEventListener('mousedown', (e)=> e.stopPropagation());
    helpBtn.addEventListener('click', ()=>{
      helpPanel.style.display = helpPanel.style.display === 'none' ? 'flex' : 'none';
    });
    fullBtn.addEventListener('mousedown', (e)=> e.stopPropagation());
    fullBtn.addEventListener('click', ()=>{
      if(document.fullscreenElement === pinballBody){ document.exitFullscreen(); }
      else if(pinballBody.requestFullscreen){
        pinballBody.requestFullscreen().then(fitCanvas).catch(()=>{
          if(typeof spawnToastMessage === 'function') spawnToastMessage('No se pudo activar pantalla completa en este navegador.');
        });
      }
    });
    document.addEventListener('fullscreenchange', ()=>{
      if(document.fullscreenElement === pinballBody){ fullBtn.textContent='❐'; fullBtn.title='Salir de pantalla completa'; }
      else { fullBtn.textContent='▢'; fullBtn.title='Pantalla completa'; }
      fitCanvas();
    });

    win.querySelector('.pinballClose').addEventListener('click', ()=>{
      if(document.fullscreenElement === pinballBody) document.exitFullscreen();
      cancelAnimationFrame(raf);
      const idx = activeGames.indexOf(game);
      if(idx>=0) activeGames.splice(idx,1);
      if(ro) ro.disconnect(); else window.removeEventListener('resize', fitCanvas);
      win.remove();
    });

    let lastEventsSeen = {};
    function handleEvents(){
      let sawBumper=false, sawFlipper=false, sawSling=false, sawLaunch=false, sawDrain=false, sawGameover=false, sawExtraBall=false;
      for(const ev of state.events){
        if(ev[0]==='bumper') sawBumper = BUMPERS[ev[1]].kind;
        if(ev[0]==='flipper') sawFlipper = true;
        if(ev[0]==='sling') sawSling = true;
        if(ev[0]==='launch') sawLaunch = true;
        if(ev[0]==='drain') sawDrain = true;
        if(ev[0]==='gameover') sawGameover = true;
        if(ev[0]==='extraball') sawExtraBall = true;
      }
      if(sawBumper) SND.bumper(sawBumper);
      if(sawFlipper) SND.flipper();
      if(sawSling) SND.sling();
      if(sawLaunch) SND.launch();
      if(sawDrain) SND.drain();
      if(sawExtraBall){
        SND.extraball();
        if(typeof spawnToastMessage === 'function') spawnToastMessage('💗 ¡Combo! Bola extra ✨');
      }
      if(sawGameover){
        SND.gameover();
        finalScoreEl.textContent = state.score;
        goScreen.style.display = 'flex';
      }
      if(sawDrain && !state.gameOver) resetBall(state);
    }

    let last = performance.now();
    let raf;
    function loop(now){
      raf = requestAnimationFrame(loop);
      let dt = (now-last)/1000;
      last = now;
      dt = Math.min(dt, 1/30); // evita saltos grandes si la pestaña estuvo en pausa
      physicsStep(state, dt, { leftDown: game.leftDown, rightDown: game.rightDown, plungerCharging: game.plungerCharging });
      handleEvents();
      for(const d of deco) d.phase += dt*d.speed;
      render(ctx, state, deco);
      scoreEl.textContent = state.score;
      heartsEl.textContent = '💗'.repeat(Math.max(0,state.balls));
      if(state.combo >= 3){
        comboEl.style.display = 'block';
        comboEl.textContent = 'x' + (1 + Math.floor(state.combo/3)*0.5) + ' combo ' + state.combo;
      } else {
        comboEl.style.display = 'none';
      }
    }
    raf = requestAnimationFrame(loop);
  };

})();
document.getElementById('iconPinball').addEventListener('dblclick', openPinballWindow);
