import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createAuditLog } from '../services/auditLog.service.js';

// Generate JWT token containing userId, role, and email
const generateToken = (id, role, email) => {
  const secret = process.env.JWT_SECRET || 'supersecret_ehr_jwt_key_2026';
  const expiresIn = process.env.JWT_EXPIRE || '30d';
  return jwt.sign({ id, role, email }, secret, { expiresIn });
};

/**
 * Register a new user
 * Route: POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const assignedRole = role || 'patient';
    const allowedRoles = ['admin', 'doctor', 'patient'];
    if (!allowedRoles.includes(assignedRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Allowed roles: admin, doctor, patient.'
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole
    });

    const token = generateToken(user._id, user.role, user.email);

    // Audit log registration action
    createAuditLog({
      user: user._id,
      userRole: user.role,
      action: 'REGISTER',
      resource: 'User',
      resourceId: user._id.toString(),
      description: `New user registered with role ${user.role}`,
      ipAddress: req.ip || ''
    });

    const safeUser = user.toSafeObject();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate user & get token
 * Route: POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    // Find user & include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const token = generateToken(user._id, user.role, user.email);

    // Audit log login action
    createAuditLog({
      user: user._id,
      userRole: user.role,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user._id.toString(),
      description: `User logged in successfully`,
      ipAddress: req.ip || ''
    });

    const safeUser = user.toSafeObject();

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged in user
 * Route: GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      message: 'Authenticated user fetched successfully.',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};
