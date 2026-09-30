'use strict';

const config = require('../../config');
const GeminiProvider = require('./GeminiProvider');
const GroqProvider = require('./GroqProvider');
const MockAIProvider = require('./MockAIProvider');
const ContextualAIProvider = require('./ContextualAIProvider');

/**
 * AIFactory — creates the configured AI provider (Factory Pattern).
 *  - 'gemini'      -> real Google Gemini LLM (needs GEMINI_API_KEY)
 *  - 'groq'        -> real Groq Llama (needs GROQ_API_KEY)
 *  - 'mock'        -> fully offline template engine, no network, no images
 *  - 'contextual'  -> offline contextual template engine + live AI images
 */
class AIFactory {
  static getProvider(providerType = config.ai.provider) {
    const selected = (providerType || '').toLowerCase();

    if (selected === 'gemini' || config.ai.geminiApiKey) {
      return new GeminiProvider(config.ai.geminiApiKey, config.ai.defaultModel || 'gemini-1.5-flash');
    }

    if (selected === 'groq' || config.ai.groqApiKey) {
      return new GroqProvider(config.ai.groqApiKey, config.ai.defaultModel || 'llama-3.3-70b-versatile');
    }

    if (selected === 'mock') {
      return new MockAIProvider();
    }

    return new ContextualAIProvider();
  }
}

class AIService {
  constructor() {
    this.provider = AIFactory.getProvider();
  }

  reconfigure(providerType, apiKey, model) {
    const selected = (providerType || '').toLowerCase();
    if (selected === 'gemini') {
      this.provider = new GeminiProvider(apiKey, model || 'gemini-1.5-flash');
    } else if (selected === 'groq') {
      this.provider = new GroqProvider(apiKey, model || 'llama-3.3-70b-versatile');
    } else if (selected === 'mock') {
      this.provider = new MockAIProvider();
    } else {
      this.provider = new ContextualAIProvider();
    }
    console.log(`[AIService] Reconfigured active AI provider to: ${this.provider.name}`);
  }

  get activeProviderName() {
    return this.provider.name;
  }

  async generateMultiPlatformPost(context) {
    return await this.provider.generatePost(context);
  }

  async analyzeSentiment(comments) {
    return await this.provider.analyzeSentiment(comments);
  }

  async getRecommendations(history) {
    return await this.provider.getRecommendations(history);
  }
}

module.exports = new AIService();
