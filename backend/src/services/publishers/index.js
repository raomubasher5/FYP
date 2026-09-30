'use strict';

const BasePublisher = class {
  constructor(platformName) {
    this.platform = platformName;
  }

  /**
   * SANDBOX SIMULATION — records a local dispatch receipt.
   * No real social platform API call is made, no real post URL is
   * fabricated, and no engagement numbers are invented. `url` is null
   * until a live API integration exists for this platform.
   */
  async publish(content, account) {
    // Simulated dispatch latency
    await new Promise((r) => setTimeout(r, 150));

    return {
      platform: this.platform,
      account: account.handle,
      status: 'success',
      simulated: true,
      platformPostId: null,
      publishedAt: new Date().toISOString(),
      mode: account.mode || 'sandbox',
      url: null
    };
  }
};

class TwitterPublisher extends BasePublisher {
  constructor() {
    super('twitter');
  }
}

class InstagramPublisher extends BasePublisher {
  constructor() {
    super('instagram');
  }
}

class FacebookPublisher extends BasePublisher {
  constructor() {
    super('facebook');
  }
}

class TikTokPublisher extends BasePublisher {
  constructor() {
    super('tiktok');
  }
}

class LinkedInPublisher extends BasePublisher {
  constructor() {
    super('linkedin');
  }
}

/**
 * PublishingManager — Strategy Pattern: one publisher per platform.
 */
class PublishingManager {
  constructor() {
    this.publishers = {
      twitter: new TwitterPublisher(),
      instagram: new InstagramPublisher(),
      facebook: new FacebookPublisher(),
      tiktok: new TikTokPublisher(),
      linkedin: new LinkedInPublisher()
    };
  }

  getPublisher(platform) {
    return this.publishers[platform] || new BasePublisher(platform);
  }
}

module.exports = new PublishingManager();
