/* =====================================================================
   NUEVO: VENTANA DE AYUDA KAWAII
   ===================================================================== */
function openHelpWindow(){
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = '18%'; win.style.left = '38%'; win.style.width = '320px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Ayuda de MATILDE_OS</div>
      <div class="winbtns"><button class="hpClose">✕</button></div>
    </div>
    <div class="win-body" style="font-size:12px; line-height:1.6;">
      <b>Sobre este sistema</b><br>
      MATILDE_OS está dedicado al catálogo y las fechas de <b>Matilde Pizarro</b>.<br><br>
      · Selecciona una fecha en el menú "Publicitando" del cartel principal para activar los mensajes de esa función.<br>
      · Haz doble clic en los archivos 📄 del escritorio para abrir la letra completa; esa canción queda marcada como en reproducción.<br>
      · El ícono que brilla es la canción que está abierta en este momento.<br>
      · Click derecho en el escritorio para más opciones.<br>
      · Puedes arrastrar cualquier ventana desde su barra de título.
      <div style="text-align:right; margin-top:10px;"><button class="btn98 hpClose">Cerrar</button></div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 160);
  win.querySelectorAll('.hpClose').forEach(b=>b.addEventListener('click', ()=> win.remove()));
}
document.getElementById('trayHelp').addEventListener('click', openHelpWindow);
document.getElementById('smHelp').addEventListener('click', ()=>{ openHelpWindow(); startOpen=false; startMenu.style.display='none'; startBtn.classList.remove('active'); });
document.getElementById('smProps').addEventListener('click', ()=>{ openDisplayProperties(); startOpen=false; startMenu.style.display='none'; startBtn.classList.remove('active'); });
document.getElementById('trayHeart').addEventListener('click', ()=>{
  const statusMsg = currentShow
    ? `Estado del sistema: <b>OK</b>.<br>Función publicitada: Matilde Pizarro — ${currentShow.fecha} — ${currentShow.lugar}.`
    : 'Estado del sistema: <b>OK</b>.<br>No hay ninguna función seleccionada para publicitar.';
  spawnErrorPopupCustom('Estado del sistema', statusMsg);
});
