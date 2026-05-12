const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { HTTP_STATUS, ROLES } = require('../constants');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  sendResponse(res, HTTP_STATUS.OK, users, 'Users fetched successfully');
});

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, ...roleData } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('User already exists with this email');
  }

  // Create base user
  const user = await User.create({
    name,
    email,
    password,
    role: role || ROLES.STUDENT
  });

  if (!user) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('Invalid user data');
  }

  // Create role-specific profile
  try {
    if (role === ROLES.STUDENT) {
      await Student.create({
        user: user._id,
        studentId: roleData.studentId || `STU${Date.now()}`,
        rollNumber: roleData.rollNumber,
        class: roleData.class,
        address: roleData.address
      });
    } else if (role === ROLES.TEACHER || role === ROLES.STAFF) {
      await Teacher.create({
        user: user._id,
        employeeId: roleData.employeeId || `EMP${Date.now()}`,
        department: roleData.department,
        qualification: roleData.qualification
      });
    } else if (role === ROLES.PARENT) {
      await Parent.create({
        user: user._id,
        occupation: roleData.occupation,
        emergencyContact: roleData.emergencyContact
      });
    }
  } catch (error) {
    // If profile creation fails, delete the user to maintain consistency
    await User.findByIdAndDelete(user._id);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    throw new Error(`Failed to create profile: ${error.message}`);
  }

  sendResponse(res, HTTP_STATUS.CREATED, user, 'User and profile created successfully');
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }
  user.role = req.body.role || user.role;
  user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

  const updatedUser = await user.save();

  // Update role-specific profile if needed (simplified for now)
  // In a real app, you'd handle specific field updates for profiles here too

  sendResponse(res, HTTP_STATUS.OK, updatedUser, 'User updated successfully');
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('User not found');
  }

  // Delete profile first
  if (user.role === ROLES.STUDENT) {
    await Student.findOneAndDelete({ user: user._id });
  } else if (user.role === ROLES.TEACHER || user.role === ROLES.STAFF) {
    await Teacher.findOneAndDelete({ user: user._id });
  } else if (user.role === ROLES.PARENT) {
    await Parent.findOneAndDelete({ user: user._id });
  }

  await User.findByIdAndDelete(req.params.id);

  sendResponse(res, HTTP_STATUS.OK, {}, 'User and associated profile deleted successfully');
});
