const assert = require('assert');

const computeTotals = entries => entries.reduce((acc, e) => ({
  kj: acc.kj + e.kj,
  protein: acc.protein + e.protein,
  carbs: acc.carbs + e.carbs,
  fat: acc.fat + e.fat
}), {kj:0, protein:0, carbs:0, fat:0});

// tests
assert.deepStrictEqual(computeTotals([]), {kj:0, protein:0, carbs:0, fat:0}, 'empty array');
assert.deepStrictEqual(computeTotals([{kj:100,protein:10,carbs:20,fat:5}]), {kj:100, protein:10, carbs:20, fat:5}, 'single entry');
assert.deepStrictEqual(
  computeTotals([
    {kj:100,protein:10,carbs:20,fat:5},
    {kj:200,protein:20,carbs:40,fat:10}
  ]),
  {kj:300, protein:30, carbs:60, fat:15},
  'multiple entries'
);

console.log('computeTotals tests passed');
