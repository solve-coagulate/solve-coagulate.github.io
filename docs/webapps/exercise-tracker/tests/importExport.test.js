const assert = require('assert');
const loadDom = require('./helpers');

const dom = loadDom('{}');
const { document, importFromText, exportToTextbox } = dom.window;

document.getElementById('importData').value = '{"2025-07-11":{"log":"Run","exercised":true}}';
importFromText();
assert.strictEqual(dom.window.localStorage.getItem('exerciseLogs'), '{"2025-07-11":{"log":"Run","exercised":true}}');

exportToTextbox();
assert.strictEqual(document.getElementById('importData').value, '{"2025-07-11":{"log":"Run","exercised":true}}');

console.log('import/export tests passed');
