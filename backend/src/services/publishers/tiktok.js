'use strict';

const config = require('../../config');

/**
 * TikTok — real publishing via the Content Posting API (Direct Post).
 *
 * Setup (one time):
 *   1. developers.tiktok.com -> Create Client
 *   2. Request the "Direct Post" capability for your client
 *   3. Add redirect URI {PUBLIC_URL}/api/auth/callback/tiktok
 *   4. Put TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET in .env
 *   5. In the app: Channels -> Connect TikTok
 */
class TikTokPublisher {
  constructor() {
    this.platform = 'tiktok';
    this.cfg = config.social.tiktok;
  }

  get configured() {
    return Boolean(this.cfg.clientKey && this.cfg.clientSecret);
  }

  buildAuthorizeUrl(state, redirectUri) {
    const params = new URLSearchParams({
      client_key: this.cfg.clientKey,
      scope: 'user.info.basic,video.publish',
      redirect_uri: redirectUri,
      response_type: 'code',
      state
    });
    return `https://www.tiktok.com/v2/auth/authorize/?${params}`;
  }

  async exchangeCode(code, redirectUri) {
    const res = await fetch(`${this.cfg.apiBase}/v2/oauth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: this.cfg.clientKey,
        client_secret: this.cfg.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });
    if (!res.ok) throw new Error(`TikTok token exchange failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
    const raw = await res.json();
    const data = raw.data || raw; // v2 wraps payloads in { data: {...} }
    if (raw.error_description) throw new Error(`TikTok auth failed: ${raw.error_description}`);
    if (!data.access_token) throw new Error('TikTok token exchange failed — no access token returned');

    let username = 'tiktok-account';
    try {
      const me = await fetch(`${this.cfg.apiBase}/v2/user/info/?fields=id,username`, {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });
      if (me.ok) username = (await me.json()).data?.user?.username || username;
    } catch (_) { /* username is cosmetic */ }

    return {
      accessToken: data.access_token,
      openId: data.open_id,
      username,
      expiresAt: Date.now() + (data.expires_in || 86400) * 1000
    };
  }

  /**
   * Direct Post: TikTok pulls the media from the URL (images are accepted
   * and auto-converted). Runs asynchronously on TikTok's side — the
   * returned post id can be polled later for final status.
   */
  async publish(content, account) {
    const creds = account.credentials;
    const title = (content.caption || content.text || '').slice(0, 2200);

    const res = await fetch(`${this.cfg.apiBase}/v2/post/publish/video/init/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        post_info: {
          title,
          privacy_level: 'PUBLIC_TO_EVERYONE',
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_data: content.imageUrl
            ? { source: 'PULL_FROM_URL', video_url: content.imageUrl }
            : undefined
        }
      })
    });
    if (!res.ok) throw new Error(`TikTok publish failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    if (data.error) throw new Error(`TikTok publish failed: ${data.error.description || data.error.code}`);

    return {
      platform: this.platform,
      account: creds.username,
      status: 'success',
      simulated: false,
      mode: 'live',
      platformPostId: data.data?.publish_id || null,
      publishedAt: new Date().toISOString(),
      url: null // TikTok posts process asynchronously; publish_id is the reference
    };
  }
}

module.exports = new TikTokPublisher();
