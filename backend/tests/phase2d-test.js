import http from 'http';
import MedicalRecord from '../models/MedicalRecord.js';
import Appointment from '../models/Appointment.js';
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

async function runPhase2dTests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 2D AUTOMATED VERIFICATION');
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
    assert(MedicalRecord.modelName === 'MedicalRecord', 'MedicalRecord Mongoose model loaded correctly');
    assert(Appointment.modelName === 'Appointment', 'Appointment Mongoose model loaded correctly');
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

        // 4. GET /api/medical-records Unauthenticated
        const unauthGetRecordsRes = await request(port, 'GET', '/api/medical-records');
        assert(
          unauthGetRecordsRes.status === 401 && unauthGetRecordsRes.body.success === false,
          'GET /api/medical-records without token returns HTTP 401 Unauthorized'
        );

        // 5. POST /api/medical-records Unauthenticated
        const unauthPostRecordRes = await request(port, 'POST', '/api/medical-records', { diagnosis: 'Fever' });
        assert(
          unauthPostRecordRes.status === 401 && unauthPostRecordRes.body.success === false,
          'POST /api/medical-records without token returns HTTP 401 Unauthorized'
        );

        // 6. GET /api/medical-records/:id Unauthenticated
        const unauthGetIdRes = await request(port, 'GET', '/api/medical-records/660000000000000000000001');
        assert(
          unauthGetIdRes.status === 401 && unauthGetIdRes.body.success === false,
          'GET /api/medical-records/:id without token returns HTTP 401 Unauthorized'
        );

        // 7. PUT /api/medical-records/:id Unauthenticated
        const unauthPutIdRes = await request(port, 'PUT', '/api/medical-records/660000000000000000000001', { diagnosis: 'Updated' });
        assert(
          unauthPutIdRes.status === 401 && unauthPutIdRes.body.success === false,
          'PUT /api/medical-records/:id without token returns HTTP 401 Unauthorized'
        );

        // 8. Phase 2A, 2B, 2C Intact Checks
        const unauthPatientsRes = await request(port, 'GET', '/api/patients');
        const unauthDoctorsRes = await request(port, 'GET', '/api/doctors');
        const unauthApptsRes = await request(port, 'GET', '/api/appointments');
        assert(
          unauthPatientsRes.status === 401 && unauthDoctorsRes.status === 401 && unauthApptsRes.status === 401,
          'Existing Phase 2A, 2B, and 2C APIs remain intact and protected'
        );

        console.log('\n==================================================');
        console.log(`PHASE 2D TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
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

runPhase2dTests();
