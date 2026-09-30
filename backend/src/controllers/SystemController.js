'use strict';

const { logRepository, commentRepository } = require('../repositories');
const postRepository = require('../repositories/PostRepository');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * SystemController — operational endpoints: audit logs and workspace reset.
 */
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

module.exports = new SystemController();
