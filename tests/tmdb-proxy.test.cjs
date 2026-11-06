const test = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/tmdb.js');

function response() {
  return {
    code: 200,
    headers: {},
    status(value) { this.code = value; return this; },
    setHeader(name, value) { this.headers[name] = value; return this; },
    json(value) { this.body = value; return this; },
    send(value) { this.body = value; return this; },
  };
}

test('denies unsupported routes without forwarding credentials', async () => {
  const old = process.env.TMDB_API_KEY;
  process.env.TMDB_API_KEY = 'test-only-key';
  const originalFetch = global.fetch;
  let called = false;
  global.fetch = async () => { called = true; throw Error('should not fetch'); };
  try {
    const result = response();
    await handler({ method: 'GET', query: { path: 'account/1' } }, result);
    assert.equal(result.code, 400);
    assert.equal(called, false);
  } finally {
    global.fetch = originalFetch;
    if (old === undefined) delete process.env.TMDB_API_KEY;
    else process.env.TMDB_API_KEY = old;
  }
});

test('requires a server-side key', async () => {
  const old = process.env.TMDB_API_KEY;
  delete process.env.TMDB_API_KEY;
  try {
    const result = response();
    await handler({ method: 'GET', query: { path: 'movie/popular' } }, result);
    assert.equal(result.code, 503);
  } finally {
    if (old !== undefined) process.env.TMDB_API_KEY = old;
  }
});

test('forwards approved TMDb query and never returns key to the client', async () => {
  const old = process.env.TMDB_API_KEY;
  const originalFetch = global.fetch;
  process.env.TMDB_API_KEY = 'test-only-key';
  let requested;
  global.fetch = async url => {
    requested = String(url);
    return { ok: true, text: async () => JSON.stringify({ results: [] }) };
  };
  try {
    const result = response();
    await handler({ method: 'GET', query: { path: 'search/movie', query: 'Moon', page: '2' } }, result);
    assert.equal(result.code, 200);
    assert.deepEqual(JSON.parse(result.body), { results: [] });
    assert.match(requested, /search\/movie/);
    assert.match(requested, /query=Moon/);
    assert.match(requested, /page=2/);
    assert.match(requested, /api_key=test-only-key/);
    assert.ok(!JSON.stringify(result).includes('test-only-key'));
  } finally {
    global.fetch = originalFetch;
    if (old === undefined) delete process.env.TMDB_API_KEY;
    else process.env.TMDB_API_KEY = old;
  }
});
