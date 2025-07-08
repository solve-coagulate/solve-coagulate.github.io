const assert = require('assert');
const loadExports = require('./helpers');
const { parseUnitNumber } = loadExports();

assert.strictEqual(parseUnitNumber('100g'), 100);
assert.strictEqual(parseUnitNumber('1,5 cup'), 1.5);
assert.strictEqual(parseUnitNumber('1,000 g'), 1000);
console.log('parseUnitNumber tests passed');
