'use strict';

const Log = require('../models/Log');

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

module.exports = new LogRepository();
