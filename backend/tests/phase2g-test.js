import http from 'http';
import jwt from 'jsonwebtoken';
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Report from '../models/Report.js';
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

async function runPhase2gTests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 2G AUTOMATED VERIFICATION');
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
    // 1-2. Model Loading Checks
    assert(AuditLog.modelName === 'AuditLog', 'AuditLog Mongoose model loaded correctly');
    assert(User.modelName === 'User', 'User Mongoose model loaded correctly');

    // Start Express Test Server
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

        // 4. GET /api/audit-logs Unauthenticated
        const unauthGetLogsRes = await request(port, 'GET', '/api/audit-logs');
        assert(
          unauthGetLogsRes.status === 401 && unauthGetLogsRes.body.success === false,
          'GET /api/audit-logs without token returns HTTP 401 Unauthorized'
        );

        // 5. GET /api/audit-logs/:id Unauthenticated
        const unauthGetLogIdRes = await request(port, 'GET', '/api/audit-logs/660000000000000000000001');
        assert(
          unauthGetLogIdRes.status === 401 && unauthGetLogIdRes.body.success === false,
          'GET /api/audit-logs/:id without token returns HTTP 401 Unauthorized'
        );

        // 6. Non-admin User RBAC Check (HTTP 403 Forbidden)
        const secret = process.env.JWT_SECRET || 'supersecret_ehr_jwt_key_2026';
        const patientToken = jwt.sign(
          { id: '660000000000000000000002', role: 'patient', email: 'patient@test.com' },
          secret,
          { expiresIn: '1h' }
        );

        const patientAuditRes = await request(port, 'GET', '/api/audit-logs', null, {
          Authorization: `Bearer ${patientToken}`
        });
        assert(
          patientAuditRes.status === 403 && patientAuditRes.body.success === false,
          'Non-admin authenticated user receives HTTP 403 Forbidden on audit-logs'
        );

        // 7-12. Phase 2A-2F Intact Checks
        const unauthUsersRes = await request(port, 'GET', '/api/users');
        const unauthPatientsRes = await request(port, 'GET', '/api/patients');
        const unauthDoctorsRes = await request(port, 'GET', '/api/doctors');
        const unauthApptsRes = await request(port, 'GET', '/api/appointments');
        const unauthMedRecsRes = await request(port, 'GET', '/api/medical-records');
        const unauthPrescsRes = await request(port, 'GET', '/api/prescriptions');
        const unauthReportsRes = await request(port, 'GET', '/api/reports');

        assert(
          unauthUsersRes.status === 401 &&
            unauthPatientsRes.status === 401 &&
            unauthDoctorsRes.status === 401 &&
            unauthApptsRes.status === 401 &&
            unauthMedRecsRes.status === 401 &&
            unauthPrescsRes.status === 401 &&
            unauthReportsRes.status === 401,
          'Existing Phase 2A, 2B, 2C, 2D, 2E, and 2F APIs remain intact and protected'
        );

        console.log('\n==================================================');
        console.log(`PHASE 2G TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
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

runPhase2gTests();
