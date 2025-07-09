const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

module.exports = function loadDom(initialData = '{}') {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/' });
  const scripts = dom.window.document.querySelectorAll('script');
  if (scripts.length > 1) {
    dom.window.eval(scripts[1].textContent);
  }
  dom.window.localStorage.setItem('exerciseLogs', initialData);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return dom;
};
