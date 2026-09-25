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
    provider: process.env.AI_PROVIDER || 'mock', // 'mock' | 'gemini' | 'groq' | 'openai'
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    groqApiKey: process.env.GROQ_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    defaultModel: process.env.AI_MODEL || 'mock-model'
  },
  scheduler: {
    intervalMs: parseInt(process.env.SCHEDULER_INTERVAL_MS || '4000', 10),
    maxRetries: 3
  },
  paths: {
    dbFile: path.join(__dirname, '../data/db.json'),
    clientDist: path.join(__dirname, '../../../client/dist')
  }
};

module.exports = config;
