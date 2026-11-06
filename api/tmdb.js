// Vercel Serverless Function: keep the TMDb API key on the server.
// Configure TMDB_API_KEY in Vercel Project Settings -> Environment Variables.
const ALLOWED_PATHS = [
  /^movie\/(?:popular|upcoming|now_playing|\d+)$/,
  /^tv\/(?:popular|\d+)$/,
  /^company\/\d+$/,
  /^trending\/(?:movie|tv)\/day$/,
  /^search\/(?:movie|tv)$/,
];

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.TMDB_API_KEY;
  if (!token) return res.status(503).json({ error: 'Movie data is not configured.' });

  const path = typeof req.query.path === 'string' ? req.query.path.replace(/^\/+/, '') : '';
  if (!ALLOWED_PATHS.some(pattern => pattern.test(path))) {
    return res.status(400).json({ error: 'Unsupported data request' });
  }

  const search = typeof req.query.query === 'string' ? req.query.query.trim() : '';
  if (path.startsWith('search/') && (!search || search.length > 120)) {
    return res.status(400).json({ error: 'Invalid search query' });
  }
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  if (!Number.isInteger(page) || page < 1 || page > 500) {
    return res.status(400).json({ error: 'Invalid page' });
  }

  const url = new URL('https://api.themoviedb.org/3/' + path);
  url.searchParams.set('api_key', token);
  url.searchParams.set('language', 'en-US');
  if (path.startsWith('search/')) url.searchParams.set('query', search);
  if (path.startsWith('search/')) url.searchParams.set('page', String(page));

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const text = await response.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
    return res.status(response.ok ? 200 : 502).send(response.ok ? text : JSON.stringify({ error: 'Movie data request failed' }));
  } catch {
    return res.status(502).json({ error: 'Movie data is temporarily unavailable' });
  }
};
