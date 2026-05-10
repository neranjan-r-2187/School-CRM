const mongoose = require('mongoose');

/**
 * Subject Model
 * Purpose: Defines subjects taught in the school.
 */
const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a subject name'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide a subject code'],
      unique: true,
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    description: String,
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
subjectSchema.index({ teacher: 1 });
subjectSchema.index({ class: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
