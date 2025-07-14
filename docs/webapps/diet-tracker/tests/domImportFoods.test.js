const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');

module.exports = function() {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/' });
  dom.window.localStorage.setItem('myappdata', JSON.stringify({ dietTracker: { foodDB: {}, history: {}, mruFoods: [] } }));
  const script = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  dom.window.eval(script);

  const doc = dom.window.document;
  doc.getElementById('dataBox').value = JSON.stringify({ pear: { unit: '100g', kj: 50, protein: 1, carbs: 13, fat: 0 } });
  doc.getElementById('importFoodBtn').dispatchEvent(new dom.window.Event('click', { bubbles: true }));

  const stored = JSON.parse(dom.window.localStorage.getItem('myappdata'));
  assert(stored.dietTracker.foodDB.pear);
  assert.strictEqual(doc.querySelector('#foodTable tbody').children.length, 1);
  console.log('DOM import foods test passed');
};

