require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Assignment = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const Grade = require('../models/Grade');
const { ROLES, ATTENDANCE_STATUS } = require('../constants');
const sampleData = require('../data/sampleData');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Seed Users
    const bcrypt = require('bcryptjs');
    const hashedUsers = await Promise.all(sampleData.users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      return { ...user, password: hashedPassword };
    }));
    const users = await User.insertMany(hashedUsers);
    console.log('1. Seeded Users');

    const admin = users.find(u => u.role === ROLES.ADMIN);
    const teacherUsers = users.filter(u => u.role === ROLES.TEACHER);
    const studentUsers = users.filter(u => u.role === ROLES.STUDENT);
    const parentUsers = users.filter(u => u.role === ROLES.PARENT);

    // 2. Seed Classes
    const classes = await Class.insertMany(sampleData.classes);
    console.log('2. Seeded Classes');

    // 3. Seed Teachers
    const teacherData = teacherUsers.map((u, i) => ({
      user: u._id,
      employeeId: `EMP${100 + i}`,
      department: i === 0 ? 'Science' : 'Mathematics',
      assignedClasses: [classes[0]._id, classes[1]._id]
    }));
    const teachers = await Teacher.insertMany(teacherData);
    console.log('3. Seeded Teachers');

    // 4. Seed Subjects
    const subjectData = sampleData.subjects.map((s, i) => ({
      ...s,
      teacher: teachers[i % teachers.length]._id,
      class: classes[i % classes.length]._id
    }));
    const subjects = await Subject.insertMany(subjectData);
    console.log('4. Seeded Subjects');

    // 5. Seed Students
    const studentData = studentUsers.map((u, i) => ({
      user: u._id,
      studentId: `STU${200 + i}`,
      class: classes[i % classes.length]._id,
      rollNumber: `${i + 1}`
    }));
    const students = await Student.insertMany(studentData);
    console.log('5. Seeded Students');

    // 6. Seed Parents
    const parentData = parentUsers.map((u, i) => ({
      user: u._id,
      children: [students[i * 2]._id, students[i * 2 + 1]._id].filter(id => id)
    }));
    const parents = await Parent.insertMany(parentData);
    console.log('6. Seeded Parents');

    // Link parents to students
    for (const parent of parents) {
      await Student.updateMany(
        { _id: { $in: parent.children } },
        { $push: { parents: parent._id } }
      );
    }

    // 7. Seed Assignments
    const assignmentData = sampleData.assignments.map((a, i) => ({
      ...a,
      teacher: teachers[i % teachers.length]._id,
      subject: subjects[i % subjects.length]._id,
      class: classes[i % classes.length]._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }));
    const assignments = await Assignment.insertMany(assignmentData);
    console.log('7. Seeded Assignments');

    // 8. Seed Attendance
    const attendanceData = students.map(s => ({
      student: s._id,
      class: s.class,
      date: new Date(),
      status: ATTENDANCE_STATUS.PRESENT,
      recordedBy: admin._id
    }));
    await Attendance.insertMany(attendanceData);
    console.log('8. Seeded Attendance');

    // 9. Seed Grades
    const gradeData = students.map((s, i) => ({
      student: s._id,
      subject: subjects[0]._id,
      assignment: assignments[0]._id,
      marksObtained: 40 + i * 2,
      totalMarks: 50,
      grade: 'A',
      gradedBy: admin._id
    }));
    await Grade.insertMany(gradeData);
    console.log('9. Seeded Grades');

    console.log('\x1b[32m%s\x1b[0m', 'Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
