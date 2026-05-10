const Student = require('../models/Student');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Subject = require('../models/Subject'); // Added to ensure registration

/**
 * Student Service
 * Handles identity-based data retrieval for students.
 */
class StudentService {
  async getProfile(userId) {
    return await Student.findOne({ user: userId })
      .populate('user', 'name email')
      .populate('class', 'name section');
  }

  async getGrades(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return [];
    
    return await Grade.find({ student: student._id })
      .populate('subject', 'name code')
      .populate('assignment', 'title')
      .sort('-createdAt');
  }

  async getAttendance(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return [];

    return await Attendance.find({ student: student._id })
      .populate('class', 'name section')
      .sort('-date');
  }

  async getAssignments(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return [];

    return await Assignment.find({ class: student.class })
      .populate('subject', 'name')
      .populate('teacher', 'name')
      .sort('dueDate');
  }

  async getAllStudents(query = {}) {
    const filter = {};
    if (query.class) filter.class = query.class;
    
    return await Student.find(filter)
      .populate('user', 'name email')
      .populate('class', 'name section')
      .sort('rollNumber');
  }
}

module.exports = new StudentService();
