import http from 'http';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
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

async function runPhase2cTests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 2C AUTOMATED VERIFICATION');
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
    assert(Appointment.modelName === 'Appointment', 'Appointment Mongoose model loaded correctly');
    assert(Patient.modelName === 'Patient', 'Patient Mongoose model loaded correctly');
    assert(Doctor.modelName === 'Doctor', 'Doctor Mongoose model loaded correctly');
    assert(User.modelName === 'User', 'User Mongoose model loaded correctly');

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

        // 4. GET /api/appointments Unauthenticated
        const unauthGetApptRes = await request(port, 'GET', '/api/appointments');
        assert(
          unauthGetApptRes.status === 401 && unauthGetApptRes.body.success === false,
          'GET /api/appointments without token returns HTTP 401 Unauthorized'
        );

        // 5. POST /api/appointments Unauthenticated
        const unauthPostApptRes = await request(port, 'POST', '/api/appointments', { reason: 'Checkup' });
        assert(
          unauthPostApptRes.status === 401 && unauthPostApptRes.body.success === false,
          'POST /api/appointments without token returns HTTP 401 Unauthorized'
        );

        // 6. GET /api/appointments/:id Unauthenticated
        const unauthGetIdRes = await request(port, 'GET', '/api/appointments/660000000000000000000001');
        assert(
          unauthGetIdRes.status === 401 && unauthGetIdRes.body.success === false,
          'GET /api/appointments/:id without token returns HTTP 401 Unauthorized'
        );

        // 7. PUT /api/appointments/:id Unauthenticated
        const unauthPutIdRes = await request(port, 'PUT', '/api/appointments/660000000000000000000001', { status: 'confirmed' });
        assert(
          unauthPutIdRes.status === 401 && unauthPutIdRes.body.success === false,
          'PUT /api/appointments/:id without token returns HTTP 401 Unauthorized'
        );

        // 8. DELETE /api/appointments/:id Unauthenticated
        const unauthDelIdRes = await request(port, 'DELETE', '/api/appointments/660000000000000000000001');
        assert(
          unauthDelIdRes.status === 401 && unauthDelIdRes.body.success === false,
          'DELETE /api/appointments/:id without token returns HTTP 401 Unauthorized'
        );

        // 9. Phase 2A/2B Intact Checks
        const unauthPatientsRes = await request(port, 'GET', '/api/patients');
        const unauthDoctorsRes = await request(port, 'GET', '/api/doctors');
        assert(
          unauthPatientsRes.status === 401 && unauthDoctorsRes.status === 401,
          'Existing Phase 2A and 2B APIs remain intact and protected'
        );

        console.log('\n==================================================');
        console.log(`PHASE 2C TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
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

runPhase2cTests();
