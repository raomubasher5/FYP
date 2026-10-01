const path = require('path');

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'mock', // 'mock' | 'contextual' | 'gemini' | 'groq' | 'ollama'
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    groqApiKey: process.env.GROQ_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    // Ollama — local models running on the user's PC (no API key, no internet)
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3.1',
    defaultModel: process.env.AI_MODEL || 'mock-model'
  },
  scheduler: {
    intervalMs: parseInt(process.env.SCHEDULER_INTERVAL_MS || '4000', 10),
    maxRetries: 3
  },
  mongo: {
    // Point this at your real database:
    //  - Local:  mongodb://127.0.0.1:27017/automatrix   (npm run dev:mongo starts one)
    //  - Atlas:  mongodb+srv://<user>:<pass>@cluster.x.mongodb.net/automatrix
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/automatrix'
  },
  // Public URL of the Express server (where OAuth redirects must land)
  publicUrl: (process.env.PUBLIC_URL || 'http://localhost:3000').replace(/\/+$/, ''),
  social: {
    // X (Twitter) — create a free app at developer.twitter.com
    x: {
      clientId: process.env.X_CLIENT_ID || '',
      clientSecret: process.env.X_CLIENT_SECRET || '',
      authBase: process.env.X_AUTH_BASE || 'https://x.com',
      apiBase: process.env.X_API_BASE || 'https://api.twitter.com',
      uploadBase: process.env.X_UPLOAD_BASE || 'https://upload.twitter.com'
    },
    // Meta (Facebook + Instagram) — create an app at developers.facebook.com
    meta: {
      appId: process.env.META_APP_ID || '',
      appSecret: process.env.META_APP_SECRET || '',
      graphBase: process.env.META_GRAPH_BASE || 'https://graph.facebook.com',
      apiVersion: process.env.META_API_VERSION || 'v19.0'
    },
    // TikTok — create a client at developers.tiktok.com
    tiktok: {
      clientKey: process.env.TIKTOK_CLIENT_KEY || '',
      clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
      apiBase: process.env.TIKTOK_API_BASE || 'https://open.tiktokapis.com'
    }
  },
  paths: {
    clientDist: path.join(__dirname, '../../../client/dist')
  }
};

module.exports = config;
