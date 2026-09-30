'use strict';

const postRepository = require('../repositories/PostRepository');
const { accountRepository, logRepository } = require('../repositories');
const publishingManager = require('./publishers');
const AppError = require('../utils/AppError');

/**
 * PostService — post lifecycle & domain logic.
 *
 * Note on honesty: publishing runs in SANDBOX SIMULATION mode. No real
 * platform API calls are made, no fake post URLs are fabricated, and no
 * engagement metrics are invented. `metrics`/`sentiment` stay null until
 * real platform data is recorded.
 */
class PostService {
  async getAllPosts(statusFilter = null) {
    if (statusFilter) {
      return postRepository.findAll({ status: statusFilter });
    }
    return postRepository.findAll();
  }

  async getPostById(id) {
    const post = await postRepository.findById(id);
    if (!post) throw new AppError(`Post with ID ${id} not found`, 404);
    return post;
  }

  async createPost(payload) {
    const {
      topic,
      tone,
      mode = 'review',
      scheduledTime,
      imageUrl,
      imagePrompt,
      platforms,
      targetPlatforms
    } = payload;

    if (!topic || !platforms) {
      throw new AppError('Post requires a topic and platform payload', 400);
    }

    const status = mode === 'auto' ? 'scheduled' : 'draft';

    const newPost = {
      id: `post-${Date.now()}`,
      topic,
      tone: tone || 'Warm & Welcoming',
      mode,
      status,
      scheduledTime: scheduledTime || new Date(Date.now() + 3600000),
      createdAt: new Date(),
      imageUrl: imageUrl || null,
      imagePrompt: imagePrompt || '',
      platforms,
      targetPlatforms: targetPlatforms || Object.keys(platforms),
      metrics: null,
      sentiment: null
    };

    const saved = await postRepository.create(newPost);
    await logRepository.create(`[PostService] Created post "${newPost.topic}" with status [${newPost.status.toUpperCase()}]`);
    return saved;
  }

  async updatePost(id, updates) {
    const existing = await this.getPostById(id);
    const allowed = ['topic', 'tone', 'mode', 'status', 'scheduledTime', 'imageUrl', 'imagePrompt', 'platforms', 'targetPlatforms'];
    const clean = {};
    allowed.forEach((k) => {
      if (updates[k] !== undefined) clean[k] = updates[k];
    });

    const updated = await postRepository.update(id, clean);
    await logRepository.create(`[PostService] Updated post "${existing.topic}"`);
    return updated;
  }

  async deletePost(id) {
    const post = await this.getPostById(id);
    const deleted = await postRepository.delete(id);
    if (deleted) {
      await logRepository.create(`[PostService] Deleted post "${post.topic}"`);
    }
    return deleted;
  }

  async approveDraft(id) {
    const post = await this.getPostById(id);
    const updated = await postRepository.update(id, { status: 'scheduled' });
    await logRepository.create(`[Approval] Post "${post.topic}" approved for scheduling`);
    return updated;
  }

  async publishPost(id) {
    const post = await this.getPostById(id);
    const connectedAccounts = await accountRepository.findConnected();
    const targetPlatforms = post.targetPlatforms || Object.keys(post.platforms || {});
    const executionResults = [];

    for (const platform of targetPlatforms) {
      const account = connectedAccounts.find((a) => a.platform === platform);
      if (!account) {
        executionResults.push({
          platform,
          status: 'skipped',
          reason: `No connected ${platform} channel registered — add it in Channels`
        });
        continue;
      }

      const publisher = publishingManager.getPublisher(platform);
      const res = await publisher.publish(post.platforms[platform] || {}, account);
      executionResults.push(res);
    }

    // No fabricated metrics: engagement data is only populated when real
    // platform data is recorded (live API integration or manual import).
    const updated = await postRepository.update(id, {
      status: 'published',
      publishedAt: new Date(),
      executionResults
    });

    const published = executionResults.filter((r) => r.status === 'success').length;
    const skipped = executionResults.length - published;
    await logRepository.create(
      `[Publisher] Sandbox dispatch recorded for "${post.topic}" — ${published} channel receipt(s)${skipped ? `, ${skipped} skipped (no connected channel)` : ''}. No live platform calls made.`
    );
    return { post: updated, executionResults };
  }
}

module.exports = new PostService();
