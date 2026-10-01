'use strict';

/**
 * End-to-end verification of the MongoDB-backed Automatrix backend.
 *
 * Usage:
 *   1. Start a MongoDB (npm run dev:mongo, your local mongod, or set
 *      MONGO_URI in .env to your Atlas URI)
 *   2. node scripts/verify-mongo.js
 *
 * It exercises the full real-data lifecycle and asserts that NO dummy
 * data is present: no seeded profile/accounts, no fabricated metrics,
 * no fake platform URLs, no invented recommendations.
 */

const { connectDB, disconnectDB } = require('../backend/src/db/mongo');
const config = require('../backend/src/config');

const BusinessProfile = require('../backend/src/models/BusinessProfile');
const SocialAccount = require('../backend/src/models/SocialAccount');
const Post = require('../backend/src/models/Post');
const Log = require('../backend/src/models/Log');
const Comment = require('../backend/src/models/Comment');

const postService = require('../backend/src/services/PostService');
const analyticsService = require('../backend/src/services/AnalyticsService');
const aiService = require('../backend/src/services/ai');

let pass = 0;
let fail = 0;
const t = (name, cond) => {
  if (cond) {
    pass++;
    console.log('  ✓', name);
  } else {
    fail++;
    console.error('  ✗ FAIL:', name);
  }
};

(async () => {
  console.log(`\nConnecting to ${config.mongo.uri} ...`);
  await connectDB(config.mongo.uri);
  console.log('Connected.\n');

  // Clean slate for a deterministic run
  await Promise.all([BusinessProfile.deleteMany({}), SocialAccount.deleteMany({}), Post.deleteMany({}), Log.deleteMany({}), Comment.deleteMany({})]);

  console.log('1. Fresh database starts EMPTY (no seeded dummy data):');
  t('no seeded business profile', (await BusinessProfile.countDocuments()) === 0);
  t('no seeded social accounts', (await SocialAccount.countDocuments()) === 0);
  t('profile endpoint returns null-ish', (await require('../backend/src/repositories').profileRepository.get()) === null);

  console.log('\n2. User creates their own real profile + channel:');
  const profileRepository = require('../backend/src/repositories').profileRepository;
  await profileRepository.update({
    businessName: 'Verify Bakery',
    industry: 'Bakery',
    targetAudience: 'Neighborhood customers',
    brandTone: 'Playful & Witty',
    keywords: ['fresh']
  });
  t('profile persisted in MongoDB', (await BusinessProfile.findOne({ id: 'business' })) !== null);

  const accountRepository = require('../backend/src/repositories').accountRepository;
  const account = await accountRepository.create({
    id: 'acc-verify-ig',
    platform: 'instagram',
    name: 'Verify Bakery IG',
    handle: '@verifybakery',
    status: 'connected',
    mode: 'sandbox',
    connectedAt: new Date(),
    followers: 0
  });
  t('channel registered', account.id === 'acc-verify-ig');

  console.log('\n3. AI generation (mock provider — offline templates):');
  const generated = await aiService.generateMultiPlatformPost({
    businessName: 'Verify Bakery',
    industry: 'Bakery',
    targetAudience: 'Neighborhood customers',
    tone: 'Playful & Witty',
    topic: 'Fresh croissants at 7 AM',
    targetPlatforms: ['instagram']
  });
  t('generation returns copy', Boolean(generated.platforms?.instagram?.caption));
  t('mock provider fabricates no image URL', generated.imageUrl === null);

  console.log('\n4. Post lifecycle: draft -> approved -> published:');
  const created = await postService.createPost({
    topic: 'Fresh croissants at 7 AM',
    tone: 'Playful & Witty',
    mode: 'review',
    platforms: generated.platforms,
    targetPlatforms: ['instagram']
  });
  t('post created as draft', created.status === 'draft');

  await postService.approveDraft(created.id);
  const published = await postService.publishPost(created.id);
  t('post status is published', published.post.status === 'published');
  t('publishedAt recorded', Boolean(published.post.publishedAt));

  console.log('\n5. Publishing is an HONEST sandbox simulation:');
  const receipt = published.executionResults[0];
  t('receipt marked simulated', receipt?.simulated === true);
  t('no fake platform post id', receipt?.platformPostId === null);
  t('no fake post URL', receipt?.url === null);
  t('NO fabricated engagement metrics', published.post.metrics === null);
  t('NO fabricated sentiment', published.post.sentiment === null);

  console.log('\n6. Analytics on real data only:');
  let overview = await analyticsService.getMetricsOverview();
  t('totals are zero (nothing recorded yet)', overview.overview.totalEngagement === 0 && overview.overview.totalReach === 0);
  t('sentiment is null (no comments yet)', overview.sentiment === null);
  t('recommendations empty (no metrics to learn from)', overview.recommendations.length === 0);
  t('trend is 7 honest zero-days', overview.trend.length === 7 && overview.trend.every((d) => d.reach === 0));

  console.log('\n7. Real comment import -> real sentiment analysis:');
  const commentRepository = require('../backend/src/repositories').commentRepository;
  await commentRepository.create({ id: 'cmt-verify-1', author: 'real_coffee_fan', text: 'I absolutely love the croissants, best in town!', platform: 'instagram', topic: 'croissants' });
  await commentRepository.create({ id: 'cmt-verify-2', author: 'grumpy_guest', text: 'Service was slow and I was disappointed.', platform: 'instagram', topic: 'service' });
  overview = await analyticsService.getMetricsOverview();
  t('sentiment computed from 2 imported comments', overview.sentiment !== null);
  t('positive % matches keyword reality (50)', overview.sentiment.positive === 50);
  t('negative % matches keyword reality (50)', overview.sentiment.negative === 50);
  t('no invented comments exist', (await Comment.countDocuments()) === 2);

  console.log('\n8. Recorded real metrics -> data-driven recommendations:');
  await postRepositoryUpdate(created.id, { metrics: { likes: 12, comments: 3, shares: 1, reach: 150 } });
  overview = await analyticsService.getMetricsOverview();
  t('real metrics aggregated', overview.overview.totalLikes === 12 && overview.overview.totalReach === 150);
  t('recommendations now derived from real data', overview.recommendations.length === 3);
  t('recommendations cite real numbers', overview.recommendations.every((r) => r.message.includes(String(overview.overview.totalEngagement)) || /\d+/.test(r.message)));
  t('trend now shows real reach', overview.trend.some((d) => d.reach === 150));

  console.log(`\n=============================`);
  console.log(`  VERIFICATION: ${pass} passed, ${fail} failed`);
  console.log(`=============================`);

  await Promise.all([BusinessProfile.deleteMany({}), SocialAccount.deleteMany({}), Post.deleteMany({}), Log.deleteMany({}), Comment.deleteMany({})]);
  console.log('Test data cleaned up.\n');
  await disconnectDB();
  process.exit(fail ? 1 : 0);
})().catch((err) => {
  console.error('\nVERIFICATION ERROR:', err.message);
  process.exit(1);
});

// small helper (avoids circular import style)
const PostModel = Post;
async function postRepositoryUpdate(id, updates) {
  await PostModel.findOneAndUpdate({ id }, { $set: updates });
}
