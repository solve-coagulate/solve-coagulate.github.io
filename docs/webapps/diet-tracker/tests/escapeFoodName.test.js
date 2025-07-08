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

const special = '<script>alert("x")</script>';
history['2025-07-03'] = {
  entries: [{ food: special, amount: 1, kj: 1, protein: 1, carbs: 1, fat: 1 }],
  totals: { kj: 1, protein: 1, carbs: 1, fat: 1 }
};

loadDiary('2025-07-03');
tbody.children = [];
renderDiaryTable();

assert.strictEqual(tbody.children[0].children[0].textContent, special);

console.log('escapeFoodName tests passed');

delete global.document;
