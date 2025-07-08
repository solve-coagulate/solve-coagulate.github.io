const assert = require('assert');
const loadExports = require('./helpers');
const { history, loadDiary } = loadExports();
history['2025-07-08'] = {
  entries: [{food:'apple',amount:100,kj:100,protein:10,carbs:20,fat:5}],
  totals: {kj:100, protein:10, carbs:20, fat:5}
};
const result = loadDiary('2025-07-08');
assert.strictEqual(result.totals.kj, 100);
assert.strictEqual(result.diaryEntries.length, 1);
console.log('loadDiary tests passed');

