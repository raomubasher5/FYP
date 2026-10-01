'use strict';

const SocialAccount = require('../models/SocialAccount');

/**
 * AccountRepository — Data Access Layer for user-registered social channels.
 * Pure persistence: no business logic here.
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

module.exports = new AccountRepository();
