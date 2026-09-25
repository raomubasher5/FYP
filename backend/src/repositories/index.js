const db = require('./BaseRepository');

class AccountRepository {
  findAll() {
    return db.data.socialAccounts;
  }

  findById(id) {
    return db.data.socialAccounts.find(a => a.id === id) || null;
  }

  findByPlatform(platform) {
    return db.data.socialAccounts.find(a => a.platform === platform) || null;
  }

  findConnected() {
    return db.data.socialAccounts.filter(a => a.status === 'connected');
  }

  update(id, updates) {
    const idx = db.data.socialAccounts.findIndex(a => a.id === id);
    if (idx === -1) return null;

    db.data.socialAccounts[idx] = { ...db.data.socialAccounts[idx], ...updates };
    db.persist();
    return db.data.socialAccounts[idx];
  }
}

class ProfileRepository {
  get() {
    return db.data.businessProfile;
  }

  update(updates) {
    db.data.businessProfile = { ...db.data.businessProfile, ...updates };
    db.persist();
    return db.data.businessProfile;
  }
}

class LogRepository {
  findAll(limit = 100) {
    return db.data.logs.slice(0, limit);
  }

  create(message, level = 'info') {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message
    };
    db.data.logs.unshift(entry);
    if (db.data.logs.length > 200) {
      db.data.logs = db.data.logs.slice(0, 200);
    }
    db.persist();
    return entry;
  }

  getComments() {
    return db.data.sampleComments || [];
  }

  resetAll() {
    return db.reset();
  }
}

module.exports = {
  accountRepository: new AccountRepository(),
  profileRepository: new ProfileRepository(),
  logRepository: new LogRepository()
};
