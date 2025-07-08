(()=>{
  const APP_KEY='dietTracker';
  // Use local timezone to get correct date
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISO = new Date(now - tzOffset).toISOString().split('T')[0];
  const todayDate = localISO;
  const diaryDateInput = document.getElementById('diaryDate');
  diaryDateInput.value = todayDate;

  const $ = id => document.getElementById(id);
  window.myappdata = window.myappdata || JSON.parse(localStorage.getItem('myappdata')||'{}');
  if (!myappdata[APP_KEY]) myappdata[APP_KEY] = {};

  const saved = myappdata[APP_KEY];
  // Most recently used foods
  if (!saved.mruFoods) saved.mruFoods = [];
  const foodDB = saved.foodDB || {};
  const history = saved.history || {};
  saved.foodDB = foodDB;
  saved.history = history;

  let diaryEntries = [];
  let totals = {kj:0, protein:0, carbs:0, fat:0};

  /* START EXPORTS */
  const computeTotals = entries => entries.reduce((acc,e)=>({kj:acc.kj+e.kj,protein:acc.protein+e.protein,carbs:acc.carbs+e.carbs,fat:acc.fat+e.fat}),{kj:0,protein:0,carbs:0,fat:0});

  const updateMru = (list, name) => {
    const newList = list.filter(n => n !== name);
    newList.unshift(name);
    return newList;
  };

  const persist = () => {
    // include MRU list in storage
    myappdata[APP_KEY] = {foodDB, history, mruFoods: saved.mruFoods};
    localStorage.setItem('myappdata', JSON.stringify(myappdata));
  };

  const scaleEntry = (food, amount) => {
    const unitNum = parseFloat(food.unit) || 1;
    const mult = amount / unitNum;
    return {
      kj: food.kj * mult,
      protein: food.protein * mult,
      carbs: food.carbs * mult,
      fat: food.fat * mult
    };
  };

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

  if (typeof window !== 'undefined') window.DietTrackerExports = {computeTotals, updateMru, persist, scaleEntry};
  /* END EXPORTS */

  const loadDiary = (date) => {
    const data = history[date];
    diaryEntries = data ? [...data.entries] : [];
    totals = computeTotals(diaryEntries);
    renderDiaryTable();
    renderTotals();
  };

  diaryDateInput.addEventListener('change',()=>{
    loadDiary(diaryDateInput.value);
  });

  const updateDatalist = () => {
    const dl = $('foodOptions');
    dl.innerHTML = '';
    // prepare sorted list same as food table MRU order
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
    entries.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      dl.appendChild(opt);
    });
  };

  const renderTotals = () => {
    $('totalKj').textContent = totals.kj.toFixed(1);
    $('totalProtein').textContent = totals.protein.toFixed(1);
    $('totalCarbs').textContent = totals.carbs.toFixed(1);
    $('totalFat').textContent = totals.fat.toFixed(1);
  };

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
      tr.innerHTML = `<td class="name-cell" data-name="${name}">${name}</td><td>${n.unit||'100g'}</td><td>${n.kj.toFixed(1)}</td><td>${n.protein.toFixed(1)}</td><td>${n.carbs.toFixed(1)}</td><td>${n.fat.toFixed(1)}</td><td><button class="del-btn" data-name="${encodeURIComponent(name)}">X</button></td>`;
      tbody.appendChild(tr);
    });
  };

  const renderDiaryTable = () => {
    const tbody = $('diaryTable').querySelector('tbody'); tbody.innerHTML='';
    diaryEntries.forEach((e, i)=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${e.food}</td><td>${e.amount}</td><td>${e.kj.toFixed(1)}</td><td>${e.protein.toFixed(1)}</td><td>${e.carbs.toFixed(1)}</td><td>${e.fat.toFixed(1)}</td><td><button class="del-btn" data-index="${i}">X</button></td>`;
      tbody.appendChild(tr);
    });
  };

  const renderHistoryTable = () => {
    const tbody = $('historyTable').querySelector('tbody');
    tbody.innerHTML = '';
    // Sort dates descending so most recent is first
    Object.entries(history)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .forEach(([date, data]) => {
        const t = data.totals;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${date}</td><td>${t.kj.toFixed(1)}</td><td>${t.protein.toFixed(1)}</td><td>${t.carbs.toFixed(1)}</td><td>${t.fat.toFixed(1)}</td>`;
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
    document.getElementById('foodForm').reset();
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
    const data = localStorage.getItem('myappdata') || '';
    $('dataBox').value = data;
    showNotification('Data exported to text box');
  });
  // Data import button
  $('importBtn')?.addEventListener('click', () => {
    const text = $('dataBox').value.trim();
    if (!text) { showNotification('No data to import'); return; }
    let parsedFull;
    try {
      parsedFull = JSON.parse(text);
    } catch(e) {
      showNotification('Invalid JSON format');
      return;
    }
    const newData = parsedFull[APP_KEY] || {};
    // merge into existing storage
    const currentFull = JSON.parse(localStorage.getItem('myappdata') || '{}');
    currentFull[APP_KEY] = newData;
    localStorage.setItem('myappdata', JSON.stringify(currentFull));
    showNotification('Data imported successfully! Reloading...');
    location.reload();
  });
})();
