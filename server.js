import express from 'express';
import { createServer } from 'node:http';
import Ultraviolet from '@titaniumnetwork-dev/ultraviolet';
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

const uv = new Ultraviolet({
  prefix: '/service/',
  bare: '/bare/',
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
});

// Generate proxied URL
app.get('/generate-proxy-url', (req, res) => {
  const serviceUrl = req.query.url;
  if (serviceUrl) {
    const encodedUrl = uv.encodeUrl(serviceUrl);
    const proxyUrl = `http://${hostname()}:${port}/service/${encodedUrl}`;
    res.send(proxyUrl);
  } else {
    res.status(400).send('No URL provided');
  }
});

app.use('/service/', uv.middleware());

httpServer.listen(port, () => {
  console.log(`Ultraviolet Proxy is running on http://${hostname()}:${port}`);
});