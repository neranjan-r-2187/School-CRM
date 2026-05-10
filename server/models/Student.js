const mongoose = require('mongoose');

/**
 * Student Model
 * Purpose: Stores role-specific business data for students.
 */
const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent',
      },
    ],
    rollNumber: {
      type: String,
      trim: true,
    },
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
studentSchema.index({ user: 1 });
studentSchema.index({ class: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
