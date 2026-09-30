'use strict';

/*
 * E2E test: REAL platform integration against mock platform servers.
 * Proves: OAuth connect round-trip (X PKCE, Meta, TikTok), credential
 * storage, LIVE dispatch (real HTTP to platform APIs) and sandbox
 * dispatch (zero external calls).
 */

const http = require('http');

let passed = 0;
let failed = 0;
function assert(cond, name) {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.error(`  FAIL  ${name}`);
  }
}

function mockServer(routes) {
  const hits = {};
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const key = `${req.method} ${req.url.split('?')[0]}`;
      const url = new URL(req.url, 'http://x');
      const form = Object.fromEntries(new URLSearchParams(body));
      let json;
      try { json = body ? JSON.parse(body) : {}; } catch { json = {}; }
      const record = {
        path: req.url,
        form,
        json,
        auth: req.headers.authorization || '',
        query: Object.fromEntries(url.searchParams)
      };
      const handler = routes[req.method + ' ' + req.url.split('?')[0]] || routes['*'];
      if (handler) {
        const out = handler(record);
        if (Buffer.isBuffer(out)) { res.end(out); }
        else if (out === '__RAW__') { /* handler wrote directly */ }
        else { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(out)); }
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'no mock route: ' + key }));
      }
      hits[key] = (hits[key] || 0) + 1;
      hits[`last:${key}`] = record;
    });
  });
  return { server, hits };
}

