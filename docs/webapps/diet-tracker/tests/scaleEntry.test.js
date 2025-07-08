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
assert.deepStrictEqual(
  toPlain(scaleEntry(food, 100)),
  { kj: 200, protein: 10, carbs: 20, fat: 5 },
  'matches macros when amount equals unit'
);

const cup = { unit: '1 cup', kj: 120, protein: 6, carbs: 12, fat: 2 };
assert.deepStrictEqual(
  toPlain(scaleEntry(cup, 0.5)),
  { kj: 60, protein: 3, carbs: 6, fat: 1 },
  'scales correctly with non-gram units'
);

const complex = { unit: '1 cup (250g)', kj: 200, protein: 10, carbs: 20, fat: 5 };
assert.deepStrictEqual(
  toPlain(scaleEntry(complex, 50)),
  { kj: 10000, protein: 500, carbs: 1000, fat: 250 },
  'uses the first numeric value when unit string contains multiple numbers'
);

const spaced = { unit: '100 g', kj: 200, protein: 10, carbs: 20, fat: 5 };
assert.deepStrictEqual(
  toPlain(scaleEntry(spaced, 100)),
  { kj: 200, protein: 10, carbs: 20, fat: 5 },
  'handles spaces in the unit string'
);

console.log('scaleEntry tests passed');
