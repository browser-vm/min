import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet/dist';
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
    try {
      const encodedUrl = Buffer.from(serviceUrl, 'utf-8').toString('base64');
      const proxyUrl = `http://${hostname()}:${port}/service/${encodedUrl}`;
      console.log(`Generated proxy URL: ${proxyUrl}`);
      res.send(proxyUrl);
    } catch (error) {
      console.error('Error encoding URL:', error);
      res.status(500).send('Error generating proxy URL');
    }
  } else {
    res.status(400).send('No URL provided');
  }
});

// Ultraviolet handler
app.use('/service/*', (req, res) => {
  try {
    const encodedPart = req.url.split('/service/')[1];
    const urlToProxy = Buffer.from(encodedPart, 'base64').toString('utf-8');
    console.log(`Decoded URL to proxy: ${urlToProxy}`);
    req.url = urlToProxy;
    const handler = uvPath.requireHandle();
    if (typeof handler === 'function') {
      handler(req, res);
    } else {
      console.error('Invalid handler function');
      res.status(500).send('Internal server error');
    }
  } catch (error) {
    console.error('Error decoding URL:', error);
    res.status(400).send('Invalid URL encoding');
  }
});

httpServer.listen(port, () => {
  console.log(`Ultraviolet Proxy is running on http://${hostname()}:${port}`);
});