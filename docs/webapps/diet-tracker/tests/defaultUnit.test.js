const assert = require('assert');
const loadExports = require('./helpers');

const initialData = {
  dietTracker: {
    foodDB: {
      'Sour Cream per 100g': { kj: 1400, protein: 1.9, carbs: 2.2, fat: 36 }
    },
    history: {}
  }
};

const { foodDB } = loadExports(initialData);
assert.strictEqual(foodDB['Sour Cream per 100g'].unit, '100g');
console.log('default unit tests passed');
