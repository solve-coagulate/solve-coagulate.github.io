const assert = require('assert');

const loadExports = require('./helpers');
const ctx = loadExports();
const { persist, myappdata, localStorage, foodDB, history, saved } = ctx;

Object.assign(foodDB, { apple: {kj:100} });
Object.assign(history, {});
saved.mruFoods = ['apple'];

persist();

const stored = JSON.parse(localStorage.getItem('myappdata'));
assert.deepStrictEqual(stored.dietTracker.foodDB, ctx.foodDB);
assert.deepStrictEqual(stored.dietTracker.mruFoods, ['apple']);

console.log('persist tests passed');
