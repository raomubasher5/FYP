const postService = require('../services/PostService');
const aiService = require('../services/ai');
const { profileRepository, logRepository } = require('../repositories');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

class PostController {
  getAll = asyncHandler(async (req, res) => {
    const posts = postService.getAllPosts(req.query.status);
    return ApiResponse.success(res, posts, 'Posts retrieved successfully');
  });

  getById = asyncHandler(async (req, res) => {
    const post = postService.getPostById(req.params.id);
    return ApiResponse.success(res, post);
  });

  create = asyncHandler(async (req, res) => {
    const created = postService.createPost(req.body);
    return ApiResponse.created(res, created, 'Post created successfully');
  });

  update = asyncHandler(async (req, res) => {
    const updated = postService.updatePost(req.params.id, req.body);
    return ApiResponse.success(res, updated, 'Post updated successfully');
  });

  delete = asyncHandler(async (req, res) => {
    postService.deletePost(req.params.id);
    return ApiResponse.success(res, null, 'Post deleted successfully');
  });

  approve = asyncHandler(async (req, res) => {
    const approved = postService.approveDraft(req.params.id);
    return ApiResponse.success(res, approved, 'Draft approved and queued for scheduling');
  });

  publishNow = asyncHandler(async (req, res) => {
    const result = await postService.publishPost(req.params.id);
    return ApiResponse.success(res, result.post, 'Post dispatched successfully');
  });

  generate = asyncHandler(async (req, res) => {
    const profile = profileRepository.get();
    const { topic, tone, targetPlatforms } = req.body;

    const generated = await aiService.generateMultiPlatformPost({
      businessName: profile.businessName,
      industry: profile.industry,
      targetAudience: profile.targetAudience,
      tone: tone || profile.brandTone,
      topic,
      targetPlatforms: targetPlatforms || profile.targetPlatforms
    });

    logRepository.create(`[AI Generator] Created tailored copy for topic: "${topic || 'Untitled'}" via ${generated.provider}`);
    return ApiResponse.success(res, generated, 'AI generation complete');
  });
}

module.exports = new PostController();
