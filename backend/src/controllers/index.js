'use strict';

/**
 * Controller aggregator — one dedicated controller class per resource.
 *
 *   POSTS      -> ./PostController
 *   PROFILE    -> ./ProfileController
 *   ACCOUNTS   -> ./AccountController
 *   ANALYTICS  -> ./AnalyticsController
 *   SYSTEM     -> ./SystemController
 */

module.exports = {
  postController: require('./PostController'),
  profileController: require('./ProfileController'),
  accountController: require('./AccountController'),
  analyticsController: require('./AnalyticsController'),
  systemController: require('./SystemController')
};
