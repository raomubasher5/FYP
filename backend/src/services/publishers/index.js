'use strict';

const SandboxPublisher = require('./sandbox');
const xPublisher = require('./x');
const metaPublishers = require('./meta');
const tiktokPublisher = require('./tiktok');

/**
 * PublishingManager — Strategy Pattern with REAL platform publishers and a
 * clearly-labeled sandbox fallback.
 *
 * Dispatch rule:
 *   account.mode === 'live' AND account.credentials present -> real publisher
 *   anything else                                           -> sandbox simulation
 */
class PublishingManager {
  constructor() {
    this.real = {
      twitter: xPublisher,
      facebook: metaPublishers.facebook,
      instagram: metaPublishers.instagram,
      tiktok: tiktokPublisher
    };
    this.oauth = {
      twitter: xPublisher,
      facebook: metaPublishers.facebook,
      instagram: metaPublishers.instagram,
      tiktok: tiktokPublisher
    };
  }

  isLiveAccount(account) {
    return Boolean(account && account.mode === 'live' && account.credentials);
  }

  getPublisher(platform, account) {
    if (this.isLiveAccount(account) && this.real[platform]) {
      return this.real[platform];
    }
    return new SandboxPublisher(platform);
  }
}

module.exports = new PublishingManager();
