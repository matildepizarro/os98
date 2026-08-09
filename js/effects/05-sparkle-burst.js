/* =====================================================================
   NUEVO: SPARKLE BURST (confeti kawaii siguiendo el cursor / aleatorio)
   ===================================================================== */
const sparkleChars = ['✨','💖','⭐','🌸','♡','💫'];
function spawnSparkleBurst(){
  const cx = window.innerWidth * (0.15 + Math.random()*0.7);
  const cy = window.innerHeight * (0.15 + Math.random()*0.6);
  const count = 6 + Math.floor(Math.random()*5);
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = sparkleChars[Math.floor(Math.random()*sparkleChars.length)];
    s.style.left = (cx + (Math.random()*60-30)) + 'px';
    s.style.top = (cy + (Math.random()*60-30)) + 'px';
    s.style.animationDelay = (Math.random()*0.2) + 's';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(), 1400);
  }
}
