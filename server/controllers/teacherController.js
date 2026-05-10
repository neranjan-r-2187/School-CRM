const asyncHandler = require('../middleware/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const teacherService = require('../services/teacherService');
const dashboardService = require('../services/dashboardService');
const attendanceService = require('../services/attendanceService');
const assignmentService = require('../services/assignmentService');
const { HTTP_STATUS } = require('../constants');

// @desc    Get teacher dashboard stats
// @route   GET /api/teachers/dashboard
// @access  Private/Teacher
exports.getDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getTeacherStats(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, stats, 'Dashboard data retrieved successfully');
});

// @desc    Get teacher assigned classes
// @route   GET /api/teachers/classes
// @access  Private/Teacher
exports.getClasses = asyncHandler(async (req, res) => {
  const classes = await teacherService.getAssignedClasses(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, classes);
});

// @desc    Submit class attendance
// @route   POST /api/teachers/attendance
// @access  Private/Teacher
exports.submitAttendance = asyncHandler(async (req, res) => {
  const { classId, records } = req.body;
  const attendance = await attendanceService.submitAttendance(req.user.id, classId, records);
  sendResponse(res, HTTP_STATUS.CREATED, attendance, 'Attendance submitted successfully');
});

// @desc    Create new assignment
// @route   POST /api/teachers/assignments
// @access  Private/Teacher
exports.createAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.createAssignment(req.user.id, req.body);
  sendResponse(res, HTTP_STATUS.CREATED, assignment, 'Assignment created successfully');
});

// @desc    Get teacher created assignments
// @route   GET /api/teachers/assignments
// @access  Private/Teacher
exports.getAssignments = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.getTeacherAssignments(req.user.id);
  sendResponse(res, HTTP_STATUS.OK, assignments);
});
