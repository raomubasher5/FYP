'use strict';

const config = require('../../config');

/**
 * X (Twitter) — real publishing via the X API v2 with OAuth 2.0 + PKCE.
 *
 * Setup (one time, on the user's machine):
 *   1. developer.twitter.com -> Projects & Apps -> Create app (Free tier
 *      allows 500 posts/month)
 *   2. OAuth 2.0 settings: add callback  {PUBLIC_URL}/api/auth/callback/twitter
 *   3. Put X_CLIENT_ID / X_CLIENT_SECRET in .env
 *   4. In the app: Channels -> Connect X  (user authorizes once)
 */
class XPublisher {
  constructor() {
    this.platform = 'twitter';
    this.cfg = config.social.x;
  }

  get configured() {
    return Boolean(this.cfg.clientId && this.cfg.clientSecret);
  }

  buildAuthorizeUrl(state, challenge, redirectUri) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.cfg.clientId,
      redirect_uri: redirectUri,
      scope: 'tweet.read tweet.write users.read',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256'
    });
    return `${this.cfg.authBase.replace(/\/+$/, '')}/i/oauth2/authorize?${params}`;
  }

  async exchangeCode(code, verifier, redirectUri) {
    const res = await fetch(`${this.cfg.apiBase}/2/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.cfg.clientId}:${this.cfg.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        code_verifier: verifier,
        redirect_uri: redirectUri
      })
    });
    if (!res.ok) {
      throw new Error(`X token exchange failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
    }
    const tokens = await res.json();

    // Fetch the authenticated username for the account card
    let username = 'x-account';
    try {
      const me = await fetch(`${this.cfg.apiBase}/2/users/me`, {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      if (me.ok) username = (await me.json()).data?.username || username;
    } catch (_) { /* username is cosmetic */ }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      expiresAt: Date.now() + (tokens.expires_in || 7200) * 1000,
      username
    };
  }

  /** Refresh an expired access token (X tokens live 30 days). */
  async refresh(creds) {
    const res = await fetch(`${this.cfg.apiBase}/2/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${this.cfg.clientId}:${this.cfg.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: creds.refreshToken
      })
    });
    if (!res.ok) throw new Error(`X token refresh failed (${res.status}) — reconnect the X account in Channels`);
    const tokens = await res.json();
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || creds.refreshToken,
      expiresAt: Date.now() + (tokens.expires_in || 7200) * 1000,
      username: creds.username
    };
  }

  /** Upload an image and return its media id (v1.1 media upload, base64). */
  async uploadMedia(imageUrl, accessToken) {
    const img = await fetch(imageUrl);
    if (!img.ok) throw new Error(`Could not download image for upload (${img.status})`);
    const buffer = Buffer.from(await img.arrayBuffer());
    const res = await fetch(`${this.cfg.uploadBase}/1.1/media/upload.json`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ media_data: buffer.toString('base64') })
    });
    if (!res.ok) {
      throw new Error(`X media upload failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
    }
    const data = await res.json();
    return data.data?.id || data.media_id_string || null;
  }

  async publish(content, account) {
    let creds = account.credentials;
    if (creds.expiresAt && creds.expiresAt < Date.now()) {
      creds = await this.refresh(creds);
      await require('../../repositories/AccountRepository').update(account.id, { credentials: creds });
    }

    const text = (content.text || '').slice(0, 260);
    const body = { text };

    if (content.imageUrl) {
      body.media = { media_ids: [await this.uploadMedia(content.imageUrl, creds.accessToken)] };
    }

    const res = await fetch(`${this.cfg.apiBase}/2/tweets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${creds.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      throw new Error(`X publish failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
    }
    const data = await res.json();

    return {
      platform: this.platform,
      account: creds.username,
      status: 'success',
      simulated: false,
      mode: 'live',
      platformPostId: data.data?.id || null,
      publishedAt: new Date().toISOString(),
      url: data.data?.id ? `https://x.com/${creds.username}/status/${data.data.id}` : null
    };
  }
}

module.exports = new XPublisher();
