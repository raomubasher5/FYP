'use strict';

const { accountRepository, logRepository } = require('../repositories');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * AccountController — social channels the user registers for their business.
 * Publishing stays a sandbox simulation until live OAuth is integrated.
 */
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

    if (mode === 'live' && !account.credentials) {
      throw new AppError(
        'This channel has no live credentials — use the "Connect" button (OAuth) in Channels first',
        400
      );
    }

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

module.exports = new AccountController();
