const postRepository = require('../repositories/PostRepository');
const postService = require('./PostService');
const { logRepository } = require('../repositories');
const config = require('../config');

class SchedulerService {
  constructor() {
    this.intervalId = null;
    this.isProcessing = false;
  }

  start() {
    if (this.intervalId) return;
    console.log(`[SchedulerService] Background worker started (Interval: ${config.scheduler.intervalMs}ms)`);
    
    this.intervalId = setInterval(async () => {
      await this.processDuePosts();
    }, config.scheduler.intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[SchedulerService] Background worker stopped');
    }
  }

  async processDuePosts() {
    if (this.isProcessing) return; // Mutex lock prevents race conditions
    this.isProcessing = true;

    try {
      const now = new Date();
      const duePosts = postRepository.findAll(p => {
        return p.status === 'scheduled' && p.scheduledTime && new Date(p.scheduledTime) <= now;
      });

      for (const post of duePosts) {
        console.log(`[SchedulerService] Due post detected: "${post.topic}". Firing auto-publish.`);
        logRepository.create(`[SchedulerService] Executing auto-publish for "${post.topic}"`);
        await postService.publishPost(post.id);
      }
    } catch (err) {
      console.error('[SchedulerService] Error processing due jobs:', err.message);
    } finally {
      this.isProcessing = false;
    }
  }

  async forceTrigger(postId) {
    return await postService.publishPost(postId);
  }
}

module.exports = new SchedulerService();
