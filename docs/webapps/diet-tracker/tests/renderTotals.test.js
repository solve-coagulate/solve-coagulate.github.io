const assert = require('assert');
const loadExports = require('./helpers');

// load module without DOM
const ctx = loadExports();
const { history, loadDiary, renderTotals } = ctx;

// stub DOM elements
const elements = {
  totalKj: { textContent: '' },
  totalProtein: { textContent: '' },
  totalCarbs: { textContent: '' },
  totalFat: { textContent: '' }
};

const dummyTable = {
  querySelector() {
    return { innerHTML: '', appendChild() {} };
  }
};

global.document = {
  getElementById(id) {
    if (id === 'diaryTable') return dummyTable;
    return elements[id] || {};
  },
  createElement(tag) {
    return { dataset: {}, appendChild() {}, textContent: '', className: '', children: [], tagName: tag };
  }
};

history['2025-07-01'] = {
  entries: [{ food: 'apple', amount: 100, kj: 100, protein: 10, carbs: 20, fat: 5 }],
  totals: { kj: 100, protein: 10, carbs: 20, fat: 5 }
};

// load the diary to set totals
loadDiary('2025-07-01');
renderTotals();

assert.strictEqual(elements.totalKj.textContent, '100.0');
assert.strictEqual(elements.totalProtein.textContent, '10.0');
assert.strictEqual(elements.totalCarbs.textContent, '20.0');
assert.strictEqual(elements.totalFat.textContent, '5.0');

console.log('renderTotals tests passed');

delete global.document;
