const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const PORT = 3000;
const DATA_JSON_PATH = path.join(__dirname, 'data', 'peserta_data.json');
const DATA_JS_PATH = path.join(__dirname, 'data', 'peserta_data.js');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const [reqUrl] = req.url.split('?');

  // API Sync: GET Data
  if (reqUrl === '/api/data' && req.method === 'GET') {
    if (fs.existsSync(DATA_JSON_PATH)) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      fs.createReadStream(DATA_JSON_PATH).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Data belum dibuat' }));
    }
    return;
  }

  // API Sync: POST Save Data
  if (reqUrl === '/api/data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        if (Array.isArray(parsed)) {
          // Simpan ke data/peserta_data.json
          fs.writeFileSync(DATA_JSON_PATH, JSON.stringify(parsed, null, 2), 'utf8');
          // Update juga peserta_data.js agar mode offline selalu sinkron
          const jsContent = `window.INITIAL_DATA = ${JSON.stringify(parsed, null, 2)};\n`;
          fs.writeFileSync(DATA_JS_PATH, jsContent, 'utf8');

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, count: parsed.length }));
          return;
        }
      } catch (e) {
        console.error('Gagal menyimpan data:', e.message);
      }
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
    });
    return;
  }

  // API Info IP
  if (reqUrl === '/api/info' && req.method === 'GET') {
    const ips = [];
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          ips.push(`http://${iface.address}:${PORT}`);
        }
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ port: PORT, localIps: ips }));
    return;
  }

  // Static File Serving
  let filePath = reqUrl === '/' ? '/index.html' : reqUrl;
  const safePath = path.normalize(path.join(__dirname, filePath));
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Akses Ditolak');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end('File Tidak Ditemukan');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(safePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('========================================================');
  console.log('  CHECKLIST PO JERSEY TDGB 2026 — SERVER AKTIF');
  console.log('========================================================');
  console.log(`\nBuka di Laptop/Komputer ini:`);
  console.log(`  -> http://localhost:${PORT}`);
  
  console.log(`\nBuka di HP / Smartphone (Harus terhubung ke Wi-Fi yang sama):`);
  const interfaces = os.networkInterfaces();
  let firstLanIp = '';
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`  -> http://${iface.address}:${PORT}`);
        if (!firstLanIp) firstLanIp = `http://${iface.address}:${PORT}`;
      }
    }
  }
  console.log('\nSetiap checklist di HP akan otomatis tersimpan ke file di laptop ini!');
  console.log('Tekan Ctrl+C untuk menghentikan server.\n');

  // Otomatis buka browser di laptop
  exec(`start http://localhost:${PORT}`);
});
