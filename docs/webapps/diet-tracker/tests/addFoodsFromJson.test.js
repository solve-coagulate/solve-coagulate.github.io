const assert = require('assert');
const loadExports = require('./helpers');
const { foodDB, addFoodsFromJson } = loadExports({ dietTracker:{ foodDB:{}, history:{}, mruFoods:[] } });

addFoodsFromJson(JSON.stringify({ apple:{ unit:'50g', kj:150, protein:1 } }));
assert(foodDB.apple);
assert.strictEqual(foodDB.apple.unit, '50g');

addFoodsFromJson(JSON.stringify({ foodDB:{ banana:{ kj:200 } } }));
assert.strictEqual(foodDB.banana.unit, '100g');
console.log('addFoodsFromJson tests passed');

