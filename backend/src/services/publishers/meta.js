'use strict';

const config = require('../../config');

/**
 * Meta — real publishing for Facebook Pages and Instagram (Business) via
 * the Graph API. One OAuth connection covers BOTH platforms.
 *
 * Setup (one time):
 *   1. developers.facebook.com -> Create App (type: Business)
 *   2. Add products: "Facebook Login" + "Instagram Graph API"; the
 *      Instagram account must be a Business/Creator account linked to a
 *      Facebook Page you own.
 *   3. Facebook Login settings: add valid OAuth redirect URI
 *      {PUBLIC_URL}/api/auth/callback/facebook
 *   4. Put META_APP_ID / META_APP_SECRET in .env
 *   5. In the app: Channels -> Connect Facebook/Instagram
 */
class MetaPublisher {
  constructor(platform) {
    this.platform = platform; // 'facebook' | 'instagram'
    this.cfg = config.social.meta;
  }

  get graphBase() {
    return `${this.cfg.graphBase.replace(/\/+$/, '')}/${this.cfg.apiVersion}`;
  }

  get configured() {
    return Boolean(this.cfg.appId && this.cfg.appSecret);
  }

  buildAuthorizeUrl(state, redirectUri) {
    const params = new URLSearchParams({
      client_id: this.cfg.appId,
      redirect_uri: redirectUri,
      scope: 'pages_manage_posts,pages_read_engagement,pages_show_list,business_management,instagram_basic',
      state,
      response_type: 'code'
    });
    return `https://www.facebook.com/${this.cfg.apiVersion}/dialog/oauth?${params}`;
  }

  /**
   * Exchange the OAuth code for a long-lived user token, discover the
   * user's Pages, and (for Instagram) the linked Business account.
   */
  async exchangeCode(code, redirectUri) {
    const shortLived = await this._get(`/oauth/access_token`, {
      grant_type: 'fb_exchange_token',
      client_id: this.cfg.appId,
      client_secret: this.cfg.appSecret,
      fb_exchange_token: code,
      redirect_uri: redirectUri
    });
    if (!shortLived.access_token) throw new Error('Meta token exchange failed — no access token returned');

    const me = await this._get('/me', { access_token: shortLived.access_token, fields: 'id,name' });
    const pages = (await this._get('/me/accounts', {
      access_token: shortLived.access_token,
      fields: 'id,name,access_token'
    })).data || [];
    if (!pages.length) {
      throw new Error('No Facebook Page found for this account — create a Page first (pages are required for business publishing)');
    }
    const page = pages[0];

    // Try to resolve the linked Instagram Business account (a Page field)
    let instagramUserId = null;
    try {
      const ig = await this._get(`/${page.id}`, {
        access_token: shortLived.access_token,
        fields: 'instagram_business_account'
      });
      instagramUserId = ig.instagram_business_account?.id || null;
    } catch (_) { /* IG not linked — Facebook still works */ }

    return {
      pageId: page.id,
      pageName: page.name,
      pageAccessToken: page.access_token || shortLived.access_token,
      userName: me.name,
      instagramUserId
    };
  }

  async _get(path, params) {
    const res = await fetch(`${this.graphBase}${path}?${new URLSearchParams(params)}`);
    if (!res.ok) throw new Error(`Meta API error (${res.status}): ${(await res.text()).slice(0, 200)}`);
    return res.json();
  }

  async _post(path, params) {
    const res = await fetch(`${this.graphBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params)
    });
    if (!res.ok) throw new Error(`Meta API error (${res.status}): ${(await res.text()).slice(0, 200)}`);
    return res.json();
  }

  /** Facebook Page post (photo via url when an image exists). */
  async publishFacebook(content, account) {
    const params = {
      message: (content.text || '').slice(0, 1000),
      access_token: account.credentials.pageAccessToken
    };
    const result = content.imageUrl
      ? await this._post(`/me/photos`, { ...params, url: content.imageUrl })
      : await this._post(`/me/feed`, params);
    return {
      platform: 'facebook',
      account: account.credentials.pageName,
      status: 'success',
      simulated: false,
      mode: 'live',
      platformPostId: result.id || null,
      publishedAt: new Date().toISOString(),
      url: result.id ? `https://www.facebook.com/${result.id}` : null
    };
  }

  /** Instagram image post: create media container, then publish it. */
  async publishInstagram(content, account) {
    const igId = account.credentials.instagramUserId;
    if (!igId) {
      throw new Error('No Instagram Business account linked to this Facebook Page — link it in Meta Business Manager first');
    }
    const container = await this._post(`/${igId}/media`, {
      image_url: content.imageUrl,
      caption: (content.caption || '').slice(0, 2200),
      access_token: account.credentials.pageAccessToken
    });
    if (!container.id) throw new Error('Instagram container creation failed');
    const published = await this._post(`/${igId}/media_publish`, {
      creation_id: container.id,
      access_token: account.credentials.pageAccessToken
    });
    return {
      platform: 'instagram',
      account: account.credentials.pageName,
      status: 'success',
      simulated: false,
      mode: 'live',
      platformPostId: published.id || null,
      publishedAt: new Date().toISOString(),
      url: null // Graph API returns a media id, not a public URL
    };
  }

  async publish(content, account) {
    if (this.platform === 'instagram') return this.publishInstagram(content, account);
    return this.publishFacebook(content, account);
  }
}

module.exports = {
  facebook: new MetaPublisher('facebook'),
  instagram: new MetaPublisher('instagram')
};
