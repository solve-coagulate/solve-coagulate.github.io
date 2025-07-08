const assert = require('assert');

const loadExports = require('./helpers');
const { updateMru } = loadExports();

// tests
assert.deepStrictEqual(updateMru([], 'apple'), ['apple']);
assert.deepStrictEqual(updateMru(['apple','banana'], 'banana'), ['banana','apple']);
assert.deepStrictEqual(updateMru(['apple','banana'], 'apple'), ['apple','banana']);

console.log('MRU tests passed');
