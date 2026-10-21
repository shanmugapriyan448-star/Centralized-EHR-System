import http from 'http';
import app from '../app.js';

const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(`Checking GET /api/health on port ${port}...`);

  http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      console.log('Response Body:', data);
      server.close();
      process.exit(res.statusCode === 200 ? 0 : 1);
    });
  }).on('error', (err) => {
    console.error('Health Check Error:', err);
    server.close();
    process.exit(1);
  });
});
