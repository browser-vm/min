import express from 'express';
import { createServer } from 'node:http';
import { publicPath } from 'ultraviolet-static';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { baremuxPath } from '@mercuryworkshop/bare-mux/node';
import { join } from 'node:path';
import { hostname } from 'node:os';
import wisp from 'wisp-server-node';
import Ultraviolet from '@titaniumnetwork-dev/ultraviolet';
import uvConfig from './uv.config.js';

const app = express();

// Log paths to ensure they are correct
console.log('publicPath:', publicPath);
console.log('uvPath:', uvPath);
console.log('epoxyPath:', epoxyPath);
console.log('baremuxPath:', baremuxPath);

// Load our publicPath first and prioritize it over UV.
app.use(express.static(publicPath));
// Load vendor files last.
// The vendor's uv.config.js won't conflict with our uv.config.js inside the publicPath directory.
app.use('/uv/', express.static(uvPath));
app.use('/epoxy/', express.static(epoxyPath));
app.use('/baremux/', express.static(baremuxPath));

// Configure Ultraviolet
const uv = new Ultraviolet(uvConfig);

// Initialize port variable
let port = parseInt(process.env.PORT || '');
if (isNaN(port)) port = 8080;

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

// Use Ultraviolet middleware
app.use('/service/', uv.middleware());

// Error for everything else
app.use((req, res) => {
  res.status(404);
  res.sendFile(join(publicPath, '404.html'));
});

const server = createServer();

server.on('request', (req, res) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  app(req, res);
});
server.on('upgrade', (req, socket, head) => {
  if (req.url.endsWith('/wisp/'))
    wisp.routeRequest(req, socket, head);
  else
    socket.end();
});

server.on('listening', () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log('Listening on:');
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${address.family === 'IPv6' ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function shutdown() {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
    console.log('HTTP server closed gracefully');
    // Here you can close database connections or other resources
    // db.close(() => {
    //   console.log('Database connection closed');
    //   process.exit(0);
    // });
    process.exit(0);
  });
}

server.listen({
  port,
});