async function main() {
  // ---------- Mock platform servers ----------
  const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
const xMock = mockServer({
    'POST /2/oauth2/token': () => ({ access_token: 'AT_X', token_type: 'Bearer', expires_in: 7200, refresh_token: 'RT_X' }),
    'GET /2/users/me': () => ({ data: { id: '123', username: 'testuser' } }),
    'POST /1.1/media/upload.json': () => ({ data: { id: 'media_123', media_key: 'mk_1' } }),
    'POST /2/tweets': () => ({ data: { id: 'tw_999', text: 'posted' } }),
    'GET /img.jpg': (r) => PNG
  });
  const mMock = mockServer({
    'GET /v19.0/oauth/access_token': (r) => (r.query.grant_type === 'fb_exchange_token' ? { access_token: 'PT_META', token_type: 'bearer' } : { error: 'bad' }),
    'GET /v19.0/me': () => ({ id: 'u1', name: 'Test User' }),
    'GET /v19.0/me/accounts': () => ({ data: [{ id: 'pg_1', name: 'My Page' }] }),
    'GET /v19.0/pg_1': () => ({ id: 'pg_1', instagram_business_account: { id: 'ig_1' } }),
    'POST /v19.0/ig_1/media': () => ({ id: 'cm_1' }),
    'POST /v19.0/ig_1/media_publish': () => ({ id: 'ig_post_1' }),
    'POST /v19.0/me/feed': () => ({ id: 'fb_post_1' }),
    'POST /v19.0/me/photos': () => ({ id: 'fb_photo_1' })
  });
  const tMock = mockServer({
    'POST /v2/oauth/token/': () => ({ data: { open_id: 'op_1', access_token: 'TT_AT', scope: 'user.info.basic,video.publish' } }),
    'GET /v2/user/info/': () => ({ data: { user: { open_id: 'op_1', username: 'ttuser' } } }),
    'POST /v2/post/publish/video/init/': () => ({ data: { publish_id: 'pub_1' }, error_code: 0, status: 'ok' })
  });

  await Promise.all([xMock, mMock, tMock].map((m) => new Promise((r) => m.server.listen(0, '127.0.0.1', r))));
  const XP = xMock.server.address().port;
  const MP = mMock.server.address().port;
  const TP = tMock.server.address().port;

  // ---------- Boot the app with env pointing at mocks ----------
  process.env.MONGO_URI = 'mongodb://127.0.0.1:1/nope';
  process.env.X_CLIENT_ID = 'x_id';
  process.env.X_CLIENT_SECRET = 'x_secret';
  process.env.X_API_BASE = `http://127.0.0.1:${XP}`;
  process.env.X_UPLOAD_BASE = `http://127.0.0.1:${XP}`;
  process.env.META_APP_ID = 'm_id';
  process.env.META_APP_SECRET = 'm_secret';
  process.env.META_GRAPH_BASE = `http://127.0.0.1:${MP}`;
  process.env.TIKTOK_CLIENT_KEY = 't_key';
  process.env.TIKTOK_CLIENT_SECRET = 't_secret';
  process.env.TIKTOK_API_BASE = `http://127.0.0.1:${TP}`;

  const app = require('/home/user/FYP/backend/src/app.js');
  const { accountRepository, postRepository, logRepository } = require('/home/user/FYP/backend/src/repositories');

  // In-memory stand-ins for Mongo (no DB in sandbox)
  const store = { accounts: [], logs: [] };
  accountRepository.findByPlatform = async (p) => store.accounts.find((a) => a.platform === p) || null;
  accountRepository.findAll = async () => store.accounts;
  accountRepository.findConnected = async () => store.accounts.filter((a) => a.status === 'connected');
  accountRepository.findById = async (id) => store.accounts.find((a) => a.id === id) || null;
  accountRepository.create = async (d) => {
    const a = { ...d };
    store.accounts.push(a);
    return a;
  };
  accountRepository.update = async (id, patch) => {
    const a = store.accounts.find((x) => x.id === id);
    Object.assign(a, patch);
    return a;
  };
  accountRepository.delete = async (id) => {
    const i = store.accounts.findIndex((a) => a.id === id);
    if (i >= 0) store.accounts.splice(i, 1);
    return true;
  };
  logRepository.create = async (m) => {
    store.logs.push(m);
    return {};
  };

  const fakePost = {
    id: 'p1',
    status: 'approved',
    topic: 'test topic',
    targetPlatforms: ['twitter'],
    platforms: { twitter: { text: 'Hello real world from LIVE test' } },
    imageUrl: `http://127.0.0.1:${XP}/img.jpg`,
    publishedAt: null,
    executionResults: []
  };
  postRepository.findById = async () => fakePost;
  postRepository.update = async (id, patch) => Object.assign(fakePost, patch);

  await new Promise((r) => (app._server = app.listen(0, '127.0.0.1', r)));
  const APP = `http://127.0.0.1:${app._server.address().port}`;
  const config = require('/home/user/FYP/backend/src/config');
  config.publicUrl = APP; // config object is shared by reference with controllers

  const follow = async (url) => {
    const r = await fetch(url, { redirect: 'manual' });
    return { status: r.status, loc: r.headers.get('location'), body: await r.json().catch(() => null) };
  };

  // ============ 1. X (Twitter) OAuth round-trip (PKCE) ============
  console.log('\n[1] X OAuth connect round-trip');
  let r = await follow(`${APP}/api/accounts/twitter/connect`);
  assert(r.status === 302 && r.loc.includes('/i/oauth2/authorize'), 'connect -> 302 to X authorize');
  const xAuth = new URL(r.loc);
  const xState = xAuth.searchParams.get('state');
  assert(!!xState && !!xAuth.searchParams.get('code_challenge'), 'PKCE state + code_challenge present');
  assert(xAuth.searchParams.get('redirect_uri') === `${APP}/api/auth/callback/twitter`, 'correct redirect_uri');

  r = await follow(`${APP}/api/auth/callback/twitter?code=CODE_X&state=${xState}`);
  assert(r.status === 302 && r.loc.includes('/channels?connected=twitter'), 'callback -> 302 back to app');
  const xTok = xMock.hits['last:POST /2/oauth2/token'];
  assert(xTok && xTok.form.code === 'CODE_X', 'X token exchange called with code');
  const basic = Buffer.from((xTok.auth||'').replace('Basic ',''),'base64').toString();
assert(xTok && xTok.form.code_verifier && basic === 'x_id:x_secret', 'PKCE verifier sent + client credentials (Basic auth) correct');
  const xAcc = store.accounts.find((a) => a.platform === 'twitter');
  assert(xAcc && xAcc.mode === 'live' && xAcc.credentials.accessToken === 'AT_X', 'X account stored live w/ tokens');
  assert(xAcc && xAcc.handle === 'testuser', 'X username resolved');

  // ============ 2. Facebook OAuth round-trip ============
  console.log('\n[2] Facebook OAuth connect round-trip');
  r = await follow(`${APP}/api/accounts/facebook/connect`);
  assert(r.status === 302 && r.loc.includes('facebook.com') && r.loc.includes('dialog/oauth'), 'connect -> 302 to FB dialog');
  const fbState = new URL(r.loc).searchParams.get('state');
  assert(r.loc.includes('pages_manage_posts'), 'correct FB scopes');

  r = await follow(`${APP}/api/auth/callback/facebook?code=CODE_FB&state=${fbState}`);
  assert(r.status === 302 && r.loc.includes('/channels?connected=facebook'), 'callback -> 302 back to app');
  const fbTok = mMock.hits['last:GET /v19.0/oauth/access_token'];
  assert(fbTok && fbTok.query.grant_type === 'fb_exchange_token', 'fb_exchange_token called');
  const fbAcc = store.accounts.find((a) => a.platform === 'facebook');
  assert(fbAcc && fbAcc.credentials.pageId === 'pg_1' && fbAcc.credentials.pageAccessToken === 'PT_META', 'FB page discovered + stored');
  assert(fbAcc && fbAcc.credentials.instagramUserId === 'ig_1', 'linked IG Business account discovered');

  // ============ 3. Instagram OAuth round-trip (same Meta app) ============
  console.log('\n[3] Instagram OAuth connect round-trip');
  r = await follow(`${APP}/api/accounts/instagram/connect`);
  const igState = new URL(r.loc).searchParams.get('state');
  r = await follow(`${APP}/api/auth/callback/instagram?code=CODE_IG&state=${igState}`);
  const igAcc = store.accounts.find((a) => a.platform === 'instagram');
  assert(r.status === 302 && r.loc.includes('/channels?connected=instagram'), 'callback -> 302 back to app');
  assert(igAcc && igAcc.mode === 'live' && igAcc.credentials.pageId === 'pg_1', 'IG account stored live');

  // ============ 4. TikTok OAuth round-trip ============
  console.log('\n[4] TikTok OAuth connect round-trip');
  r = await follow(`${APP}/api/accounts/tiktok/connect`);
  const ttState = new URL(r.loc).searchParams.get('state');
  r = await follow(`${APP}/api/auth/callback/tiktok?code=CODE_TT&state=${ttState}`);
  const ttAcc = store.accounts.find((a) => a.platform === 'tiktok');
  assert(r.status === 302 && r.loc.includes('/channels?connected=tiktok'), 'callback -> 302 back to app');
  assert(tMock.hits['last:POST /v2/oauth/token/'].form.code === 'CODE_TT', 'TikTok token exchange called');
  assert(ttAcc && ttAcc.mode === 'live' && ttAcc.credentials.accessToken === 'TT_AT', 'TikTok account stored live');
  assert(ttAcc && ttAcc.handle === 'ttuser', 'TikTok username resolved');

  // ============ 5. live-status endpoint ============
  r = await follow(`${APP}/api/accounts/live-status`);
  assert(r.status === 200 && r.body.data.twitter && r.body.data.facebook && r.body.data.instagram && r.body.data.tiktok, 'live-status reports all 4 live');

  // ============ 6. LIVE dispatch -> real HTTP to X (with media) ============
  console.log('\n[6] LIVE dispatch -> real X API');
  const preTweets = xMock.hits['POST /2/tweets'] || 0;
  const preMedia = xMock.hits['POST /1.1/media/upload.json'] || 0;
  const pub = await fetch(`${APP}/api/posts/p1/publish-now`, { method: 'POST' });
  const pubBody = await pub.json();
  assert(pub.status === 200 && pubBody.message.includes('LIVE'), 'publish-now reports LIVE publish');
  const tw = xMock.hits['last:POST /2/tweets'];
  assert(xMock.hits['POST /2/tweets'] === preTweets + 1, 'X /2/tweets called');
  assert(tw && tw.json.text === 'Hello real world from LIVE test', 'tweet body correct');
  assert(tw && tw.json.media && tw.json.media.media_ids.includes('media_123'), 'media attached to tweet');
  assert(xMock.hits['POST /1.1/media/upload.json'] === preMedia + 1, 'media upload called first');
  assert(tw && tw.auth === 'Bearer AT_X', 'stored access token used');
  const twResult = pubBody.data.executionResults.find((e) => e.platform === 'twitter');
  assert(twResult && twResult.simulated === false && twResult.platformPostId === 'tw_999' && twResult.mode === 'live', 'receipt: simulated=false, real post id');

  // ============ 7. LIVE dispatch -> real TikTok API ============
  console.log('\n[7] LIVE dispatch -> real TikTok API');
  const preTTInit = tMock.hits['POST /v2/post/publish/video/init/'] || 0;
  Object.assign(fakePost, {
    targetPlatforms: ['tiktok'],
    platforms: { tiktok: { text: 'tt caption' } },
    imageUrl: 'https://cdn.example.com/video.mp4'
  });
  const pub2 = await fetch(`${APP}/api/posts/p1/publish-now`, { method: 'POST' });
  const pub2Body = await pub2.json();
  const init = tMock.hits['last:POST /v2/post/publish/video/init/'];
  assert(tMock.hits['POST /v2/post/publish/video/init/'] === preTTInit + 1, 'TikTok video init called');
  assert(init && init.json.post_info.video_data.source === 'PULL_FROM_URL', 'PULL_FROM_URL source');
  assert(pub2Body.data.executionResults.find((e) => e.platform === 'tiktok').simulated === false, 'tiktok receipt live');

  // ============ 8. LIVE dispatch -> real Instagram container flow ============
  console.log('\n[8] LIVE dispatch -> real Instagram API');
  const preCm = mMock.hits['POST /v19.0/ig_1/media'] || 0;
  const preMp = mMock.hits['POST /v19.0/ig_1/media_publish'] || 0;
  Object.assign(fakePost, {
    targetPlatforms: ['instagram'],
    platforms: { instagram: { text: 'ig caption' } },
    imageUrl: 'https://cdn.example.com/photo.jpg'
  });
  const pub3 = await fetch(`${APP}/api/posts/p1/publish-now`, { method: 'POST' });
  const pub3Body = await pub3.json();
  assert(mMock.hits['POST /v19.0/ig_1/media'] === preCm + 1 && mMock.hits['POST /v19.0/ig_1/media_publish'] === preMp + 1, 'IG container + media_publish called');
  assert(pub3Body.data.executionResults.find((e) => e.platform === 'instagram').simulated === false, 'IG receipt live');

  // ============ 9. SANDBOX dispatch -> ZERO external calls ============
  console.log('\n[9] SANDBOX dispatch -> no external calls');
  const liveTt = store.accounts.find((a) => a.platform === 'tiktok' && a.mode === 'live');
  store.accounts = store.accounts.filter((a) => a !== liveTt); // remove live tiktok
  store.accounts.push({ id: 'acc-tt-sbx', platform: 'tiktok', mode: 'sandbox', status: 'connected', handle: '@sandbox', name: 'Sandbox TT', credentials: undefined });
  const preTTInit2 = tMock.hits['POST /v2/post/publish/video/init/'] || 0;
  Object.assign(fakePost, { targetPlatforms: ['tiktok'], platforms: { tiktok: { text: 'sbx' } }, imageUrl: null });
  const pub4 = await fetch(`${APP}/api/posts/p1/publish-now`, { method: 'POST' });
  const pub4Body = await pub4.json();
  assert(tMock.hits['POST /v2/post/publish/video/init/'] === preTTInit2, 'NO TikTok API call for sandbox account');
  const sbxResult = pub4Body.data.executionResults.find((e) => e.platform === 'tiktok');
  assert(sbxResult && sbxResult.simulated === true, 'receipt clearly labeled simulated');
  assert(store.logs.some((l) => l.includes('Sandbox dispatch')), 'honest sandbox log written');

  // ============ 10. setMode guard ============
  console.log('\n[10] setMode guard (live without credentials rejected)');
  const g = await fetch(`${APP}/api/accounts/acc-tt-sbx/mode`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ mode: 'live' })
  });
  assert(g.status === 400, 'live without credentials -> 400');

  // ============ 11. stale state rejected ============
  console.log('\n[11] OAuth state replay rejected');
  r = await follow(`${APP}/api/auth/callback/twitter?code=CODE_X&state=${xState}`);
  assert(r.status === 302 && r.loc.includes('connect_error'), 'replayed state -> connect_error');

  app._server.close();
  xMock.server.close();
  mMock.server.close();
  tMock.server.close();

  console.log(`\n===== RESULT: ${passed} passed, ${failed} failed =====`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error('TEST CRASH:', e);
  process.exit(1);
});
