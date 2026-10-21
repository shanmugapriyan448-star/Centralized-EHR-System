import http from 'http';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import app from '../app.js';

const request = (port, method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function runPhase2bTests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 2B AUTOMATED VERIFICATION');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`✅ PASSED: ${name}`);
      passed++;
    } else {
      console.log(`❌ FAILED: ${name} - ${details}`);
      failed++;
    }
  }

  try {
    // 1. Model Loading Checks
    assert(Patient.modelName === 'Patient', 'Patient Mongoose model loaded correctly');
    assert(Doctor.modelName === 'Doctor', 'Doctor Mongoose model loaded correctly');

    // 2. Start Express Test Server
    const server = app.listen(0, async () => {
      const port = server.address().port;

      try {
        // 3. Health Route Intact
        const healthRes = await request(port, 'GET', '/api/health');
        assert(
          healthRes.status === 200 && (healthRes.body.status === 'OK' || healthRes.body.success === true),
          'GET /api/health returns HTTP 200 OK',
          JSON.stringify(healthRes.body)
        );

        // 4. Unauthenticated Patient Route Protection
        const unauthPatientRes = await request(port, 'GET', '/api/patients');
        assert(
          unauthPatientRes.status === 401 && unauthPatientRes.body.success === false,
          'GET /api/patients without token returns HTTP 401 Unauthorized'
        );

        // 5. Unauthenticated Doctor Route Protection
        const unauthDoctorRes = await request(port, 'GET', '/api/doctors');
        assert(
          unauthDoctorRes.status === 401 && unauthDoctorRes.body.success === false,
          'GET /api/doctors without token returns HTTP 401 Unauthorized'
        );

        // 6. Unauthenticated POST /api/patients Protection
        const unauthPostPatientRes = await request(port, 'POST', '/api/patients', { name: 'Test' });
        assert(
          unauthPostPatientRes.status === 401 && unauthPostPatientRes.body.success === false,
          'POST /api/patients without token returns HTTP 401 Unauthorized'
        );

        // 7. Unauthenticated POST /api/doctors Protection
        const unauthPostDoctorRes = await request(port, 'POST', '/api/doctors', { name: 'Test' });
        assert(
          unauthPostDoctorRes.status === 401 && unauthPostDoctorRes.body.success === false,
          'POST /api/doctors without token returns HTTP 401 Unauthorized'
        );

        console.log('\n==================================================');
        console.log(`PHASE 2B TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
        console.log('==================================================\n');
      } catch (err) {
        console.log('Test Execution Error:', err.message);
      } finally {
        server.close(() => {
          process.exit(failed > 0 ? 1 : 0);
        });
      }
    });
  } catch (err) {
    console.log('Top-level Error:', err.message);
    process.exit(1);
  }
}

runPhase2bTests();
