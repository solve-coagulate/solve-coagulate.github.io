const assert = require('assert');
const loadDom = require('./helpers');

const dom = loadDom('{}');
const { document, saveEntry } = dom.window;

document.getElementById('date').value = '2025-07-10';
document.getElementById('log').value = 'Test workout';
document.getElementById('exercised').checked = true;

saveEntry();

const stored = JSON.parse(dom.window.localStorage.getItem('exerciseLogs'));
assert.deepStrictEqual(stored['2025-07-10'], { log: 'Test workout', exercised: true });

const entries = document.querySelectorAll('#output .log-entry');
assert.strictEqual(entries.length, 1);

console.log('save entry DOM test passed');
