'use strict';

const Comment = require('../models/Comment');

/**
 * CommentRepository — real audience comments imported for sentiment analysis.
 * Pure persistence: no business logic here.
 */
class CommentRepository {
  async findAll(limit = 50) {
    return Comment.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  }

  async create(data) {
    const doc = await Comment.create(data);
    return doc.toJSON();
  }

  async updateSentiment(id, sentiment) {
    const doc = await Comment.findOneAndUpdate({ id }, { $set: { sentiment } }, { new: true });
    return doc ? doc.toJSON() : null;
  }

  async clear() {
    await Comment.deleteMany({});
  }
}

module.exports = new CommentRepository();
