'use strict';

const { logRepository, commentRepository } = require('../repositories');
const postRepository = require('../repositories/PostRepository');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const OllamaProvider = require('../services/ai/OllamaProvider');
const config = require('../config');

/**
 * SystemController — operational endpoints: audit logs and workspace reset.
 */
class SystemController {
  getLogs = asyncHandler(async (req, res) => {
    const logs = await logRepository.findAll();
    return ApiResponse.success(res, logs);
  });

  /** List the LLM models the user has pulled in Ollama (proxies GET /api/tags). */
  getOllamaModels = asyncHandler(async (req, res) => {
    const url = String(req.query.url || '').trim();
    if (!url) throw new AppError('url query parameter is required (Ollama base URL)', 400);
    const ollama = new OllamaProvider(url, config.ai.ollamaModel || 'llama3.1');
    const models = await ollama.listModels();
    return ApiResponse.success(res, { baseUrl: ollama.baseUrl, models }, 'Ollama models detected on your machine');
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

module.exports = new SystemController();
