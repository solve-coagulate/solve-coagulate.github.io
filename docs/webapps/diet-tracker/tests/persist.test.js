const assert = require('assert');

// simple localStorage stub
const fakeLocalStorage = (() => {
  let data = {};
  return {
    setItem: (k, v) => { data[k] = v; },
    getItem: k => data[k],
    reset: () => { data = {}; }
  };
})();

const persist = (myappdata, {foodDB, history, mruFoods}) => {
  myappdata['dietTracker'] = { foodDB, history, mruFoods };
  fakeLocalStorage.setItem('myappdata', JSON.stringify(myappdata));
};

const myappdata = {};
const saved = { foodDB:{apple:{kj:100}}, history:{}, mruFoods:['apple'] };

persist(myappdata, saved);
const stored = JSON.parse(fakeLocalStorage.getItem('myappdata'));
assert.deepStrictEqual(stored.dietTracker.foodDB, saved.foodDB);
assert.deepStrictEqual(stored.dietTracker.mruFoods, ['apple']);

console.log('persist tests passed');
