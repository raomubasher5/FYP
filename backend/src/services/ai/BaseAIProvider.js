/**
 * Abstract Base Class defining the contract for any AI Provider.
 * Real implementations (GeminiProvider, GroqProvider, etc.) must implement these methods.
 */
class BaseAIProvider {
  constructor(name = 'BaseAIProvider') {
    this.name = name;
  }

  async generatePost(context) {
    throw new Error(`[${this.name}] generatePost() must be implemented`);
  }

  async analyzeSentiment(comments) {
    throw new Error(`[${this.name}] analyzeSentiment() must be implemented`);
  }

  async getRecommendations(history) {
    throw new Error(`[${this.name}] getRecommendations() must be implemented`);
  }
}

module.exports = BaseAIProvider;
