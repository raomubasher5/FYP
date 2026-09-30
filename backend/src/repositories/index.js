'use strict';

/**
 * Repository aggregator — one dedicated DAO module per collection.
 *
 *   POSTS      -> ./PostRepository
 *   ACCOUNTS   -> ./AccountRepository
 *   PROFILE    -> ./ProfileRepository
 *   LOGS       -> ./LogRepository
 *   COMMENTS   -> ./CommentRepository
 */

module.exports = {
  postRepository: require('./PostRepository'),
  accountRepository: require('./AccountRepository'),
  profileRepository: require('./ProfileRepository'),
  logRepository: require('./LogRepository'),
  commentRepository: require('./CommentRepository')
};
