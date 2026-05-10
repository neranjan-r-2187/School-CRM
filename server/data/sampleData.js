const { ROLES, ATTENDANCE_STATUS, ASSIGNMENT_STATUS } = require('../constants');

const sampleData = {
  users: [
    { name: 'Admin User', email: 'admin@school.com', password: 'password123', role: ROLES.ADMIN },
    { name: 'John Doe', email: 'teacher1@school.com', password: 'password123', role: ROLES.TEACHER },
    { name: 'Jane Smith', email: 'teacher2@school.com', password: 'password123', role: ROLES.TEACHER },
    { name: 'Alice Johnson', email: 'student1@school.com', password: 'password123', role: ROLES.STUDENT },
    { name: 'Bob Wilson', email: 'student2@school.com', password: 'password123', role: ROLES.STUDENT },
    { name: 'Charlie Brown', email: 'student3@school.com', password: 'password123', role: ROLES.STUDENT },
    { name: 'David Miller', email: 'student4@school.com', password: 'password123', role: ROLES.STUDENT },
    { name: 'Mary Johnson', email: 'parent1@school.com', password: 'password123', role: ROLES.PARENT },
    { name: 'Robert Wilson', email: 'parent2@school.com', password: 'password123', role: ROLES.PARENT },
  ],
  classes: [
    { name: '10', section: 'A', roomNumber: '301', academicYear: '2023-24' },
    { name: '10', section: 'B', roomNumber: '302', academicYear: '2023-24' },
  ],
  subjects: [
    { name: 'Physics', code: 'PHYS101', description: 'Core Physics' },
    { name: 'Mathematics', code: 'MATH101', description: 'Advanced Calculus' },
    { name: 'English Literature', code: 'ENG101', description: 'Classic Literature' },
  ],
  assignments: [
    { title: 'Newtonian Laws', description: 'Complete the exercise on three laws of motion', totalMarks: 50, status: ASSIGNMENT_STATUS.PUBLISHED },
    { title: 'Algebraic Equations', description: 'Solve the quadratic equations worksheet', totalMarks: 20, status: ASSIGNMENT_STATUS.PUBLISHED },
  ]
};

module.exports = sampleData;
