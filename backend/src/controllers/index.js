const { profileRepository, accountRepository, logRepository } = require('../repositories');
const analyticsService = require('../services/AnalyticsService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

class ProfileController {
  get = asyncHandler(async (req, res) => {
    const profile = profileRepository.get();
    return ApiResponse.success(res, profile);
  });

  update = asyncHandler(async (req, res) => {
    const updated = profileRepository.update(req.body);
    logRepository.create(`Updated profile settings for "${updated.businessName}"`);
    return ApiResponse.success(res, updated, 'Profile updated successfully');
  });

  updateAIConfig = asyncHandler(async (req, res) => {
    const { provider, apiKey, model } = req.body;
    const aiService = require('../services/ai');
    aiService.reconfigure(provider, apiKey, model);
    logRepository.create(`Switched AI provider to [${provider.toUpperCase()}]`);
    return ApiResponse.success(res, { provider, model }, 'AI provider configured successfully');
  });
}

class AccountController {
  getAll = asyncHandler(async (req, res) => {
    const accounts = accountRepository.findAll();
    return ApiResponse.success(res, accounts);
  });

  toggleConnection = asyncHandler(async (req, res) => {
    const account = accountRepository.findById(req.params.id);
    if (!account) throw new AppError('Social account not found', 404);

    const newStatus = account.status === 'connected' ? 'disconnected' : 'connected';
    const updated = accountRepository.update(account.id, {
      status: newStatus,
      connectedAt: newStatus === 'connected' ? new Date().toISOString() : null
    });

    logRepository.create(`Account "${account.name}" status changed to ${newStatus}`);
    return ApiResponse.success(res, updated);
  });

  setMode = asyncHandler(async (req, res) => {
    const { mode } = req.body;
    const account = accountRepository.findById(req.params.id);
    if (!account) throw new AppError('Social account not found', 404);

    const updated = accountRepository.update(account.id, { mode });
    return ApiResponse.success(res, updated);
  });
}

class AnalyticsController {
  getOverview = asyncHandler(async (req, res) => {
    const data = await analyticsService.getMetricsOverview();
    return ApiResponse.success(res, data);
  });
}

class SystemController {
  getLogs = asyncHandler(async (req, res) => {
    const logs = logRepository.findAll();
    return ApiResponse.success(res, logs);
  });

  resetDemo = asyncHandler(async (req, res) => {
    logRepository.resetAll();
    logRepository.create('System restored to factory demonstration state');
    return ApiResponse.success(res, null, 'Demo data reset successfully');
  });
}

module.exports = {
  profileController: new ProfileController(),
  accountController: new AccountController(),
  analyticsController: new AnalyticsController(),
  systemController: new SystemController()
};
