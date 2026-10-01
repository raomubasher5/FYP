'use strict';

const postRepository = require('../repositories/PostRepository');
const { logRepository, commentRepository } = require('../repositories');
const aiService = require('./ai');

/**
 * AnalyticsService — aggregates REAL workspace metrics from MongoDB.
 * All numbers come from stored post metrics and imported comments;
 * when no data exists, honest nulls/empty arrays are returned.
 */
class AnalyticsService {
  static engagementOf(post) {
    const m = post.metrics || {};
    return (m.likes || 0) + (m.comments || 0) + (m.shares || 0);
  }

  async getMetricsOverview() {
    const allPosts = await postRepository.findAll();
    const publishedPosts = allPosts.filter((p) => p.status === 'published');

    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalReach = 0;
    let postsWithMetrics = 0;

    publishedPosts.forEach((p) => {
      if (p.metrics) {
        postsWithMetrics += 1;
        totalLikes += p.metrics.likes || 0;
        totalComments += p.metrics.comments || 0;
        totalShares += p.metrics.shares || 0;
        totalReach += p.metrics.reach || 0;
      }
    });

    const totalEngagement = totalLikes + totalComments + totalShares;
    const avgEngagementRate = totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(1) : null;

    // Real imported comments, classified by the active AI provider.
    const comments = await commentRepository.findAll();
    const sentimentResult = await aiService.analyzeSentiment(comments);

    // Recommendations computed from real post data (may be empty).
    const recommendations = await aiService.getRecommendations({ recentPosts: allPosts });

    return {
      overview: {
        totalPosts: allPosts.length,
        publishedCount: publishedPosts.length,
        scheduledCount: allPosts.filter((p) => p.status === 'scheduled').length,
        draftCount: allPosts.filter((p) => p.status === 'draft').length,
        postsWithMetrics,
        totalLikes,
        totalComments,
        totalShares,
        totalReach,
        totalEngagement,
        avgEngagementRate
      },
      sentiment: sentimentResult.metrics, // null when no comments imported yet
      sentimentProvider: sentimentResult.provider,
      comments,
      recommendations,
      trend: this.getWeeklyTrend(publishedPosts)
    };
  }

  /**
   * Last 7 days of reach/engagement from REAL published post timestamps.
   * Days without data are zero — the chart shows an honest empty state
   * when there is nothing to plot.
   */
  getWeeklyTrend(publishedPosts) {
    const days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      days.push({
        date: day.toISOString().slice(0, 10),
        label: day.toLocaleDateString('en-US', { weekday: 'short' }),
        reach: 0,
        engagements: 0,
        postsPublished: 0
      });
    }

    const indexByDate = {};
    days.forEach((d, idx) => (indexByDate[d.date] = idx));

    publishedPosts.forEach((p) => {
      if (!p.publishedAt) return;
      const key = new Date(p.publishedAt).toISOString().slice(0, 10);
      const idx = indexByDate[key];
      if (idx === undefined) return;
      days[idx].postsPublished += 1;
      days[idx].reach += (p.metrics && p.metrics.reach) || 0;
      days[idx].engagements += AnalyticsService.engagementOf(p);
    });

    return days;
  }
}

module.exports = new AnalyticsService();
