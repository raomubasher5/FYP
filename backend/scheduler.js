const storage = require('./db/storage');
const publishingService = require('./services/publishingService');

class Scheduler {
  constructor() {
    this.intervalId = null;
    this.isRunning = false;
  }

  start(intervalMs = 4000) {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[Scheduler] Automation background worker running (checks every ${intervalMs / 1000}s)...`);
    
    this.intervalId = setInterval(async () => {
      await this.checkAndPublishDuePosts();
    }, intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isRunning = false;
      console.log('[Scheduler] Background worker stopped.');
    }
  }

  async checkAndPublishDuePosts() {
    try {
      const posts = storage.getPosts();
      const now = new Date();

      const duePosts = posts.filter(p => {
        return p.status === 'scheduled' && p.scheduledTime && new Date(p.scheduledTime) <= now;
      });

      for (const post of duePosts) {
        console.log(`[Scheduler] Due post detected: "${post.topic}" (ID: ${post.id}). Executing auto-publish...`);
        storage.addLog(`[Scheduler] Due post detected: "${post.topic}". Firing auto-publish worker.`);
        
        await publishingService.publishPost(post);
      }
    } catch (err) {
      console.error('[Scheduler] Error checking due posts:', err);
    }
  }

  /**
   * Manually triggers immediate publishing for a specific post (great for live FYP demos)
   */
  async forcePublish(postId) {
    const post = storage.getPostById(postId);
    if (!post) throw new Error("Post not found");
    return await publishingService.publishPost(post);
  }
}

module.exports = new Scheduler();
