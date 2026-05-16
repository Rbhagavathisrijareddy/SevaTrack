import { User } from '../models/UserModel.js';
import { WorkerProfile } from '../models/WorkerProfileModel.js';

export const createUser = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    // Validate input
    if (!email || !name || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, name, password, and role are required',
      });
    }

    // Validate role
    if (!['admin', 'worker'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either admin or worker',
      });
    }

    // Check if admin email domain is correct
    if (role === 'admin' && !email.toLowerCase().endsWith('@sevatrack.org')) {
      return res.status(403).json({
        success: false,
        message: 'Admin users must use @sevatrack.org email domain',
        code: 'INVALID_ADMIN_DOMAIN',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        code: 'USER_EXISTS',
      });
    }

    // Create workerId for workers
    const workerId = role === 'worker' ? `WRK-${Date.now()}` : null;

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      name,
      password, // In production, hash this with bcryptjs
      role,
      workerId,
      isVerified: true,
      status: 'active',
    });

    await newUser.save();

    // If worker, create worker profile
    if (role === 'worker') {
      const workerProfile = new WorkerProfile({
        userId: newUser._id,
        email: newUser.email,
        name: newUser.name,
        status: 'active',
      });
      await workerProfile.save();
    }

    return res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} user created successfully`,
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          workerId: newUser.workerId,
        },
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        users,
        count: users.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password').lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, status } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (status) updateData.status = status;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Also delete worker profile if exists
    if (user.role === 'worker') {
      await WorkerProfile.findOneAndDelete({ userId });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};
