const Class = require('../models/Class');
const Subject = require('../models/Subject');
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

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
exports.getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({})
    .populate('user', 'name email isActive')
    .sort({ createdAt: -1 });
  sendResponse(res, HTTP_STATUS.OK, teachers, 'Teachers fetched successfully');
});

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
exports.getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find({})
    .populate('user', 'name email isActive')
    .populate('class', 'name section')
    .sort({ createdAt: -1 });
  sendResponse(res, HTTP_STATUS.OK, students, 'Students fetched successfully');
});


// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, ...roleData } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      throw new Error(`User already exists with email: ${email}`);
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
      throw new Error('Failed to create user record');
    }

    // Create role-specific profile
    try {
      if (role === ROLES.STUDENT) {
        let classId = null;
        if (roleData.class) {
          // Check if it's a valid ObjectId, if not try to find class by name
          if (roleData.class.match(/^[0-9a-fA-F]{24}$/)) {
            classId = roleData.class;
          } else {
            const foundClass = await Class.findOne({ name: new RegExp('^' + roleData.class + '$', 'i') });
            if (foundClass) classId = foundClass._id;
          }
        }

        await Student.create({
          user: user._id,
          studentId: roleData.studentId || `STU${Date.now()}`,
          rollNumber: roleData.rollNumber,
          class: classId,
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
    } catch (profileError) {
      console.error(`Profile creation failed for role ${role}:`, profileError);
      // Clean up the user if profile fails
      await User.findByIdAndDelete(user._id);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      throw new Error(`Profile creation failed: ${profileError.message}`);
    }

    sendResponse(res, HTTP_STATUS.CREATED, user, 'User and profile created successfully');
  } catch (error) {
    console.error('User creation process failed:', error);
    if (!res.statusCode || res.statusCode === 200) {
      res.status(HTTP_STATUS.BAD_REQUEST);
    }
    throw error;
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    console.error(`User update failed: User ${req.params.id} not found`);
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

// @desc    Create a new class
// @route   POST /api/admin/classes
// @access  Private/Admin
exports.createClass = asyncHandler(async (req, res) => {
  const { name, section, classTeacherId } = req.body;
  const newClass = await Class.create({
    name,
    section,
    classTeacher: classTeacherId
  });
  sendResponse(res, HTTP_STATUS.CREATED, newClass, 'Class created successfully');
});

// @desc    Update a class
// @route   PUT /api/admin/classes/:id
// @access  Private/Admin
exports.updateClass = asyncHandler(async (req, res) => {
  const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
  sendResponse(res, HTTP_STATUS.OK, updatedClass, 'Class updated successfully');
});

// @desc    Delete a class
// @route   DELETE /api/admin/classes/:id
// @access  Private/Admin
exports.deleteClass = asyncHandler(async (req, res) => {
  await Class.findByIdAndDelete(req.params.id);
  sendResponse(res, HTTP_STATUS.OK, {}, 'Class deleted successfully');
});

