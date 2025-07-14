const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { JSDOM } = require('jsdom');

module.exports = async function() {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/' });
  const initial = {
    dietTracker: {
      foodDB: { apple: { unit: '100g', kj: 100, protein: 1, carbs: 10, fat: 1 } },
      history: {},
      mruFoods: []
    }
  };
  dom.window.localStorage.setItem('myappdata', JSON.stringify(initial));
  const script = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  dom.window.eval(script);
  dom.window.HTMLAnchorElement.prototype.click = function() {};

  // stub URL helpers to capture blob
  let blobCaptured; let revoked;
  dom.window.URL.createObjectURL = blob => { blobCaptured = blob; return 'blob:test'; };
  dom.window.URL.revokeObjectURL = url => { revoked = url; };

  await dom.window.DietTrackerExports.downloadDataFile();
  assert(blobCaptured instanceof dom.window.Blob);
  assert.strictEqual(revoked, 'blob:test');
  assert.strictEqual(dom.window.document.querySelectorAll('a').length, 0);

  // stub FileReader for synchronous behaviour
  const newData = {
    dietTracker: {
      foodDB: { banana: { unit: '100g', kj: 200, protein: 2, carbs: 20, fat: 2 } },
      history: {},
      mruFoods: []
    }
  };
  const fileText = JSON.stringify(newData);
  dom.window.FileReader = class {
    constructor() { this.onload = null; }
    readAsText() { this.result = fileText; this.onload(); }
  };
  const file = new dom.window.File([fileText], 'data.json', { type: 'application/json' });
  await dom.window.DietTrackerExports.handleFileUpload(file);
  assert.strictEqual(dom.window.localStorage.getItem('myappdata'), fileText);

  console.log('DOM file transfer test passed');
};
