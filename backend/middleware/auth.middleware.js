import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * Verifies Bearer JWT in Authorization header and attaches req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Missing token.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'supersecret_ehr_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    // Try fetching fresh user from DB if DB connection is active
    if (User.db && User.db.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists.'
        });
      }
      req.user = user;
    } else {
      // Attached decoded token payload if DB isn't querying
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        role: decoded.role,
        email: decoded.email
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid or expired token.'
    });
  }
};
