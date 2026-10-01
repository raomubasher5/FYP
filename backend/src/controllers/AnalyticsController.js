'use strict';

const { commentRepository, logRepository } = require('../repositories');
const analyticsService = require('../services/AnalyticsService');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * AnalyticsController — metrics overview (computed from REAL data only)
 * and real audience comment import for sentiment analysis.
 */
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

module.exports = new AnalyticsController();
