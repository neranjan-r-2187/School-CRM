const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const { ATTENDANCE_STATUS } = require('../constants');

/**
 * Dashboard Service
 * Handles complex aggregations and summary statistics for dashboards.
 */
class DashboardService {
  /**
   * Get statistics for a specific student
   */
  async getStudentStats(userId) {
    const student = await Student.findOne({ user: userId });
    if (!student) return null;

    const studentId = student._id;

    // 1. Calculate Attendance Percentage
    const attendanceRecords = await Attendance.find({ student: studentId });
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // 2. Calculate Average Grade
    const grades = await Grade.find({ student: studentId });
    const avgGrade = grades.length > 0 
      ? grades.reduce((acc, curr) => acc + (curr.marksObtained / curr.totalMarks), 0) / grades.length * 100 
      : 0;

    // 3. Count Pending Assignments
    const pendingAssignments = await Assignment.countDocuments({
      class: student.class,
      dueDate: { $gte: new Date() }
    });

    return {
      attendancePercentage: Math.round(attendancePercentage),
      averageGrade: Math.round(avgGrade),
      pendingAssignments,
      totalSubjects: await Grade.distinct('subject', { student: studentId }).then(s => s.length)
    };
  }

  /**
   * Get statistics for a specific teacher
   */
  async getTeacherStats(userId) {
    const teacherService = require('./teacherService');
    const teacher = await teacherService._getOrCreateProfile(userId);
    if (!teacher) return null;

    const teacherId = teacher._id;

    // 1. Total Classes (Assigned + Leading)
    const Class = require('../models/Class');
    const classes = await Class.find({
      $or: [
        { _id: { $in: teacher.assignedClasses } },
        { classTeacher: teacherId }
      ]
    });
    
    const totalClasses = classes.length;

    // 2. Active Assignments
    const activeAssignments = await Assignment.countDocuments({
      teacher: teacherId,
      dueDate: { $gte: new Date() }
    });

    // 3. Pending Attendance Submissions (Simplified logic)
    const pendingAttendance = totalClasses; 

    // 4. Total Students (Sum of students in all classes)
    const Student = require('../models/Student');
    const totalAssignedStudents = await Student.countDocuments({
      class: { $in: classes.map(c => c._id) }
    });

    return {
      totalClasses,
      activeAssignments,
      pendingAttendance,
      totalAssignedStudents,
      department: teacher.department
    };
  }
}

module.exports = new DashboardService();
