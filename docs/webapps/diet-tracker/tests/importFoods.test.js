const assert = require('assert');
const loadExports = require('./helpers');

const ctx = loadExports({ dietTracker: { foodDB: {}, history: {}, mruFoods: [] } });
const { foodDB, addFoodsFromJson } = ctx;

addFoodsFromJson(JSON.stringify({
  banana: { unit: '100g', kj: 300, protein: 2, carbs: 20, fat: 1 },
  cheese: { kj: 1200, protein: 25, carbs: 2, fat: 30 }
}));

assert(foodDB.banana);
assert.strictEqual(foodDB.cheese.unit, '100g');
console.log('import foods tests passed');

