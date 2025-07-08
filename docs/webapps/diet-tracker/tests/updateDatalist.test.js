const assert = require('assert');
const loadExports = require('./helpers');
const { saved, foodDB, updateDatalist } = loadExports();
Object.assign(foodDB, { apple:{}, banana:{}, carrot:{} });
saved.mruFoods = ['banana','apple'];
const order = updateDatalist();
assert.deepStrictEqual(order.slice(0,2), ['banana','apple']);
console.log('updateDatalist tests passed');
