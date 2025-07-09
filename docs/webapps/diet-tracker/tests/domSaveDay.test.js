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
  const data = {
    dietTracker: {
      foodDB: {
        apple: { unit: '100g', kj: 200, protein: 2, carbs: 10, fat: 1 }
      },
      history: {},
      mruFoods: []
    }
  };
  dom.window.localStorage.setItem('myappdata', JSON.stringify(data));
  const script = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  dom.window.eval(script);

  const doc = dom.window.document;
  const date = doc.getElementById('diaryDate').value;
  doc.getElementById('diaryFood').value = 'apple';
  doc.getElementById('amount').value = '100';
  doc.getElementById('addDiaryBtn').dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  doc.getElementById('saveDayBtn').dispatchEvent(new dom.window.Event('click', { bubbles: true }));

  const stored = JSON.parse(dom.window.localStorage.getItem('myappdata'));
  assert(stored.dietTracker.history[date]);
  assert.strictEqual(doc.querySelector('#historyTable tbody').children.length, 1);
  console.log('DOM save day test passed');
};
