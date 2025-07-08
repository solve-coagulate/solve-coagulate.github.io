const assert = require('assert');

const loadExports = require('./helpers');
const { computeTotals } = loadExports();

const toPlain = obj => JSON.parse(JSON.stringify(obj));

// tests
assert.deepStrictEqual(toPlain(computeTotals([])), {kj:0, protein:0, carbs:0, fat:0}, 'empty array');
assert.deepStrictEqual(toPlain(computeTotals([{kj:100,protein:10,carbs:20,fat:5}])), {kj:100, protein:10, carbs:20, fat:5}, 'single entry');
assert.deepStrictEqual(
  toPlain(computeTotals([
    {kj:100,protein:10,carbs:20,fat:5},
    {kj:200,protein:20,carbs:40,fat:10}
  ])),
  {kj:300, protein:30, carbs:60, fat:15},
  'multiple entries'
);

console.log('computeTotals tests passed');
