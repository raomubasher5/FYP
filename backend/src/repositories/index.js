'use strict';

const BusinessProfile = require('../models/BusinessProfile');
const SocialAccount = require('../models/SocialAccount');
const Log = require('../models/Log');
const Comment = require('../models/Comment');

/**
 * AccountRepository — Data Access Layer for user-registered social channels.
 */
class AccountRepository {
  async findAll() {
    return SocialAccount.find({}).sort({ createdAt: 1 }).lean();
  }

  async findById(id) {
    return SocialAccount.findOne({ id }).lean();
  }

  async findByPlatform(platform) {
    return SocialAccount.findOne({ platform, status: 'connected' }).lean();
  }

  async findConnected() {
    return SocialAccount.find({ status: 'connected' }).lean();
  }

  async create(data) {
    const doc = await SocialAccount.create(data);
    return doc.toJSON();
  }

  async update(id, updates) {
    const doc = await SocialAccount.findOneAndUpdate({ id }, { $set: updates }, { new: true });
    return doc ? doc.toJSON() : null;
  }

  async delete(id) {
    const res = await SocialAccount.deleteOne({ id });
    return res.deletedCount > 0;
  }
}

/**
 * ProfileRepository — singleton business profile document.
 * `get()` returns null until the user creates a profile (no seeded data).
 */
class ProfileRepository {
  async get() {
    const doc = await BusinessProfile.findOne({ id: 'business' }).lean();
    return doc || null;
  }

  async update(updates) {
    const doc = await BusinessProfile.findOneAndUpdate(
      { id: 'business' },
      { $set: { id: 'business', ...updates } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return doc.toJSON();
  }
}

/**
 * LogRepository — operational audit log.
 */
class LogRepository {
  async findAll(limit = 100) {
    return Log.find({}).sort({ timestamp: -1 }).limit(limit).lean();
  }

  async create(message, level = 'info') {
    const doc = await Log.create({ timestamp: new Date(), level, message });
    // Keep the log bounded (most recent 200 entries).
    const total = await Log.countDocuments();
    if (total > 200) {
      const excess = await Log.find({}).sort({ timestamp: 1 }).limit(total - 200).select('_id').lean();
      if (excess.length) {
        await Log.deleteMany({ _id: { $in: excess.map((e) => e._id) } });
      }
    }
    return doc.toJSON();
  }

  /** Clear workspace operational data (posts handled by caller) — demo reset. */
  async clear() {
    await Log.deleteMany({});
  }
}

/**
 * CommentRepository — real audience comments imported for sentiment analysis.
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

module.exports = {
  accountRepository: new AccountRepository(),
  profileRepository: new ProfileRepository(),
  logRepository: new LogRepository(),
  commentRepository: new CommentRepository()
};
