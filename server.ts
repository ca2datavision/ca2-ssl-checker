import express from 'express';
import { createServer as createViteServer } from 'vite';
import sslChecker from 'ssl-checker';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();


  app.use(express.json());

  // API endpoint for SSL checking
  app.post('/ssl/api/check-ssl', async (req, res) => {
    try {
      const { hostname } = new URL(req.body.url);
      const result = await sslChecker(hostname);

      let status: Website['status'] = 'valid';
      if (result.daysRemaining <= 0) {
        status = 'expired';
      } else if (result.daysRemaining <= 7) {
        status = 'expires-soon';
      } else if (result.daysRemaining <= 30) {
        status = 'expires-soon-warning';
      }

      return res.json({
        status,
        expiryDate: new Date(Date.now() + (result.daysRemaining * 24 * 60 * 60 * 1000)).toISOString(),
        lastChecked: new Date().toISOString()
      });
    } catch (error) {
      console.log('check-ssl error', error);
      return res.json({
        status: 'error' as Website['status'],
        lastChecked: new Date().toISOString()
      });
    }
  });

  // Serve static files from the dist directory
  app.use('/ssl', express.static(resolve(__dirname, 'dist')));

  // Handle all routes under /ssl/ to serve the SPA
  app.get('/ssl/*', (req, res) => {
    res.sendFile(resolve(__dirname, 'dist/index.html'));
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Only use Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    app.use(vite.middlewares);
  }

  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/ssl');
  });
}

createServer();
