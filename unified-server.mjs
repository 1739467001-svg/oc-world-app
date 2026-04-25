/**
 * Unified server: serves frontend dist/ + proxies /api/* to backend:3001
 * Port: 8080
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.map':  'application/json',
};

function proxyToBackend(req, res) {
  const opts = {
    hostname: '127.0.0.1',
    port: 3001,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: 'localhost:3001' },
  };
  const proxy = http.request(opts, (pres) => {
    res.writeHead(pres.statusCode, pres.headers);
    pres.pipe(res, { end: true });
  });
  proxy.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Backend unavailable' }));
  });
  req.pipe(proxy, { end: true });
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];

  // Proxy API requests
  if (urlPath.startsWith('/api')) {
    return proxyToBackend(req, res);
  }

  // Serve static assets
  let filePath = path.join(DIST, urlPath);
  const ext = path.extname(filePath);

  // SPA fallback for routes without extension
  if (!ext || !fs.existsSync(filePath)) {
    filePath = path.join(DIST, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const mime = MIME[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
});

server.listen(8080, '0.0.0.0', () => {
  console.log('✓ Unified server listening on http://0.0.0.0:8080');
});
