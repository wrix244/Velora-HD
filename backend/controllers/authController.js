import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import https from 'https';
import mongoose from 'mongoose';
import Favorite from '../models/Favorite.js';
import Purchase from '../models/Purchase.js';
import Download from '../models/Download.js';

const verifyGoogleToken = (idToken) => {
  return new Promise((resolve, reject) => {
    https.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error_description || 'Invalid token'));
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'velorahd_secret_key_123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture || '',
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user and select password (which is excluded by default in schema)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (user.isBanned) {
        return res.status(403).json({ success: false, message: 'Your account has been banned by the administrator' });
      }

      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture || '',
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture || '',
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.profilePicture !== undefined) {
        user.profilePicture = req.body.profilePicture;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          profilePicture: updatedUser.profilePicture || '',
          token: generateToken(updatedUser._id),
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user profile (Delete account)
// @route   DELETE /api/auth/profile
// @access  Private
export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Protect main admin from being deleted
    if (user.role === 'admin' && user.email === 'velorahdwallart@gmail.com') {
      return res.status(400).json({ success: false, message: 'Main Admin account cannot be deleted.' });
    }

    // Cascade delete related records
    await Promise.all([
      Favorite.deleteMany({ userId }),
      Purchase.deleteMany({ userId }),
      Download.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.json({ success: true, message: 'Your account has been deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login / Register with Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Please provide a Google ID token' });
    }

    let payload;
    try {
      payload = await verifyGoogleToken(idToken);
    } catch (error) {
      return res.status(400).json({ success: false, message: `Google authentication failed: ${error.message}` });
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: 'Invalid token payload' });
    }

    // Security check: if GOOGLE_CLIENT_ID is configured, verify the audience (aud)
    const expectedClientId = process.env.GOOGLE_CLIENT_ID;
    if (expectedClientId && payload.aud !== expectedClientId) {
      return res.status(400).json({ success: false, message: 'Token audience mismatch. Unrecognized client ID.' });
    }

    const { sub: googleId, email, name } = payload;

    // 1. Try to find user by googleId
    let user = await User.findOne({ googleId });

    if (!user) {
      // 2. Try to find user by email (linking account if they previously signed up manually)
      user = await User.findOne({ email });

      if (user) {
        // Link googleId to existing user
        user.googleId = googleId;
        await user.save();
      } else {
        // 3. Create new user
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          googleId,
          profilePicture: payload.picture || '',
        });
      }
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Your account has been banned by the administrator' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || '',
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
