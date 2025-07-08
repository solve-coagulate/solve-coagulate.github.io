const APP_KEY = 'dietTracker';
globalThis.myappdata = globalThis.myappdata || JSON.parse(typeof localStorage !== 'undefined' ? localStorage.getItem('myappdata') || '{}' : '{}');
if (!globalThis.myappdata[APP_KEY]) globalThis.myappdata[APP_KEY] = {};

const saved = globalThis.myappdata[APP_KEY];
if (!saved.mruFoods) saved.mruFoods = [];
const foodDB = saved.foodDB || {};
const history = saved.history || {};
saved.foodDB = foodDB;
saved.history = history;
// Ensure all foods have a unit; default to '100g' if missing
Object.values(foodDB).forEach(f => {
  if (!f.unit) f.unit = '100g';
});

let diaryEntries = [];
let totals = {kj:0, protein:0, carbs:0, fat:0};

const computeTotals = entries => entries.reduce((acc,e)=>({kj:acc.kj+e.kj,protein:acc.protein+e.protein,carbs:acc.carbs+e.carbs,fat:acc.fat+e.fat}),{kj:0,protein:0,carbs:0,fat:0});

const updateMru = (list, name) => {
  const newList = list.filter(n => n !== name);
  newList.unshift(name);
  return newList;
};

const persist = () => {
  globalThis.myappdata[APP_KEY] = {foodDB, history, mruFoods: saved.mruFoods};
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('myappdata', JSON.stringify(globalThis.myappdata));
  }
};

const parseUnitNumber = unit => {
  if (unit == null) return 1;
  const m = String(unit).trim().match(/[0-9.,]+/);
  if (!m) return 1;
  let str = m[0];
  if (str.includes(',') && !str.includes('.')) {
    const parts = str.split(',');
    if (parts.length === 2 && parts[1].length !== 3) {
      str = parts[0] + '.' + parts[1];
    } else {
      str = str.replace(/,/g, '');
    }
  } else {
    str = str.replace(/,/g, '');
  }
  const num = parseFloat(str);
  return isNaN(num) ? 1 : num;
};

const scaleEntry = (food, amount) => {
  const unitNum = parseUnitNumber(food.unit);
  const mult = amount / unitNum;
  return {
    kj: food.kj * mult,
    protein: food.protein * mult,
    carbs: food.carbs * mult,
    fat: food.fat * mult
  };
};

// Utility for DOM access when running in the browser
const $ = id => (typeof document === 'undefined' ? null : document.getElementById(id));

// Rebuild datalist options according to MRU order. Returns sorted names for tests.
const updateDatalist = () => {
  const entries = Object.keys(foodDB);
  entries.sort((a, b) => {
    const iA = saved.mruFoods.indexOf(a);
    const iB = saved.mruFoods.indexOf(b);
    if (iA !== -1 || iB !== -1) {
      if (iA === -1) return 1;
      if (iB === -1) return -1;
      return iA - iB;
    }
    return a.localeCompare(b);
  });
  if (typeof document !== 'undefined') {
    const dl = $('foodOptions');
    if (dl) {
      dl.innerHTML = '';
      entries.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        dl.appendChild(opt);
      });
    }
  }
  return entries;
};

