const config = require('../../config');
const GeminiProvider = require('./GeminiProvider');
const GroqProvider = require('./GroqProvider');
const ContextualAIProvider = require('./ContextualAIProvider');

class AIFactory {
  static getProvider(providerType = config.ai.provider) {
    const selected = (providerType || '').toLowerCase();

    if (selected === 'gemini' || config.ai.geminiApiKey) {
      return new GeminiProvider(config.ai.geminiApiKey, config.ai.defaultModel || 'gemini-1.5-flash');
    }

    if (selected === 'groq' || config.ai.groqApiKey) {
      return new GroqProvider(config.ai.groqApiKey, config.ai.defaultModel || 'llama-3.3-70b-versatile');
    }

    // Default real dynamic generation engine with real live AI image generator
    return new ContextualAIProvider();
  }
}

class AIService {
  constructor() {
    this.provider = AIFactory.getProvider();
  }

  reconfigure(providerType, apiKey, model) {
    if (providerType === 'gemini') {
      this.provider = new GeminiProvider(apiKey, model || 'gemini-1.5-flash');
    } else if (providerType === 'groq') {
      this.provider = new GroqProvider(apiKey, model || 'llama-3.3-70b-versatile');
    } else {
      this.provider = new ContextualAIProvider();
    }
    console.log(`[AIService] Reconfigured active AI provider to: ${this.provider.name}`);
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
