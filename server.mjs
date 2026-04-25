/**
 * Unified server: serves frontend static files + proxies /api to backend
 * Runs on port 8080
 */
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, 'dist');
const BACKEND_PORT = 3001;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = createServer((req, res) => {
  const url = req.url || '/';

  // Proxy /api requests to backend
  if (url.startsWith('/api')) {
    const options = {
      hostname: 'localhost',
      port: BACKEND_PORT,
      path: url,
      method: req.method,
      headers: req.headers,
    };

    const { request } = await import('http').catch(() => ({ request: null }));
    
    // Use dynamic import for http proxy
    import('http').then(({ request: httpRequest }) => {
      const proxyReq = httpRequest(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
        proxyRes.pipe(res);
      });
      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(502);
        res.end('Backend unavailable');
      });
      req.pipe(proxyReq);
    });
    return;
  }

  // Serve static files
  let filePath = join(DIST_DIR, url === '/' ? 'index.html' : url);
  
  // Remove query string
  filePath = filePath.split('?')[0];

  if (!existsSync(filePath) || !extname(filePath)) {
    // SPA fallback: serve index.html for all non-asset routes
    filePath = join(DIST_DIR, 'index.html');
  }

  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(8080, '0.0.0.0', () => {
  console.log('Unified server running on http://0.0.0.0:8080');
});
