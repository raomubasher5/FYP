'use strict';

const Post = require('../models/Post');

/**
 * PostRepository — Data Access Layer for posts (MongoDB / Mongoose).
 * Pure persistence: no business logic here.
 */
class PostRepository {
  /**
   * Return posts, optionally filtered. Accepts a Mongoose filter object
   * (e.g. { status: 'draft' }) for efficiency, or a JS predicate for
   * compatibility with existing call sites.
   */
  async findAll(filterFn = null) {
    if (filterFn && typeof filterFn === 'object' && !Array.isArray(filterFn)) {
      return Post.find(filterFn).sort({ createdAt: -1 }).lean();
    }

    const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
    if (typeof filterFn === 'function') {
      return posts.filter(filterFn);
    }
    return posts;
  }

  async findById(id) {
    return Post.findOne({ id }).lean();
  }

  async create(postData) {
    const doc = await Post.create(postData);
    return doc.toJSON();
  }

  async update(id, updateData) {
    const doc = await Post.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
    return doc ? doc.toJSON() : null;
  }

  async delete(id) {
    const res = await Post.deleteOne({ id });
    return res.deletedCount > 0;
  }
}

module.exports = new PostRepository();
