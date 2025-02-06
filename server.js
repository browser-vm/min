import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { join } from 'path';
import { hostname } from 'os';

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 8080;

// Serve static Ultraviolet files
app.use('/uv/', express.static(uvPath));

// Serve your static frontend files
app.use(express.static('public'));

// Generate proxied URL
app.get('/generate-proxy-url', (req, res) => {
  const serviceUrl = req.query.url;
  if (serviceUrl) {
    const encodedUrl = Buffer.from(serviceUrl).toString('base64');
    const proxyUrl = `http://${hostname()}:${port}/service/${encodedUrl}`;
    res.send(proxyUrl);
  } else {
    res.status(400).send('No URL provided');
  }
});

// Ultraviolet handler
app.use('/service/', (req, res) => {
  const urlToProxy = Buffer.from(req.url.slice(1), 'base64').toString('utf-8');
  req.url = urlToProxy;
  uvPath.requireHandle()(req, res);
});

httpServer.listen(port, () => {
  console.log(`Ultraviolet Proxy is running on http://${hostname()}:${port}`);
});
