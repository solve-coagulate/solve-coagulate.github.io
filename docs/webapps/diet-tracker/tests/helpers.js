module.exports = function loadExports() {
  delete require.cache[require.resolve('../app.js')];
  global.localStorage = {
    _data: {},
    setItem(k, v) { this._data[k] = v; },
    getItem(k) { return this._data[k]; }
  };
  global.myappdata = {};
  return require('../app.js');
};
