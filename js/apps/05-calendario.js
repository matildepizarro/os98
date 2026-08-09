/* =====================================================================
   NUEVO: CALENDARIO ROSADO Y KAWAII — con notitas por día
   ===================================================================== */
const kwNotes = {}; // "YYYY-M-D" -> texto
let kwViewYear, kwViewMonth; // mes que se está mostrando (0-11)
const kwMonthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const kwDowNames = ['Do','Lu','Ma','Mi','Ju','Vi','Sá'];
const kwCuteEmojis = ['🌸','💗','✨','🎀','🌷','🍥','⭐','🩷'];

function openCalendarWindow(){
  const today = new Date();
  kwViewYear = today.getFullYear();
  kwViewMonth = today.getMonth();

  const win = document.createElement('div');
  win.className = 'winfloat';
  win.id = 'calendarWin';
  win.style.top = '14%'; win.style.left = '34%'; win.style.width = '280px';
  win.style.zIndex = ++dragZ;
  win.innerHTML = `
    <div class="titlebar">
      <div class="ttl"><span class="ico"></span> 🌷 Calendario</div>
      <div class="winbtns"><button class="kwClose">✕</button></div>
    </div>
    <div class="win-body">
      <div class="kawaiiHead">
        <button class="kwNavBtn kwPrev">◀</button>
        <div class="kwTitle" id="kwTitle"></div>
        <button class="kwNavBtn kwNext">▶</button>
      </div>
      <div class="kwGrid" id="kwGrid"></div>
      <div class="kwFooter">✨ toca un día para dejarle una notita ✨</div>
    </div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  makeResizable(win, 240, 260);
  win.querySelector('.kwClose').addEventListener('click', ()=> win.remove());
  win.querySelector('.kwPrev').addEventListener('click', ()=>{
    kwViewMonth--; if(kwViewMonth < 0){ kwViewMonth = 11; kwViewYear--; }
    renderCalendar(win);
  });
  win.querySelector('.kwNext').addEventListener('click', ()=>{
    kwViewMonth++; if(kwViewMonth > 11){ kwViewMonth = 0; kwViewYear++; }
    renderCalendar(win);
  });
  renderCalendar(win);
}
document.getElementById('iconCalendar').addEventListener('dblclick', openCalendarWindow);

function renderCalendar(win){
  const titleEl = win.querySelector('#kwTitle');
  const grid = win.querySelector('#kwGrid');
  titleEl.textContent = '🎀 ' + kwMonthNames[kwViewMonth] + ' ' + kwViewYear + ' 🎀';
  grid.innerHTML = '';

  kwDowNames.forEach(d=>{
    const el = document.createElement('div');
    el.className = 'kwDow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const today = new Date();
  const firstDow = new Date(kwViewYear, kwViewMonth, 1).getDay();
  const daysInMonth = new Date(kwViewYear, kwViewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(kwViewYear, kwViewMonth, 0).getDate();

  const cells = [];
  for(let i = firstDow - 1; i >= 0; i--){
    cells.push({ day: daysInPrevMonth - i, other: true, month: kwViewMonth - 1 });
  }
  for(let d = 1; d <= daysInMonth; d++){
    cells.push({ day: d, other: false, month: kwViewMonth });
  }
  while(cells.length % 7 !== 0){
    cells.push({ day: cells.length, other: true, month: kwViewMonth + 1 });
  }

  cells.forEach(c=>{
    const cell = document.createElement('div');
    cell.className = 'kwDay' + (c.other ? ' otherMonth' : '');
    const isToday = !c.other && kwViewYear === today.getFullYear() &&
      kwViewMonth === today.getMonth() && c.day === today.getDate();
    if(isToday) cell.classList.add('today');
    const key = kwViewYear + '-' + kwViewMonth + '-' + c.day;
    if(!c.other && kwNotes[key]) cell.classList.add('hasNote');
    const deco = kwCuteEmojis[(c.day + kwViewMonth) % kwCuteEmojis.length];
    cell.innerHTML = `<span class="kwNum">${c.day}</span><span class="kwDot">${isToday ? '💖' : deco}</span>`;
    if(!c.other){
      cell.addEventListener('click', ()=> openKwNote(kwViewYear, kwViewMonth, c.day, win));
    } else {
      cell.style.cursor = 'default';
    }
    grid.appendChild(cell);
  });
}

const kwNoteBox = document.getElementById('kwNoteBox');
const kwNoteArea = document.getElementById('kwNoteArea');
const kwNoteTitle = document.getElementById('kwNoteTitle');
let kwNoteKey = null;
let kwNoteWinRef = null;

function openKwNote(y, m, d, winRef){
  kwNoteKey = y + '-' + m + '-' + d;
  kwNoteWinRef = winRef;
  kwNoteTitle.textContent = '🌸 ' + d + ' de ' + kwMonthNames[m] + ' 🌸';
  kwNoteArea.value = kwNotes[kwNoteKey] || '';
  kwNoteBox.style.display = 'flex';
  kwNoteArea.focus();
}
document.getElementById('kwNoteClose').addEventListener('click', ()=>{
  kwNoteBox.style.display = 'none';
});
document.getElementById('kwNoteSave').addEventListener('click', ()=>{
  const text = kwNoteArea.value.trim();
  if(text) kwNotes[kwNoteKey] = text;
  else delete kwNotes[kwNoteKey];
  kwNoteBox.style.display = 'none';
  if(kwNoteWinRef && document.body.contains(kwNoteWinRef)) renderCalendar(kwNoteWinRef);
});
