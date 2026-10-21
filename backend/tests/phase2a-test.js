import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import http from 'http';
import app from '../app.js';

let mongoServer;
let server;
let port;

const request = (method, path, body = null, headers = {}) => {
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

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runTests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 2A AUTOMATED TEST SUITE');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAILED: ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // Start In-Memory MongoDB Server for Isolated Testing
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`[TEST SETUP] Connected to MongoMemoryServer at ${uri}`);

    // Start Express Server
    server = app.listen(0);
    port = server.address().port;
    console.log(`[TEST SETUP] Express server running on port ${port}\n`);

    // 1. Health Endpoint Test
    console.log('--- 1. Health API Check ---');
    const healthRes = await request('GET', '/api/health');
    assert(
      healthRes.status === 200 && healthRes.body.status === 'OK',
      'GET /api/health should return status OK',
      JSON.stringify(healthRes.body)
    );

    // 2. Auth Register Admin Test
    console.log('\n--- 2. Register Admin User ---');
    const regAdminRes = await request('POST', '/api/auth/register', {
      name: 'System Admin',
      email: 'admin@ehr.com',
      password: 'AdminPassword123!',
      role: 'admin'
    });
    assert(
      regAdminRes.status === 201 &&
        regAdminRes.body.success === true &&
        regAdminRes.body.data.user.role === 'admin' &&
        !regAdminRes.body.data.user.password &&
        Boolean(regAdminRes.body.data.token),
      'POST /api/auth/register (admin) returns HTTP 201, safe user & JWT token',
      JSON.stringify(regAdminRes.body)
    );
    const adminToken = regAdminRes.body.data ? regAdminRes.body.data.token : null;
    const adminId = regAdminRes.body.data ? regAdminRes.body.data.user._id : null;

    // 3. Auth Register Patient Test
    console.log('\n--- 3. Register Patient User ---');
    const regPatientRes = await request('POST', '/api/auth/register', {
      name: 'Jane Patient',
      email: 'patient@ehr.com',
      password: 'PatientPassword123!',
      role: 'patient'
    });
    assert(
      regPatientRes.status === 201 &&
        regPatientRes.body.success === true &&
        regPatientRes.body.data.user.role === 'patient' &&
        Boolean(regPatientRes.body.data.token),
      'POST /api/auth/register (patient) returns HTTP 201 and token',
      JSON.stringify(regPatientRes.body)
    );
    const patientToken = regPatientRes.body.data ? regPatientRes.body.data.token : null;
    const patientId = regPatientRes.body.data ? regPatientRes.body.data.user._id : null;

    // 4. Duplicate Email Register Test
    console.log('\n--- 4. Duplicate Email Conflict Test ---');
    const dupRes = await request('POST', '/api/auth/register', {
      name: 'Duplicate Admin',
      email: 'admin@ehr.com',
      password: 'Password123!',
      role: 'admin'
    });
    assert(
      dupRes.status === 409 && dupRes.body.success === false,
      'POST /api/auth/register with duplicate email returns HTTP 409 Conflict',
      JSON.stringify(dupRes.body)
    );

    // 5. Auth Login Test
    console.log('\n--- 5. Login Credentials Test ---');
    const loginRes = await request('POST', '/api/auth/login', {
      email: 'admin@ehr.com',
      password: 'AdminPassword123!'
    });
    assert(
      loginRes.status === 200 &&
        loginRes.body.success === true &&
        Boolean(loginRes.body.data.token),
      'POST /api/auth/login returns HTTP 200 & JWT token',
      JSON.stringify(loginRes.body)
    );

    // 6. Login Invalid Password Test
    console.log('\n--- 6. Login Invalid Password Test ---');
    const wrongLoginRes = await request('POST', '/api/auth/login', {
      email: 'admin@ehr.com',
      password: 'WrongPassword'
    });
    assert(
      wrongLoginRes.status === 401 && wrongLoginRes.body.success === false,
      'POST /api/auth/login with wrong password returns HTTP 401 Unauthorized',
      JSON.stringify(wrongLoginRes.body)
    );

    // 7. GET /api/auth/me Unauthenticated
    console.log('\n--- 7. GET /api/auth/me Unauthenticated Test ---');
    const noTokenRes = await request('GET', '/api/auth/me');
    assert(
      noTokenRes.status === 401 && noTokenRes.body.success === false,
      'GET /api/auth/me without token returns HTTP 401',
      JSON.stringify(noTokenRes.body)
    );

    // 8. GET /api/auth/me Authenticated
    console.log('\n--- 8. GET /api/auth/me Authenticated Test ---');
    const meRes = await request('GET', '/api/auth/me', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(
      meRes.status === 200 &&
        meRes.body.success === true &&
        meRes.body.data.user.email === 'admin@ehr.com',
      'GET /api/auth/me with valid Bearer token returns HTTP 200 & authenticated user info',
      JSON.stringify(meRes.body)
    );

    // 9. RBAC Test: GET /api/users with Patient Token (Unauthorized)
    console.log('\n--- 9. RBAC Authorization Check (Forbidden Role) ---');
    const rbacFailRes = await request('GET', '/api/users', null, {
      Authorization: `Bearer ${patientToken}`
    });
    assert(
      rbacFailRes.status === 403 && rbacFailRes.body.success === false,
      'GET /api/users with patient token returns HTTP 403 Forbidden',
      JSON.stringify(rbacFailRes.body)
    );

    // 10. RBAC Test: GET /api/users with Admin Token (Authorized)
    console.log('\n--- 10. RBAC Authorization Check (Authorized Role) ---');
    const rbacPassRes = await request('GET', '/api/users', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(
      rbacPassRes.status === 200 &&
        rbacPassRes.body.success === true &&
        Array.isArray(rbacPassRes.body.data.users) &&
        rbacPassRes.body.data.users.length === 2,
      'GET /api/users with admin token returns HTTP 200 & list of 2 users',
      JSON.stringify(rbacPassRes.body)
    );

    // 11. GET /api/users/:id Protected User Details
    console.log('\n--- 11. GET /api/users/:id Protected Test ---');
    const userDetailRes = await request('GET', `/api/users/${patientId}`, null, {
      Authorization: `Bearer ${patientToken}`
    });
    assert(
      userDetailRes.status === 200 &&
        userDetailRes.body.success === true &&
        userDetailRes.body.data.user.email === 'patient@ehr.com',
      'GET /api/users/:id returns HTTP 200 & safe user object',
      JSON.stringify(userDetailRes.body)
    );

    // 12. DELETE /api/users/:id with Patient Token (Forbidden)
    console.log('\n--- 12. DELETE /api/users/:id Patient Token Test ---');
    const delForbiddenRes = await request('DELETE', `/api/users/${patientId}`, null, {
      Authorization: `Bearer ${patientToken}`
    });
    assert(
      delForbiddenRes.status === 403 && delForbiddenRes.body.success === false,
      'DELETE /api/users/:id with patient token returns HTTP 403 Forbidden',
      JSON.stringify(delForbiddenRes.body)
    );

    // 13. DELETE /api/users/:id with Admin Token (Authorized)
    console.log('\n--- 13. DELETE /api/users/:id Admin Token Test ---');
    const delSuccessRes = await request('DELETE', `/api/users/${patientId}`, null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(
      delSuccessRes.status === 200 && delSuccessRes.body.success === true,
      'DELETE /api/users/:id with admin token returns HTTP 200',
      JSON.stringify(delSuccessRes.body)
    );

    console.log('\n==================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('==================================================\n');
  } catch (err) {
    console.error('Test Suite Exception:', err);
  } finally {
    if (server) server.close();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
