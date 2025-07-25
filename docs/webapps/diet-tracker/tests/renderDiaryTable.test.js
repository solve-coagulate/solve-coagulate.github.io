const assert = require('assert');
const loadExports = require('./helpers');

const ctx = loadExports();
const { history, loadDiary, renderDiaryTable } = ctx;

const tbody = {
  children: [],
  appendChild(el) { this.children.push(el); }
};

const diaryTable = {
  querySelector(selector) {
    return selector === 'tbody' ? tbody : null;
  }
};

global.document = {
  getElementById(id) {
    if (id === 'diaryTable') return diaryTable;
    return {};
  },
  createElement(tag) {
    return {
      tagName: tag,
      children: [],
      dataset: {},
      className: '',
      textContent: '',
      appendChild(el) { this.children.push(el); }
    };
  }
};

history['2025-07-02'] = {
  entries: [
    { food: 'apple', amount: 100, kj: 100, protein: 10, carbs: 20, fat: 5 },
    { food: 'banana', amount: 50, kj: 50, protein: 5, carbs: 10, fat: 2 }
  ],
  totals: { kj: 150, protein: 15, carbs: 30, fat: 7 }
};

loadDiary('2025-07-02');
tbody.children = [];
tbody.innerHTML = '';
renderDiaryTable();

assert.strictEqual(tbody.children.length, 2);
assert.strictEqual(tbody.children[0].children[0].textContent, 'apple');
assert.strictEqual(tbody.children[1].children[0].textContent, 'banana');

console.log('renderDiaryTable tests passed');

delete global.document;
