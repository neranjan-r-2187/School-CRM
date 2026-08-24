// This file hits NoSQL (Mongo) concepts:
// - CRUD operations (Mongo)
// - Schema modeling (Mongo)
// - Embedding vs referencing relationships
// - Aggregation pipelines
// - Indexing for query performance (Mongo)

const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Referencing relationship
  content: { type: String, required: true },
  readBy: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId },
    timestamp: { type: Date, default: Date.now }
  }], // Embedding relationship
  createdAt: { type: Date, default: Date.now }
});

// Indexing for query performance (Mongo)
ChatMessageSchema.index({ senderId: 1, createdAt: -1 });

// Static method demonstrating Aggregation Pipelines
ChatMessageSchema.statics.getChatStats = async function() {
  return this.aggregate([
    { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
    { $group: { _id: "$senderId", totalMessages: { $sum: 1 } } },
    { $sort: { totalMessages: -1 } }
  ]);
};

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
