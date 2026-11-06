const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = [
  'index.html', 'movies.html', 'tv-shows.html',
  'search.html', 'movie-details.html', 'tv-details.html',
];
const version = '12.1.2';

test('every page loads only the patched, pinned Swiper bundle', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.match(html, new RegExp('swiper@' + version.replaceAll('.', '\\.') + '/swiper-bundle\\.min\\.css'));
    assert.match(html, new RegExp('swiper@' + version.replaceAll('.', '\\.') + '/swiper-bundle\\.min\\.js'));
    assert.doesNotMatch(html, /\\.\\/lib\\/swiper\\.(js|css)/);
    assert.ok(html.indexOf('swiper-bundle.min.js') < html.indexOf('./script/app.js'), page + ' must load Swiper before app code');
  }
});

test('old vendored assets and vulnerable npm dependency are absent', () => {
  assert.equal(fs.existsSync(path.join(root, 'lib/swiper.js')), false);
  assert.equal(fs.existsSync(path.join(root, 'lib/swiper.css')), false);
  const pkg = require('../package.json');
  const lock = require('../package-lock.json');
  assert.equal(pkg.dependencies?.swiper, undefined);
  assert.equal(lock.packages?.['node_modules/swiper'], undefined);
});

test('slider initializes after collecting slides instead of per slide', () => {
  const js = fs.readFileSync(path.join(root, 'script/app.js'), 'utf8');
  assert.match(js, /if \\(results\\.length\\) initSwiper\\(\\)/);
  assert.match(js, /prefers-reduced-motion: reduce/);
});