// Create sorted history rows and render when DOM is available
const renderHistoryTable = () => {
  const rows = Object.entries(history)
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
  if (typeof document !== 'undefined') {
    const tbody = $('historyTable')?.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = '';
      rows.forEach(([date, data]) => {
        const t = data.totals;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${date}</td><td>${t.kj.toFixed(1)}</td><td>${t.protein.toFixed(1)}</td><td>${t.carbs.toFixed(1)}</td><td>${t.fat.toFixed(1)}</td>`;
        tbody.appendChild(tr);
      });
    }
  }
  return rows;
};

const renderTotals = () => {
  if (typeof document !== 'undefined') {
    $('totalKj').textContent = totals.kj.toFixed(1);
    $('totalProtein').textContent = totals.protein.toFixed(1);
    $('totalCarbs').textContent = totals.carbs.toFixed(1);
    $('totalFat').textContent = totals.fat.toFixed(1);
  }
};

const renderDiaryTable = () => {
  if (typeof document !== 'undefined') {
    const tbody = $('diaryTable').querySelector('tbody');
    tbody.innerHTML='';
    diaryEntries.forEach((e, i)=>{
      const tr=document.createElement('tr');
      const foodTd=document.createElement('td');
      foodTd.textContent=e.food;
      const amtTd=document.createElement('td');
      amtTd.textContent=e.amount;
      const kjTd=document.createElement('td');
      kjTd.textContent=e.kj.toFixed(1);
      const protTd=document.createElement('td');
      protTd.textContent=e.protein.toFixed(1);
      const carbTd=document.createElement('td');
      carbTd.textContent=e.carbs.toFixed(1);
      const fatTd=document.createElement('td');
      fatTd.textContent=e.fat.toFixed(1);
      const actionTd=document.createElement('td');
      const btn=document.createElement('button');
      btn.className='del-btn';
      btn.dataset.index=i;
      btn.textContent='X';
      actionTd.appendChild(btn);
      tr.appendChild(foodTd);
      tr.appendChild(amtTd);
      tr.appendChild(kjTd);
      tr.appendChild(protTd);
      tr.appendChild(carbTd);
      tr.appendChild(fatTd);
      tr.appendChild(actionTd);
      tbody.appendChild(tr);
    });
  }
};

const loadDiary = (date) => {
  const data = history[date];
  diaryEntries = data ? [...data.entries] : [];
  totals = computeTotals(diaryEntries);
  renderDiaryTable();
  renderTotals();
  return { diaryEntries, totals };
};

const exportData = () => (typeof localStorage === 'undefined' ? '' : (localStorage.getItem('myappdata') || ''));

const importData = text => {
  if (!text) throw new Error('No data to import');
  let parsedFull;
  try {
    parsedFull = JSON.parse(text);
  } catch (e) {
    throw new Error('Invalid JSON format');
  }
  const newData = parsedFull[APP_KEY] || {};
  const currentFull = JSON.parse(localStorage.getItem('myappdata') || '{}');
  currentFull[APP_KEY] = newData;
  localStorage.setItem('myappdata', JSON.stringify(currentFull));
};

if (typeof document !== 'undefined') {
  // Use local timezone to get correct date
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISO = new Date(now - tzOffset).toISOString().split('T')[0];
  const todayDate = localISO;
  const diaryDateInput = document.getElementById('diaryDate');
  diaryDateInput.value = todayDate;

  const $ = id => document.getElementById(id);

  const showNotification = message => {
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.classList.add('show'), 100);
    setTimeout(() => {
      n.classList.remove('show');
      setTimeout(() => document.body.removeChild(n), 300);
    }, 2000);
  };

  window.DietTrackerExports = {
    computeTotals,
    updateMru,
    persist,
    scaleEntry,
    updateDatalist,
    renderTotals,
    renderDiaryTable,
    renderHistoryTable,
    loadDiary,
    exportData,
    importData
  };

  // Expose helpers directly for debugging in browser consoles
  window.renderTotals = renderTotals;
  window.renderDiaryTable = renderDiaryTable;
  window.renderHistoryTable = renderHistoryTable;
  window.updateDatalist = updateDatalist;

  diaryDateInput.addEventListener('change',()=>{
    loadDiary(diaryDateInput.value);
  });

  const renderFoodTable = () => {
    const tbody = $('foodTable').querySelector('tbody'); tbody.innerHTML='';
    // sort foods by MRU first, then alphabetically
    const entries = Object.entries(foodDB).slice();
    entries.sort(([a], [b]) => {
      const iA = saved.mruFoods.indexOf(a);
      const iB = saved.mruFoods.indexOf(b);
      if (iA !== -1 || iB !== -1) return (iA === -1 ? 1 : (iB === -1 ? -1 : iA - iB));
      return a.localeCompare(b);
    });
    entries.forEach(([name,n])=>{
      const tr=document.createElement('tr');
      const nameTd=document.createElement('td');
      nameTd.className='name-cell';
      nameTd.dataset.name=name;
      nameTd.textContent=name;
      const unitTd=document.createElement('td');
      unitTd.textContent=n.unit||'100g';
      const kjTd=document.createElement('td');
      kjTd.textContent=n.kj.toFixed(1);
      const protTd=document.createElement('td');
      protTd.textContent=n.protein.toFixed(1);
      const carbTd=document.createElement('td');
      carbTd.textContent=n.carbs.toFixed(1);
      const fatTd=document.createElement('td');
      fatTd.textContent=n.fat.toFixed(1);
      const actionTd=document.createElement('td');
      const btn=document.createElement('button');
      btn.className='del-btn';
      btn.dataset.name=encodeURIComponent(name);
      btn.textContent='X';
      actionTd.appendChild(btn);
      tr.appendChild(nameTd);
      tr.appendChild(unitTd);
      tr.appendChild(kjTd);
      tr.appendChild(protTd);
      tr.appendChild(carbTd);
      tr.appendChild(fatTd);
      tr.appendChild(actionTd);
      tbody.appendChild(tr);
    });
  };



  $('addFoodBtn').addEventListener('click', () => {
    const name = $('foodName').value.trim();
    if (!name) { showNotification('Please enter a food name'); return; }
    foodDB[name] = {
      unit: $('unit').value.trim() || '100g',
      kj: parseFloat($('kj').value)||0,
      protein: parseFloat($('protein').value)||0,
      carbs: parseFloat($('carbs').value)||0,
      fat: parseFloat($('fat').value)||0
    };
    persist();
    renderFoodTable(); updateDatalist();
    // Clear fields after adding food
    ['foodName','unit','kj','protein','carbs','fat'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    showNotification(`${name} added to database!`);
  });

  $('foodTable').addEventListener('click', e => {
    if (e.target.classList.contains('del-btn')) {
      const name = decodeURIComponent(e.target.dataset.name);
      delete foodDB[name];
      persist();
      renderFoodTable(); updateDatalist();
      showNotification(`${name} deleted from database`);
    } else if (e.target.classList.contains('name-cell')) {
      const name = e.target.dataset.name;
      const f = foodDB[name];
      $('foodName').value = name;
      $('unit').value = f.unit || '100g';
      $('kj').value = f.kj;
      $('protein').value = f.protein;
      $('carbs').value = f.carbs;
      $('fat').value = f.fat;
      showNotification(`Loaded ${name} for editing`);
    }
  });

  $('addDiaryBtn').addEventListener('click',()=>{
    const name=$('diaryFood').value.trim(); const amt=parseFloat($('amount').value);
    if(!foodDB[name]){showNotification('Food not found in database');return;} if(!amt){showNotification('Please enter an amount');return;}
    const f=foodDB[name];
    const scaled = scaleEntry(f, amt);
    const entry={food:name,amount:amt,...scaled};
    diaryEntries.push(entry);
    totals = computeTotals(diaryEntries);
    renderDiaryTable(); renderTotals();
    // clear input fields
    $('diaryFood').value = '';
    $('amount').value = '';
    // update MRU list
    saved.mruFoods = updateMru(saved.mruFoods, name);
    // persist MRU update
    showNotification(`Added ${name} to diary`);
    persist();
  });

  // Diary delete listener
  $('diaryTable').addEventListener('click', e => {
    if (e.target.classList.contains('del-btn')) {
      const idx = parseInt(e.target.dataset.index);
      if (!isNaN(idx)) {
        const foodName = diaryEntries[idx].food;
        diaryEntries.splice(idx, 1);
        totals = computeTotals(diaryEntries);
        renderDiaryTable(); renderTotals();
        showNotification(`Removed ${foodName} from diary`);
        persist();
      }
    }
  });

  // Save day listener
  $('saveDayBtn').addEventListener('click', () => {
    const day = diaryDateInput.value;
    if (diaryEntries.length === 0) { showNotification('No entries to save'); return; }
    history[day] = { entries: [...diaryEntries], totals: { ...totals } };
    persist();
    renderHistoryTable();
    showNotification('Day saved.');
  });

  document.querySelectorAll('.tabBtn').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.tabBtn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  }));

  renderFoodTable(); updateDatalist(); renderHistoryTable();
  // Click on history row to load diary
  document.getElementById('historyTable').addEventListener('click', e => {
    const tr = e.target.closest('tr');
    if (!tr || tr.querySelector('th')) return;
    const date = tr.cells[0].textContent;
    diaryDateInput.value = date;
    loadDiary(date);
    // switch to Diary tab
    document.querySelector('.tabBtn[data-target="diaryPage"]').click();
    showNotification(`Loaded diary for ${date}`);
  });
  loadDiary(todayDate);
  // Data export button
  $('exportBtn')?.addEventListener('click', () => {
    const data = exportData();
    $('dataBox').value = data;
    showNotification('Data exported to text box');
  });
  // Data import button
  $('importBtn')?.addEventListener('click', () => {
    const text = $('dataBox').value.trim();
    try {
      importData(text);
    } catch(e) {
      showNotification(e.message);
      return;
    }
    showNotification('Data imported successfully! Reloading...');
    location.reload();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    computeTotals,
    updateMru,
    persist,
    scaleEntry,
    loadDiary,
    renderTotals,
    renderDiaryTable,
    updateDatalist,
    renderHistoryTable,
    exportData,
    importData,
    parseUnitNumber,
    foodDB,
    history,
    saved,
    myappdata: globalThis.myappdata,
    localStorage: globalThis.localStorage
  };
}
