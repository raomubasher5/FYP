const storage = require('../db/storage');

class PublishingService {
  /**
   * Publishes a post across all its target platforms
   */
  async publishPost(post) {
    const targetPlatforms = post.targetPlatforms || Object.keys(post.platforms || {});
    const connectedAccounts = storage.getSocialAccounts().filter(acc => acc.status === 'connected');
    const results = [];

    for (const platform of targetPlatforms) {
      const account = connectedAccounts.find(acc => acc.platform === platform);
      
      if (!account) {
        results.push({
          platform,
          status: 'skipped',
          reason: `No active connected account for ${platform}`
        });
        continue;
      }

      // Simulated publishing execution (either Live or Sandbox)
      const executionResult = await this.publishToSinglePlatform(platform, post.platforms[platform], account);
      results.push(executionResult);
    }

    // Generate initial live simulated engagement metrics
    const baseLikes = Math.floor(Math.random() * 80) + 25;
    const baseComments = Math.floor(Math.random() * 15) + 4;
    const baseShares = Math.floor(Math.random() * 8) + 2;
    const baseReach = baseLikes * 12 + Math.floor(Math.random() * 300);

    const updatedPost = storage.updatePost(post.id, {
      status: 'published',
      publishedAt: new Date().toISOString(),
      executionResults: results,
      metrics: {
        likes: baseLikes,
        comments: baseComments,
        shares: baseShares,
        reach: baseReach
      },
      sentiment: {
        positive: 78,
        neutral: 18,
        negative: 4
      }
    });

    storage.addLog(`[Publisher] Autonomous dispatch complete for "${post.topic}". Platforms: ${targetPlatforms.join(', ')}.`);

    return {
      success: true,
      post: updatedPost,
      results
    };
  }

  async publishToSinglePlatform(platform, content, account) {
    // Simulated API call latency
    await new Promise((r) => setTimeout(r, 200));

    // Simulated platform post ID
    const platformPostId = `${platform.toUpperCase()}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return {
      platform,
      account: account.handle,
      status: 'success',
      platformPostId,
      publishedAt: new Date().toISOString(),
      mode: account.mode || 'sandbox',
      url: `https://${platform}.com/${account.handle.replace('@', '')}/status/${platformPostId}`
    };
  }
}

module.exports = new PublishingService();
