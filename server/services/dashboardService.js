const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Ticket = require('../models/Ticket');
const { ATTENDANCE_STATUS, ROLES } = require('../constants');

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

    // 4. Get recent activities
    const recentActivities = [
      ...(await Attendance.find({ student: studentId }).sort({ createdAt: -1 }).limit(2).lean()).map(a => ({
        type: 'attendance',
        msg: `Attendance recorded: ${a.status}`,
        time: a.createdAt,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100'
      })),
      ...(await Grade.find({ student: studentId }).sort({ createdAt: -1 }).limit(2).lean()).map(g => ({
        type: 'grade',
        msg: `Grade posted for ${g.subject}`,
        time: g.createdAt,
        color: 'text-purple-600',
        bg: 'bg-purple-100'
      }))
    ].sort((a, b) => b.time - a.time).slice(0, 4);

    return {
      attendancePercentage: Math.round(attendancePercentage),
      averageGrade: Math.round(avgGrade),
      pendingAssignments,
      totalSubjects: await Grade.distinct('subject', { student: studentId }).then(s => s.length),
      activities: recentActivities
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

    // 3. Pending Attendance Submissions
    // Logic: Count classes where attendance hasn't been marked today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const classesWithAttendance = await Attendance.distinct('class', { date: { $gte: today } });
    const pendingAttendance = classes.filter(c => !classesWithAttendance.includes(c._id.toString())).length;

    // 4. Total Students
    const totalAssignedStudents = await Student.countDocuments({
      class: { $in: classes.map(c => c._id) }
    });

    // 5. Total Subjects
    const totalSubjects = await Subject.countDocuments({ teacher: teacherId });

    // 6. Recent Activities
    const recentActivities = [
      ...(await Assignment.find({ teacher: teacherId }).sort({ createdAt: -1 }).limit(2).lean()).map(a => ({
        type: 'assignment',
        msg: `Assignment created: ${a.title}`,
        time: a.createdAt,
        color: 'text-blue-600',
        bg: 'bg-blue-100'
      })),
      ...(await Attendance.find({ class: { $in: classes.map(c => c._id) } }).sort({ createdAt: -1 }).limit(2).lean()).map(a => ({
        type: 'attendance',
        msg: `Attendance updated for Class`,
        time: a.createdAt,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100'
      }))
    ].sort((a, b) => b.time - a.time).slice(0, 4);

    return {
      totalClasses,
      activeAssignments,
      pendingAttendance,
      totalAssignedStudents,
      totalSubjects,
      department: teacher.department,
      activities: recentActivities
    };
  }

  /**
   * Get Admin Dashboard stats
   */
  async getAdminStats() {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalClasses = await Class.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: { $in: ['Open', 'In Progress'] } });

    const recentActivities = [
      ...(await Ticket.find({}).sort({ createdAt: -1 }).limit(3).lean()).map(t => ({
        type: 'support',
        msg: `Ticket ${t.ticketId}: ${t.status}`,
        time: t.createdAt,
        color: 'text-orange-600',
        bg: 'bg-orange-100'
      })),
      ...(await Class.find({}).sort({ createdAt: -1 }).limit(2).lean()).map(c => ({
        type: 'system',
        msg: `Class ${c.name} updated`,
        time: c.createdAt,
        color: 'text-indigo-600',
        bg: 'bg-indigo-100'
      }))
    ].sort((a, b) => b.time - a.time).slice(0, 5);

    return {
      totalStudents,
      totalTeachers,
      totalClasses,
      totalSubjects,
      openTickets,
      activities: recentActivities
    };
  }
}

module.exports = new DashboardService();
