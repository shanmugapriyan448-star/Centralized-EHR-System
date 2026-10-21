import User from '../models/User.js';

/**
 * Get all users (Admin Only)
 * Route: GET /api/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully.',
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single user by ID
 * Route: GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User details fetched successfully.',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user by ID (Admin Only)
 * Route: DELETE /api/users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
