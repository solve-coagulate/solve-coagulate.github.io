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
  // preload localStorage with a food
  const data = {
    dietTracker: {
      foodDB: {
        banana: { unit: '100g', kj: 100, protein: 1, carbs: 20, fat: 3 }
      },
      history: {},
      mruFoods: []
    }
  };
  dom.window.localStorage.setItem('myappdata', JSON.stringify(data));
  const script = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  dom.window.eval(script);

  const doc = dom.window.document;
  doc.getElementById('diaryFood').value = 'banana';
  doc.getElementById('amount').value = '150';
  doc.getElementById('addDiaryBtn').dispatchEvent(new dom.window.Event('click', { bubbles: true }));

  const rowCount = doc.querySelector('#diaryTable tbody').children.length;
  assert.strictEqual(rowCount, 1);
  assert.strictEqual(doc.getElementById('totalKj').textContent, '150.0');
  assert.strictEqual(doc.getElementById('totalCarbs').textContent, '30.0');
  console.log('DOM diary add test passed');
};
