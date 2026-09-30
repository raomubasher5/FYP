'use strict';

const { profileRepository, logRepository } = require('../repositories');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * ProfileController — business profile + AI provider configuration.
 */
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

module.exports = new ProfileController();
