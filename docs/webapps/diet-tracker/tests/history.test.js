const assert = require('assert');
const loadExports = require('./helpers');
const { history, renderHistoryTable } = loadExports();
Object.assign(history, {
  '2025-01-02': { totals:{kj:1,protein:1,carbs:1,fat:1}, entries:[] },
  '2025-01-03': { totals:{kj:2,protein:2,carbs:2,fat:2}, entries:[] },
  '2025-01-01': { totals:{kj:0,protein:0,carbs:0,fat:0}, entries:[] }
});
const rows = renderHistoryTable();
assert.deepStrictEqual(rows.map(r => r[0]), ['2025-01-03','2025-01-02','2025-01-01']);
console.log('history sorting tests passed');
