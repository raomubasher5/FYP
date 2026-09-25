class BasePublisher {
  constructor(platformName) {
    this.platform = platformName;
  }

  async publish(content, account) {
    // Standard mock latency & receipt generation
    await new Promise((r) => setTimeout(r, 150));
    const postId = `${this.platform.toUpperCase()}_${Date.now()}_${Math.floor(Math.random() * 900 + 100)}`;

    return {
      platform: this.platform,
      account: account.handle,
      status: 'success',
      platformPostId: postId,
      publishedAt: new Date().toISOString(),
      mode: account.mode || 'sandbox',
      url: `https://${this.platform}.com/${account.handle.replace('@', '')}/status/${postId}`
    };
  }
}

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

class PublishingManager {
  constructor() {
    this.publishers = {
      twitter: new TwitterPublisher(),
      instagram: new InstagramPublisher(),
      facebook: new FacebookPublisher(),
      tiktok: new TikTokPublisher()
    };
  }

  getPublisher(platform) {
    return this.publishers[platform] || new BasePublisher(platform);
  }
}

module.exports = new PublishingManager();
