const Parent = require('../models/Parent');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

// @desc    Get linked students for current parent
// @route   GET /api/parents/students
// @access  Private/Parent
exports.getLinkedStudents = asyncHandler(async (req, res) => {
  const parent = await Parent.findOne({ user: req.user._id })
    .populate({
      path: 'children',
      populate: { path: 'user', select: 'name avatar' }
    });

  if (!parent) {
    res.status(HTTP_STATUS.NOT_FOUND);
    throw new Error('Parent profile not found');
  }

  sendResponse(res, HTTP_STATUS.OK, parent.children, 'Linked students fetched successfully');
});

// @desc    Get data for a specific linked student
// @route   GET /api/parents/students/:studentId/data
// @access  Private/Parent
exports.getStudentData = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Verify this student is linked to the parent
  const parent = await Parent.findOne({ user: req.user._id });
  if (!parent || !parent.children.includes(studentId)) {
    res.status(HTTP_STATUS.FORBIDDEN);
    throw new Error('Not authorized to view this student data');
  }

  const studentProfile = await Student.findById(studentId).populate('user', 'name');
  
  // Fetch various data
  const attendance = await Attendance.find({ student: studentProfile.user._id }).sort({ date: -1 });
  const grades = await Grade.find({ student: studentProfile.user._id }).populate('subject', 'name');
  const assignments = await Assignment.find({ 
    // This depends on how assignments are linked to students. 
    // Usually via Class.
  });

  sendResponse(res, HTTP_STATUS.OK, {
    student: studentProfile,
    attendance,
    grades,
    assignments
  }, 'Student data fetched successfully');
});
