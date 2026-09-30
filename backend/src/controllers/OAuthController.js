'use strict';

const { accountRepository } = require('../repositories');
const publishingManager = require('../services/publishers');
const oauthState = require('../services/publishers/oauth');
const config = require('../config');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const CALLBACK_PATH = '/api/auth/callback';
const PLATFORM_LABELS = {
  twitter: 'X (Twitter)',
  facebook: 'Facebook Page',
  instagram: 'Instagram Business',
  tiktok: 'TikTok'
};

/**
 * OAuthController — connect a real platform account (OAuth 2.0), exchange
 * the code for tokens, and store the credentials on the SocialAccount.
 */
class OAuthController {
  /** GET /api/accounts/:platform/connect -> 302 to the platform's consent screen */
  startConnect = asyncHandler(async (req, res) => {
    const platform = req.params.platform;
    const connector = publishingManager.oauth[platform];
    if (!connector) throw new AppError(`Platform not supported for live connection: ${platform}`, 400);
    if (!connector.configured) {
      throw new AppError(
        `${PLATFORM_LABELS[platform] || platform} app credentials are not configured. ` +
        (platform === 'twitter' && 'Set X_CLIENT_ID and X_CLIENT_SECRET in .env (create a free app at developer.twitter.com). ' +
         platform === 'facebook' && 'Set META_APP_ID and META_APP_SECRET in .env (create an app at developers.facebook.com). ' +
         platform === 'instagram' && 'Set META_APP_ID and META_APP_SECRET in .env (same Meta app as Facebook). ' +
         platform === 'tiktok' && 'Set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET in .env (create a client at developers.tiktok.com).'),
        400
      );
    }

    const redirectUri = `${config.publicUrl}${CALLBACK_PATH}/${platform}`;
    const { state, challenge } = oauthState.start(platform);

    let authorizeUrl;
    if (platform === 'twitter') authorizeUrl = connector.buildAuthorizeUrl(state, challenge, redirectUri);
    else if (platform === 'tiktok') authorizeUrl = connector.buildAuthorizeUrl(state, redirectUri);
    else authorizeUrl = connector.buildAuthorizeUrl(state, redirectUri);

    res.redirect(authorizeUrl);
  });

  /** GET /api/auth/callback/:platform?code=...&state=... -> store tokens, return to app */
  callback = asyncHandler(async (req, res) => {
    const platform = req.params.platform;
    const { code, state, error } = req.query;
    const backTo = (qs) => res.redirect(`${config.publicUrl}/channels?${qs}`);

    if (error) return backTo(`connect_error=${encodeURIComponent(`${PLATFORM_LABELS[platform] || platform} denied: ${error}`)}`);
    if (!code) return backTo(`connect_error=${encodeURIComponent('Missing authorization code from ' + (PLATFORM_LABELS[platform] || platform))}`);

    const flow = oauthState.consume(state);
    if (!flow || flow.platform !== platform) {
      return backTo(`connect_error=${encodeURIComponent('OAuth state mismatch or expired — please try connecting again')}`);
    }

    const connector = publishingManager.oauth[platform];
    const redirectUri = `${config.publicUrl}${CALLBACK_PATH}/${platform}`;

    try {
      let creds;
      let handle;
      let name;

      if (platform === 'twitter') {
        creds = await connector.exchangeCode(code, flow.verifier, redirectUri);
        handle = creds.username;
        name = `X @${creds.username}`;
      } else if (platform === 'tiktok') {
        creds = await connector.exchangeCode(code, redirectUri);
        handle = creds.username;
        name = `TikTok @${creds.username}`;
      } else {
        creds = await connector.exchangeCode(code, redirectUri);
        handle = creds.pageName;
        name = `FB Page: ${creds.pageName}`;
      }

      // Upsert: one live account per platform (reconnect refreshes tokens)
      const existing = await accountRepository.findByPlatform(platform);
      const account = existing
        ? await accountRepository.update(existing.id, { mode: 'live', status: 'connected', handle, name, credentials: creds })
        : await accountRepository.create({
            id: `acc-${platform}-${Date.now()}`,
            platform,
            name,
            handle,
            status: 'connected',
            mode: 'live',
            connectedAt: new Date(),
            followers: 0,
            avatar: '',
            credentials: creds
          });

      return backTo(`connected=${platform}&handle=${encodeURIComponent(handle || account.handle)}`);
    } catch (err) {
      return backTo(`connect_error=${encodeURIComponent(err.message)}`);
    }
  });

  /** GET /api/accounts/live-status -> which platforms are ready for live */
  liveStatus = asyncHandler(async (req, res) => {
    const accounts = await accountRepository.findAll();
    const status = { twitter: false, facebook: false, instagram: false, tiktok: false };
    accounts.forEach((a) => {
      if (a.mode === 'live' && a.credentials && status.hasOwnProperty(a.platform)) {
        status[a.platform] = true;
      }
    });
    return ApiResponse.success(res, status, 'Live connection status');
  });
}

module.exports = new OAuthController();
