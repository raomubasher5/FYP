'use strict';

/**
 * SandboxPublisher — clearly-labeled simulation. Used when an account has
 * no live OAuth credentials (or is explicitly in sandbox mode), so the app
 * can be demoed/tested without posting to any real timeline.
 */
class SandboxPublisher {
  constructor(platform) {
    this.platform = platform;
  }

  async publish(content, account) {
    // Simulated dispatch latency
    await new Promise((r) => setTimeout(r, 150));

    return {
      platform: this.platform,
      account: account.handle,
      status: 'success',
      simulated: true,
      mode: account.mode || 'sandbox',
      platformPostId: null,
      publishedAt: new Date().toISOString(),
      url: null
    };
  }
}

module.exports = SandboxPublisher;
