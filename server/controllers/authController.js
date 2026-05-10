const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

/**
 * Helper to generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    const token = generateToken(user._id);
    
    // Don't send back password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    sendResponse(res, HTTP_STATUS.CREATED, { token, user: userResponse }, 'User registered successfully');
  } else {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Please provide an email and password');
  }

  // Check for user (include password for comparison)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    res.status(HTTP_STATUS.UNAUTHORIZED);
    throw new Error('Account is inactive');
  }

  const token = generateToken(user._id);

  // User object without password
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  sendResponse(res, HTTP_STATUS.OK, { token, user: userResponse }, 'User logged in successfully');
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  // req.user is attached by protect middleware
  sendResponse(res, HTTP_STATUS.OK, req.user);
});
