'use strict';

const { profileRepository, accountRepository, logRepository, commentRepository } = require('../repositories');
const postRepository = require('../repositories/PostRepository');
const analyticsService = require('../services/AnalyticsService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class ProfileController {
  get = asyncHandler(async (req, res) => {
    const profile = await profileRepository.get();
    return ApiResponse.success(res, profile, profile ? 'Profile retrieved successfully' : 'No profile yet — create one in Settings');
  });

  update = asyncHandler(async (req, res) => {
    const { businessName, ...rest } = req.body || {};
    if (!businessName) {
      throw new AppError('businessName is required', 400);
    }
    const updated = await profileRepository.update(req.body);
    await logRepository.create(`Updated profile settings for "${updated.businessName}"`);
    return ApiResponse.success(res, updated, 'Profile updated successfully');
  });

  updateAIConfig = asyncHandler(async (req, res) => {
    const { provider, apiKey, model } = req.body;
    const aiService = require('../services/ai');
    aiService.reconfigure(provider, apiKey, model);
    await logRepository.create(`Switched AI provider to [${String(provider).toUpperCase()}]`);
    return ApiResponse.success(res, { provider: aiService.activeProviderName, model }, 'AI provider configured successfully');
  });
}

class AccountController {
  getAll = asyncHandler(async (req, res) => {
    const accounts = await accountRepository.findAll();
    return ApiResponse.success(res, accounts);
  });

  /** Register the user's own real channel (handle = their actual account). */
  create = asyncHandler(async (req, res) => {
    const { platform, name, handle, followers, avatar, mode } = req.body || {};

    if (!platform || !name || !handle) {
      throw new AppError('platform, name and handle are required', 400);
    }
    const allowed = ['instagram', 'twitter', 'facebook', 'tiktok', 'linkedin'];
    if (!allowed.includes(platform)) {
      throw new AppError(`Unsupported platform: ${platform}`, 400);
    }

    const existing = await accountRepository.findByPlatform(platform);
    if (existing) {
      throw new AppError(`A ${platform} channel is already connected (${existing.handle})`, 409);
    }

    const created = await accountRepository.create({
      id: `acc-${platform}-${Date.now()}`,
      platform,
      name,
      handle,
      status: 'connected',
      mode: mode === 'live' ? 'live' : 'sandbox',
      connectedAt: new Date(),
      followers: Number(followers) || 0,
      avatar: avatar || ''
    });

    await logRepository.create(`Channel "${name}" (${handle}) registered for platform [${platform.toUpperCase()}]`);
    return ApiResponse.created(res, created, 'Channel connected successfully');
  });

  toggleConnection = asyncHandler(async (req, res) => {
    const account = await accountRepository.findById(req.params.id);
    if (!account) throw new AppError('Social account not found', 404);

    const newStatus = account.status === 'connected' ? 'disconnected' : 'connected';
    const updated = await accountRepository.update(account.id, {
      status: newStatus,
      connectedAt: newStatus === 'connected' ? new Date() : account.connectedAt
    });

    await logRepository.create(`Account "${account.name}" status changed to ${newStatus}`);
    return ApiResponse.success(res, updated);
  });

  setMode = asyncHandler(async (req, res) => {
    const { mode } = req.body;
    if (!['sandbox', 'live'].includes(mode)) {
      throw new AppError('mode must be "sandbox" or "live"', 400);
    }
    const account = await accountRepository.findById(req.params.id);
    if (!account) throw new AppError('Social account not found', 404);

    const updated = await accountRepository.update(account.id, { mode });
    return ApiResponse.success(res, updated);
  });

  delete = asyncHandler(async (req, res) => {
    const account = await accountRepository.findById(req.params.id);
    if (!account) throw new AppError('Social account not found', 404);

    const deleted = await accountRepository.delete(req.params.id);
    if (deleted) {
      await logRepository.create(`Channel "${account.name}" (${account.handle}) removed`);
    }
    return ApiResponse.success(res, null, 'Channel removed');
  });
}

class AnalyticsController {
  getOverview = asyncHandler(async (req, res) => {
    const data = await analyticsService.getMetricsOverview();
    return ApiResponse.success(res, data);
  });

  /** Import a REAL audience comment (text copied from a platform) for sentiment analysis. */
  addComment = asyncHandler(async (req, res) => {
    const { author, text, platform, topic } = req.body || {};
    if (!text || !String(text).trim()) {
      throw new AppError('comment text is required', 400);
    }

    const created = await commentRepository.create({
      id: `cmt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      author: (author || 'Anonymous').trim(),
      text: String(text).trim(),
      platform: platform || 'unknown',
      topic: topic || ''
    });

    await logRepository.create(`[Analytics] Imported audience comment from "${created.author}" for sentiment analysis`);
    return ApiResponse.created(res, created, 'Comment imported successfully');
  });
}

class SystemController {
  getLogs = asyncHandler(async (req, res) => {
    const logs = await logRepository.findAll();
    return ApiResponse.success(res, logs);
  });

  /** Full workspace reset: clears posts, comments and logs (accounts/profile are kept). */
  resetDemo = asyncHandler(async (req, res) => {
    await postRepository.findAll().then((posts) => Promise.all(posts.map((p) => postRepository.delete(p.id))));
    await commentRepository.clear();
    await logRepository.clear();
    await logRepository.create('Workspace reset — posts, imported comments and logs cleared');
    return ApiResponse.success(res, null, 'Workspace reset successfully');
  });
}

module.exports = {
  profileController: new ProfileController(),
  accountController: new AccountController(),
  analyticsController: new AnalyticsController(),
  systemController: new SystemController()
};
