const postRepository = require('../repositories/PostRepository');
const { logRepository } = require('../repositories');
const aiService = require('./ai');

class AnalyticsService {
  async getMetricsOverview() {
    const allPosts = postRepository.findAll();
    const publishedPosts = allPosts.filter(p => p.status === 'published');

    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalReach = 0;

    publishedPosts.forEach(p => {
      if (p.metrics) {
        totalLikes += p.metrics.likes || 0;
        totalComments += p.metrics.comments || 0;
        totalShares += p.metrics.shares || 0;
        totalReach += p.metrics.reach || 0;
      }
    });

    const comments = logRepository.getComments();
    const sentimentResult = await aiService.analyzeSentiment(comments);
    const recommendations = await aiService.getRecommendations({ recentPosts: publishedPosts });

    return {
      overview: {
        totalPosts: allPosts.length,
        publishedCount: publishedPosts.length,
        scheduledCount: allPosts.filter(p => p.status === 'scheduled').length,
        draftCount: allPosts.filter(p => p.status === 'draft').length,
        totalLikes,
        totalComments,
        totalShares,
        totalReach
      },
      sentiment: sentimentResult.metrics,
      comments: sentimentResult.analyzedComments,
      recommendations
    };
  }
}

module.exports = new AnalyticsService();
