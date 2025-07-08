const assert = require('assert');

const loadExports = require('./helpers');
const { scaleEntry } = loadExports();
const toPlain = obj => JSON.parse(JSON.stringify(obj));

const food = { unit: '100g', kj: 200, protein: 10, carbs: 20, fat: 5 };
assert.deepStrictEqual(
  toPlain(scaleEntry(food, 50)),
  { kj: 100, protein: 5, carbs: 10, fat: 2.5 },
  'scales by half when amount is half the unit'
);

const cup = { unit: '1 cup', kj: 120, protein: 6, carbs: 12, fat: 2 };
assert.deepStrictEqual(
  toPlain(scaleEntry(cup, 0.5)),
  { kj: 60, protein: 3, carbs: 6, fat: 1 },
  'scales correctly with non-gram units'
);

console.log('scaleEntry tests passed');
