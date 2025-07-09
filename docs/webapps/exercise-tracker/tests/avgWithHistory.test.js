const assert = require('assert');
const loadDom = require('./helpers');

// Create 21 consecutive workout days starting 2025-06-20
const data = {};
const start = new Date(2025, 5, 20); // months are 0-indexed
for (let i = 0; i < 21; i++) {
  const d = new Date(start);
  d.setDate(start.getDate() + i);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  data[`${y}-${m}-${day}`] = { exercised: true };
}

const dom = loadDom(JSON.stringify(data));
const { avgWithHistory } = dom.window;

// Dates shown in chart from 2025-06-27 to 2025-07-10
const dates = [];
const showStart = new Date(2025, 5, 27);
for (let i = 0; i < 14; i++) {
  const d = new Date(showStart);
  d.setDate(showStart.getDate() + i);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  dates.push(`${y}-${m}-${day}`);
}

const avgs = avgWithHistory(dates, data, 7);
assert.strictEqual(avgs[0], 1);

console.log('avgWithHistory test passed');

