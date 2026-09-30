'use strict';

/**
 * InsightEngine — computes recommendations from REAL workspace data only.
 *
 * Every insight below is derived from the user's actual published posts
 * and their recorded metrics. If there is no data, it returns an empty
 * list (the UI shows an honest empty state). No invented statistics.
 */
class InsightEngine {
  engagement(post) {
    const m = post.metrics || {};
    return (m.likes || 0) + (m.comments || 0) + (m.shares || 0);
  }

  /**
   * @param {Array} recentPosts — all posts (any status)
   * @returns {Array} recommendations derived from real data (may be empty)
   */
  build(recentPosts = []) {
    const published = (recentPosts || []).filter(
      (p) => p.status === 'published' && p.metrics && this.engagement(p) > 0
    );

    if (published.length === 0) {
      return [];
    }

    const recs = [];

    // 1. Top-performing channel (real totals)
    const byPlatform = {};
    published.forEach((p) => {
      (p.targetPlatforms || Object.keys(p.platforms || {})).forEach((pl) => {
        byPlatform[pl] = (byPlatform[pl] || 0) + this.engagement(p);
      });
    });
    const platformEntries = Object.entries(byPlatform).sort((a, b) => b[1] - a[1]);
    if (platformEntries.length > 0) {
      const [platform, total] = platformEntries[0];
      recs.push({
        id: `insight-platform-${platform}`,
        type: 'platform',
        title: `Top Performing Channel: ${platform}`,
        message: `${platform} has generated the most recorded engagement (${total} total interactions) across your ${published.length} published post(s).`,
        action: 'Prioritize this channel in your next campaign'
      });
    }

    // 2. Best posting window (real publishedAt buckets)
    const byHour = {};
    published.forEach((p) => {
      if (!p.publishedAt) return;
      const hour = new Date(p.publishedAt).getHours();
      byHour[hour] = (byHour[hour] || 0) + this.engagement(p);
    });
    const hourEntries = Object.entries(byHour).sort((a, b) => b[1] - a[1]);
    if (hourEntries.length > 0) {
      const [hour, total] = hourEntries[0];
      const hh = String(hour).padStart(2, '0');
      recs.push({
        id: `insight-timing-${hh}`,
        type: 'timing',
        title: `Best Posting Window: ${hh}:00 – ${hh}:59`,
        message: `Posts published in this window accumulated ${total} recorded interaction(s) in your workspace.`,
        action: 'Schedule your next post in this window'
      });
    }

    // 3. Top-performing topic (real totals)
    const byTopic = {};
    published.forEach((p) => {
      byTopic[p.topic] = (byTopic[p.topic] || 0) + this.engagement(p);
    });
    const topicEntries = Object.entries(byTopic).sort((a, b) => b[1] - a[1]);
    if (topicEntries.length > 0) {
      const [topic, total] = topicEntries[0];
      recs.push({
        id: `insight-topic-${topicEntries.length}`,
        type: 'content',
        title: `Top Performing Topic: "${topic}"`,
        message: `This topic has accumulated ${total} recorded interaction(s) — your best result so far.`,
        action: 'Create a follow-up post on this topic'
      });
    }

    return recs;
  }
}

module.exports = new InsightEngine();
