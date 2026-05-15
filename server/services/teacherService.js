const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

/**
 * Teacher Service
 * Handles teacher-specific academic management.
 */
class TeacherService {
  async getProfile(userId) {
    const teacher = await Teacher.findOne({ user: userId })
      .populate('user', 'name email isActive')
      .populate('assignedClasses', 'name section');
    
    if (!teacher) return null;

    // Also find classes where this teacher is the primary class teacher
    const classesLeading = await Class.find({ classTeacher: teacher._id });
    
    return {
      ...teacher.toObject(),
      classesLeading
    };
  }

  async getAssignedClasses(userId) {
    const teacher = await Teacher.findOne({ user: userId });
    if (!teacher) return [];

    // Return classes explicitly in assignedClasses array OR where they are the classTeacher
    return await Class.find({
      $or: [
        { _id: { $in: teacher.assignedClasses } },
        { classTeacher: teacher._id }
      ]
    }).populate('classTeacher', 'user')
      .populate({
        path: 'classTeacher',
        populate: { path: 'user', select: 'name' }
      });
  }

  /**
   * Helper to verify if a teacher owns a class
   */
  /**
   * Helper to verify if a teacher owns a class
   */
  async verifyClassOwnership(userId, classId) {
    const teacher = await Teacher.findOne({ user: userId });
    if (!teacher) return false;
    
    const isAssigned = teacher.assignedClasses.some(id => id.toString() === classId.toString());
    if (isAssigned) return true;

    const classDoc = await Class.findOne({ _id: classId, classTeacher: teacher._id });
    return !!classDoc;
  }

  /**
   * Get all subjects taught by this teacher
   */
  async getSubjects(userId) {
    const teacher = await Teacher.findOne({ user: userId });
    if (!teacher) return [];

    const Subject = require('../models/Subject');
    return await Subject.find({ teacher: teacher._id }).populate('class', 'name section');
  }
}

module.exports = new TeacherService();
