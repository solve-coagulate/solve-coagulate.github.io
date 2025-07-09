const assert = require('assert');
const loadDom = require('./helpers');

const dom = loadDom();
const { formatDateForDisplay, getTodayDateString } = dom.window;

// Test getTodayDateString format YYYY-MM-DD
const today = new Date();
const expected = today.toISOString().split('T')[0];
assert.strictEqual(getTodayDateString(), expected);

// Test formatting of a specific date
assert.strictEqual(
  formatDateForDisplay('2025-07-04'),
  new Date(2025, 6, 4).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
);

console.log('format date tests passed');
