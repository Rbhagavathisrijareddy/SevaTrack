import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/UserModel.js';
import { WorkerProfile } from '../models/WorkerProfileModel.js';
import { Session } from '../models/SessionModel.js';


const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Unified Login (for both worker and admin)
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Map 'ngo' role to 'admin' for database lookup
    const dbRole = role === 'ngo' ? 'admin' : role;

    // Find user in database with matching role
    const normalizedEmail = email.toLowerCase().trim();
    console.log('Login attempt:', normalizedEmail, 'role:', role, 'dbRole:', dbRole);
    
    const user = await User.findOne({ email: normalizedEmail, role: dbRole });

    if (!user) {
      console.log('User not found:', normalizedEmail, 'role:', dbRole);
      return res.status(401).json({
        success: false,
        message: 'User not found. Please create an account first.',
        code: 'USER_NOT_FOUND',
      });
    }

    // Verify password
    console.log('Password check - stored:', user.password, 'provided:', password);
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user);

    // Store session
    const session = new Session({
      userId: user._id,
      token,
      email: user.email,
      role: user.role,
    });
    await session.save();

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          workerId: user.workerId,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    });
  }
};

// Field Worker Login (verify against database)
export const workerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Find worker user in database
    const normalizedEmail = email.toLowerCase().trim();
    console.log('Login attempt:', normalizedEmail);
    
    const worker = await User.findOne({ email: normalizedEmail, role: 'worker' });

    if (!worker) {
      console.log('User not found:', normalizedEmail);
      return res.status(401).json({
        success: false,
        message: 'User not found. Please create an account first using POST /api/users',
        code: 'USER_NOT_FOUND',
      });
    }

    // Verify password
    console.log('Password check - stored:', worker.password, 'provided:', password);
    if (worker.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Update last login
    worker.lastLogin = new Date();
    await worker.save();

    // Generate token
    const token = generateToken(worker);

    // Store session
    const session = new Session({
      userId: worker._id,
      token,
      email: worker.email,
      role: 'worker',
    });
    await session.save();

    return res.status(200).json({
      success: true,
      message: 'Field worker login successful',
      data: {
        token,
        user: {
          id: worker._id,
          email: worker.email,
          name: worker.name,
          workerId: worker.workerId,
          role: worker.role,
        },
      },
    });
  } catch (error) {
    console.error('Worker login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// Google OAuth Callback for Admin (verify admin exists in DB)
export const googleCallback = async (req, res) => {
  try {
    const { googleId, email, name, profilePicture, idToken } = req.body;

    // Validate input
    if (!googleId || !email || !idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID, email, and ID token are required',
      });
    }

    // Check if email belongs to sevatrack.org domain
    if (!email.toLowerCase().endsWith('@sevatrack.org')) {
      return res.status(403).json({
        success: false,
        message: 'Only sevatrack.org email addresses can access the admin panel',
        code: 'INVALID_DOMAIN',
      });
    }

    // Find admin user in database - must exist first
    let admin = await User.findOne({ email: email.toLowerCase(), role: 'admin' });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found. Please create an admin account first using POST /api/users',
        code: 'ADMIN_NOT_FOUND',
      });
    }

    // Update admin with latest Google info
    admin.googleId = googleId;
    admin.name = name || admin.name;
    admin.profilePicture = profilePicture;
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin);

    // Store session
    const session = new Session({
      userId: admin._id,
      token,
      email: admin.email,
      role: 'admin',
    });
    await session.save();

    return res.status(200).json({
      success: true,
      message: 'Admin login successful via Google',
      data: {
        token,
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          profilePicture: admin.profilePicture,
        },
      },
    });
  } catch (error) {
    console.error('Google callback error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      await Session.findOneAndDelete({ token });
    }

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};

// Get current user info
export const getCurrentUser = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
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

// Get all registered workers (admin only)
export const getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' })
      .select('email name workerId createdAt lastLogin status')
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        workers: workers.map((w) => ({
          id: w._id,
          email: w.email,
          name: w.name,
          workerId: w.workerId,
          status: w.status,
          createdAt: w.createdAt,
          lastLogin: w.lastLogin,
        })),
        count: workers.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching workers',
      error: error.message,
    });
  }
};

// Get worker profile details (admin or worker owner only)
export const getWorkerProfile = async (req, res) => {
  try {
    const { workerId } = req.params;

    const workerProfile = await WorkerProfile.findOne({ userId: workerId }).lean();

    if (!workerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Worker profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        profile: workerProfile,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching worker profile',
      error: error.message,
    });
  }
};

// Update worker status (admin only)
export const updateWorkerStatus = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, inactive, or suspended',
      });
    }

    const worker = await User.findByIdAndUpdate(
      workerId,
      { status },
      { new: true, runValidators: true }
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found',
      });
    }

    // Also update worker profile status
    await WorkerProfile.findOneAndUpdate({ userId: workerId }, { status });

    return res.status(200).json({
      success: true,
      message: 'Worker status updated',
      data: {
        worker: {
          id: worker._id,
          email: worker.email,
          status: worker.status,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating worker status',
      error: error.message,
    });
  }
};
