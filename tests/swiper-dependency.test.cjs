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

test('all pages load only the patched pinned Swiper bundle', () => {
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.ok(html.includes('swiper@' + version + '/swiper-bundle.min.css'), page + ': CSS');
    assert.ok(html.includes('swiper@' + version + '/swiper-bundle.min.js'), page + ': JS');
    assert.ok(!html.includes('./lib/swiper.js') && !html.includes('./lib/swiper.css'), page + ': old assets');
    assert.ok(html.indexOf('swiper-bundle.min.js') < html.indexOf('./script/app.js'), page + ': load order');
  }
});

test('old bundled assets and vulnerable npm dependency are absent', () => {
  assert.equal(fs.existsSync(path.join(root, 'lib/swiper.js')), false);
  assert.equal(fs.existsSync(path.join(root, 'lib/swiper.css')), false);
  const pkg = require('../package.json');
  const lock = require('../package-lock.json');
  assert.equal(pkg.dependencies?.swiper, undefined);
  assert.equal(lock.packages?.['node_modules/swiper'], undefined);
});

test('slider initializes once after collecting slides and respects reduced motion', () => {
  const js = fs.readFileSync(path.join(root, 'script/app.js'), 'utf8');
  assert.ok(js.includes('if (results.length) initSwiper();'));
  assert.ok(js.includes('prefers-reduced-motion: reduce'));
});
