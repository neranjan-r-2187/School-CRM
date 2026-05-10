const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

/**
 * Teacher Service
 * Handles teacher-specific academic management.
 */
class TeacherService {
  async getProfile(userId) {
    return await Teacher.findOne({ user: userId })
      .populate('user', 'name email')
      .populate('assignedClasses', 'name section');
  }

  async getAssignedClasses(userId) {
    const teacher = await Teacher.findOne({ user: userId }).populate('assignedClasses');
    return teacher ? teacher.assignedClasses : [];
  }

  /**
   * Helper to verify if a teacher owns a class
   */
  async verifyClassOwnership(userId, classId) {
    const teacher = await Teacher.findOne({ user: userId });
    if (!teacher) return false;
    
    return teacher.assignedClasses.some(id => id.toString() === classId.toString());
  }
}

module.exports = new TeacherService();
