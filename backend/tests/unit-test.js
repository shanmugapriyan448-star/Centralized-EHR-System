import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { getUsers, getUserById, deleteUser } from '../controllers/user.controller.js';

async function runUnitTests() {
  console.log('\n==================================================');
  console.log('STARTING PHASE 2A UNIT & MIDDLEWARE TESTS');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`✅ PASSED: ${name}`);
      passed++;
    } else {
      console.error(`❌ FAILED: ${name} - ${details}`);
      failed++;
    }
  }

  // 1. Password Hashing Verification
  console.log('--- 1. Password Hashing Test ---');
  const rawPassword = 'SecretPassword123!';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);
  const match = await bcrypt.compare(rawPassword, hashedPassword);
  assert(match === true && hashedPassword !== rawPassword, 'bcryptjs hashes and verifies passwords correctly');

  // 2. JWT Generation & Verification
  console.log('\n--- 2. JWT Signature Test ---');
  const secret = 'supersecret_ehr_jwt_key_2026';
  const token = jwt.sign({ id: 'usr-123', role: 'admin', email: 'admin@ehr.com' }, secret, { expiresIn: '30d' });
  const decoded = jwt.verify(token, secret);
  assert(decoded.id === 'usr-123' && decoded.role === 'admin', 'jsonwebtoken creates and verifies valid payloads');

  // 3. Auth Middleware (Missing Token)
  console.log('\n--- 3. Auth Middleware Missing Token Test ---');
  const reqNoToken = { headers: {} };
  let statusSent = null;
  let jsonSent = null;
  const resNoToken = {
    status: (code) => { statusSent = code; return resNoToken; },
    json: (obj) => { jsonSent = obj; return resNoToken; }
  };
  await protect(reqNoToken, resNoToken, () => {});
  assert(statusSent === 401 && jsonSent.success === false, 'auth.middleware returns 401 when token is missing');

  // 4. Auth Middleware (Valid Bearer Token)
  console.log('\n--- 4. Auth Middleware Valid Token Test ---');
  const reqValidToken = { headers: { authorization: `Bearer ${token}` } };
  let nextCalled = false;
  await protect(reqValidToken, resNoToken, () => { nextCalled = true; });
  assert(nextCalled === true && reqValidToken.user.role === 'admin', 'auth.middleware attaches req.user and passes next()');

  // 5. Role Middleware (Allowed Role)
  console.log('\n--- 5. Role Middleware Allowed Role Test ---');
  const reqAdmin = { user: { role: 'admin' } };
  let roleNextCalled = false;
  const adminCheck = requireRole('admin');
  adminCheck(reqAdmin, resNoToken, () => { roleNextCalled = true; });
  assert(roleNextCalled === true, 'role.middleware permits user with matching role');

  // 6. Role Middleware (Denied Role)
  console.log('\n--- 6. Role Middleware Denied Role Test ---');
  const reqPatient = { user: { role: 'patient' } };
  let roleDeniedStatus = null;
  let roleDeniedJson = null;
  const resDenied = {
    status: (code) => { roleDeniedStatus = code; return resDenied; },
    json: (obj) => { roleDeniedJson = obj; return resDenied; }
  };
  adminCheck(reqPatient, resDenied, () => {});
  assert(roleDeniedStatus === 403 && roleDeniedJson.success === false, 'role.middleware returns 403 Forbidden for unauthorized role');

  // 7. Validation in Auth Controller
  console.log('\n--- 7. Auth Controller Validation Test ---');
  let regStatus = null;
  let regJson = null;
  const reqInvalidReg = { body: { name: '', email: '' } };
  const resReg = {
    status: (code) => { regStatus = code; return resReg; },
    json: (obj) => { regJson = obj; return resReg; }
  };
  await register(reqInvalidReg, resReg, () => {});
  assert(regStatus === 400 && regJson.success === false, 'register controller returns 400 Bad Request when required fields missing');

  console.log('\n==================================================');
  console.log(`UNIT TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');
  process.exit(failed > 0 ? 1 : 0);
}

runUnitTests();
