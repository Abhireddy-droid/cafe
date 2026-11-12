// Mamtha Creations - Local Wi-Fi Static Server for PC & Mobile
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const DIR = __dirname;
const PREFERRED_PORTS = [8080, 8081, 5000, 3000, 8000, 8888];

const MIME = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

function createServerInstance() {
  return http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    
    const filePath = path.join(DIR, reqPath);
    
    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        const indexPath = path.join(DIR, 'index.html');
        fs.readFile(indexPath, (err2, data) => {
          if (err2) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(data);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME[ext] || 'application/octet-stream';
      
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

function startListening(portIndex = 0) {
  if (portIndex >= PREFERRED_PORTS.length) {
    console.error('Could not find an available port to start server.');
    return;
  }
  
  const port = PREFERRED_PORTS[portIndex];
  const app = createServerInstance();
  
  app.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      // Try next port in list
      startListening(portIndex + 1);
    } else {
      console.error('Server error:', err);
    }
  });
  
  app.listen(port, '0.0.0.0', () => {
    const ip = getLocalIp();
    const localUrl = `http://localhost:${port}/index.html`;
    const phoneUrl = `http://${ip}:${port}/index.html`;
    
    console.log('\n============================================================');
    console.log('  ✨ MAMTHA CREATIONS — BILLING SYSTEM IS ONLINE!');
    console.log('============================================================');
    console.log(`  💻 PC Browser:     ${localUrl}`);
    console.log(`  📱 Mobile Phone:   ${phoneUrl}`);
    console.log('============================================================');
    console.log('  HOW TO USE ON YOUR PHONE:');
    console.log('  1. Connect your phone to the SAME Wi-Fi network.');
    console.log(`  2. Open Chrome (Android) or Safari (iPhone) and go to:`);
    console.log(`     ${phoneUrl}`);
    console.log('  3. Tap "Add to Home Screen" to install it as an app!');
    console.log('============================================================\n');
    console.log('Keep this window open while using the app. Press Ctrl+C to stop.\n');
    
    // Automatically launch PC browser
    const startCmd = process.platform === 'win32' ? 'start' : (process.platform === 'darwin' ? 'open' : 'xdg-open');
    exec(`${startCmd} "" "${localUrl}"`, () => {});
  });
}

startListening(0);
