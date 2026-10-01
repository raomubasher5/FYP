'use strict';

const BusinessProfile = require('../models/BusinessProfile');

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

module.exports = new ProfileRepository();
