import http from 'http';
import Report from '../models/Report.js';
import Prescription from '../models/Prescription.js';
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

async function runPhase2fTests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 2F AUTOMATED VERIFICATION');
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
    // 1-6. Model Loading Checks
    assert(Report.modelName === 'Report', 'Report Mongoose model loaded correctly');
    assert(Patient.modelName === 'Patient', 'Patient Mongoose model loaded correctly');
    assert(Doctor.modelName === 'Doctor', 'Doctor Mongoose model loaded correctly');
    assert(MedicalRecord.modelName === 'MedicalRecord', 'MedicalRecord Mongoose model loaded correctly');
    assert(Appointment.modelName === 'Appointment', 'Appointment Mongoose model loaded correctly');
    assert(Prescription.modelName === 'Prescription', 'Prescription Mongoose model loaded correctly');

    // Start Express Test Server
    const server = app.listen(0, async () => {
      const port = server.address().port;

      try {
        // 7. Health Route Intact
        const healthRes = await request(port, 'GET', '/api/health');
        assert(
          healthRes.status === 200 && (healthRes.body.status === 'OK' || healthRes.body.success === true),
          'GET /api/health returns HTTP 200 OK',
          JSON.stringify(healthRes.body)
        );

        // 8. GET /api/reports Unauthenticated
        const unauthGetRepRes = await request(port, 'GET', '/api/reports');
        assert(
          unauthGetRepRes.status === 401 && unauthGetRepRes.body.success === false,
          'GET /api/reports without token returns HTTP 401 Unauthorized'
        );

        // 9. POST /api/reports Unauthenticated
        const unauthPostRepRes = await request(port, 'POST', '/api/reports', { title: 'Blood Test' });
        assert(
          unauthPostRepRes.status === 401 && unauthPostRepRes.body.success === false,
          'POST /api/reports without token returns HTTP 401 Unauthorized'
        );

        // 10. GET /api/reports/:id Unauthenticated
        const unauthGetIdRes = await request(port, 'GET', '/api/reports/660000000000000000000001');
        assert(
          unauthGetIdRes.status === 401 && unauthGetIdRes.body.success === false,
          'GET /api/reports/:id without token returns HTTP 401 Unauthorized'
        );

        // 11. PUT /api/reports/:id Unauthenticated
        const unauthPutIdRes = await request(port, 'PUT', '/api/reports/660000000000000000000001', { status: 'available' });
        assert(
          unauthPutIdRes.status === 401 && unauthPutIdRes.body.success === false,
          'PUT /api/reports/:id without token returns HTTP 401 Unauthorized'
        );

        // 12-16. Phase 2A-2E Intact Checks
        const unauthUsersRes = await request(port, 'GET', '/api/users');
        const unauthPatientsRes = await request(port, 'GET', '/api/patients');
        const unauthDoctorsRes = await request(port, 'GET', '/api/doctors');
        const unauthApptsRes = await request(port, 'GET', '/api/appointments');
        const unauthMedRecsRes = await request(port, 'GET', '/api/medical-records');
        const unauthPrescsRes = await request(port, 'GET', '/api/prescriptions');

        assert(
          unauthUsersRes.status === 401 &&
            unauthPatientsRes.status === 401 &&
            unauthDoctorsRes.status === 401 &&
            unauthApptsRes.status === 401 &&
            unauthMedRecsRes.status === 401 &&
            unauthPrescsRes.status === 401,
          'Existing Phase 2A, 2B, 2C, 2D, and 2E APIs remain intact and protected'
        );

        console.log('\n==================================================');
        console.log(`PHASE 2F TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
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

runPhase2fTests();
