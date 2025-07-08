const assert = require('assert');

const updateMru = (list, name) => {
  const newList = list.filter(n => n !== name);
  newList.unshift(name);
  return newList;
};

// tests
assert.deepStrictEqual(updateMru([], 'apple'), ['apple']);
assert.deepStrictEqual(updateMru(['apple','banana'], 'banana'), ['banana','apple']);
assert.deepStrictEqual(updateMru(['apple','banana'], 'apple'), ['apple','banana']);

console.log('MRU tests passed');
