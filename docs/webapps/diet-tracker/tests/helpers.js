const fs = require('fs');
const path = require('path');
const vm = require('vm');

module.exports = function loadExports() {
  const htmlPath = path.join(__dirname, '../index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const match = html.match(/\/\* START EXPORTS \*\/[\s\S]*?\/\* END EXPORTS \*\//);
  if (!match) throw new Error('Export section not found');
  const code = match[0].replace(/\/\* START EXPORTS \*\//, '').replace(/\/\* END EXPORTS \*\//, '');
  const context = {
    localStorage: {
      _data: {},
      setItem(k, v) { this._data[k] = v; },
      getItem(k) { return this._data[k]; }
    },
    myappdata: {},
    APP_KEY: 'dietTracker',
    foodDB: {},
    history: {},
    saved: { mruFoods: [] },
    module: { exports: {} }
  };
  vm.createContext(context);
  vm.runInContext(code + '\nthis.computeTotals = computeTotals;\nthis.updateMru = updateMru;\nthis.persist = persist;', context);
  return context;
};
