const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');

module.exports = function() {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: 'http://localhost/'
  });
  dom.window.localStorage.setItem('myappdata', JSON.stringify({ dietTracker: { foodDB: {}, history: {}, mruFoods: [] } }));
  const script = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  dom.window.eval(script);

  const doc = dom.window.document;
  doc.getElementById('foodName').value = 'banana';
  doc.getElementById('unit').value = '100g';
  doc.getElementById('kj').value = '400';
  doc.getElementById('protein').value = '5';
  doc.getElementById('carbs').value = '20';
  doc.getElementById('fat').value = '1';
  doc.getElementById('addFoodBtn').dispatchEvent(new dom.window.Event('click', { bubbles: true }));

  const stored = JSON.parse(dom.window.localStorage.getItem('myappdata'));
  assert(stored.dietTracker.foodDB.banana);
  assert.strictEqual(stored.dietTracker.foodDB.banana.unit, '100g');
  assert.strictEqual(doc.querySelector('#foodTable tbody').children.length, 1);
  console.log('DOM button test passed');
};
