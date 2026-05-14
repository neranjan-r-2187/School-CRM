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

  async getSchedule(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return null;

    const Schedule = require('../models/Schedule');
    return await Schedule.findOne({ class: student.class })
      .populate('periods.subject', 'name')
      .populate({
        path: 'periods.teacher',
        populate: { path: 'user', select: 'name' }
      });
  }

  async getAssignedTeachers(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return [];

    const Teacher = require('../models/Teacher');
    return await Teacher.find({ assignedStudents: student._id })
      .populate('user', 'name email')
      .populate('assignedClasses', 'name section');
  }

  async getAllStudents(query = {}) {
    const filter = {};
    if (query.class) filter.class = query.class;
    
    // If teacher is specified, find students assigned to that teacher
    if (query.teacherId) {
      const Teacher = require('../models/Teacher');
      const teacher = await Teacher.findById(query.teacherId);
      if (teacher) {
        filter._id = { $in: teacher.assignedStudents };
      }
    }
    
    return await Student.find(filter)
      .populate('user', 'name email')
      .populate('class', 'name section')
      .sort('rollNumber');
  }
}

module.exports = new StudentService();
