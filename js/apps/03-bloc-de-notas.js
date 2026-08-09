/* =====================================================================
   NUEVO: BLOC DE NOTAS — editable de verdad, con mensaje inicial de cumpleaños
   ===================================================================== */
let notepadWinCount = 0;
function openNotepadWindow(){
  notepadWinCount++;
  const win = document.createElement('div');
  win.className = 'winfloat';
  win.style.top = (12 + notepadWinCount*2) + '%';
  win.style.left = (30 + notepadWinCount*2) + '%';
  win.style.width = '360px'; win.style.height = '300px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> Sin título - Bloc de notas</div>
      <div class="winbtns"><button class="npClose">✕</button></div>
    </div>
    <div class="menubar"><span class="npSaveMenu" style="cursor:pointer;">Archivo</span><span>Edición</span><span>Formato</span><span>Ayuda</span></div>
    <div class="win-body" style="padding:0; display:flex; flex-direction:column;">
      <textarea class="npArea" spellcheck="false" style="flex:1; width:100%; border:none; resize:none; outline:none;
        font-family:'Courier New', monospace; font-size:13px; padding:8px; box-sizing:border-box;">¡Feliz cumpleaños número 98, Matilde Pizarro!

Escribe aquí lo que quieras... este Bloc de notas
funciona de verdad: puedes borrar este mensaje
y escribir tu propio saludo. 🎂</textarea>
      <div style="display:flex; justify-content:flex-end; gap:6px; padding:6px; border-top:1px solid #808080;">
        <button class="btn98 npSave">💾 Guardar como .txt</button>
      </div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 220, 160);
  win.querySelector('.npClose').addEventListener('click', ()=> win.remove());
  win.querySelector('.npArea').focus();

  // NUEVO: guardar el contenido del Bloc de notas como archivo .txt real
  // en el computador/celular de la persona (usa la descarga del navegador).
  function saveNotepadFile(){
    const text = win.querySelector('.npArea').value;
    const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notas.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=> URL.revokeObjectURL(url), 1000);
  }
  win.querySelector('.npSave').addEventListener('click', saveNotepadFile);
  win.querySelector('.npSaveMenu').addEventListener('click', saveNotepadFile);
  // atajo de teclado Ctrl/Cmd+S, como en un editor de texto real
  win.querySelector('.npArea').addEventListener('keydown', (e)=>{
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's'){
      e.preventDefault();
      saveNotepadFile();
    }
  });
}
document.getElementById('iconNotepad').addEventListener('dblclick', openNotepadWindow);
