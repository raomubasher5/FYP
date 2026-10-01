const BaseAIProvider = require('./BaseAIProvider');
const InsightEngine = require('../insights/InsightEngine');

class GroqProvider extends BaseAIProvider {
  constructor(apiKey, model = 'llama-3.3-70b-versatile') {
    super('Groq Cloud (Llama 3.3)');
    this.apiKey = apiKey;
    this.model = model;
  }

  async generatePost({
    businessName,
    industry,
    targetAudience,
    tone,
    topic,
    targetPlatforms = ['twitter', 'instagram', 'facebook', 'tiktok']
  }) {
    if (!this.apiKey) {
      throw new Error('Groq API key is missing. Set GROQ_API_KEY in Settings or .env');
    }

    const systemPrompt = `You are an elite social media director for "${businessName}" (${industry}).
Audience: ${targetAudience}. Tone: ${tone}.
Target platforms: ${targetPlatforms.join(', ')}.

Respond ONLY in valid raw JSON with this exact schema:
{
  "imagePrompt": "description of matching commercial photo",
  "platforms": {
    "twitter": { "text": "tweet under 280 chars with hashtags", "hashtags": ["#tag1", "#tag2"] },
    "instagram": { "caption": "full instagram caption with line breaks", "hashtags": ["#tag1", "#tag2", "#tag3"] },
    "facebook": { "text": "informative post with CTA", "callToAction": "Learn More" },
    "tiktok": { "caption": "short viral caption", "hashtags": ["#fyp", "#tag1"], "suggestedSound": "sound name" }
  }
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate social media campaign for topic: "${topic}"` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${err}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    // Real image generated from the LLM's own image prompt (Pollinations diffusion API)
    const imagePrompt = content.imagePrompt || `Professional promotional photo for ${topic}`;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=800&nologo=true`;

    return {
      provider: `Groq (${this.model})`,
      coreTopic: topic,
      toneUsed: tone,
      imagePrompt,
      imageUrl,
      platforms: content.platforms,
      timestamp: new Date().toISOString()
    };
  }

  async analyzeSentiment(comments = []) {
    if (!comments.length) {
      // Honest: no comments imported yet -> no sentiment to report
      return {
        provider: this.name,
        metrics: null,
        analyzedComments: []
      };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Classify comments as Positive, Neutral, or Negative. Return JSON with key "results": [{"id": string, "sentiment": string}]'
          },
          {
            role: 'user',
            content: JSON.stringify(comments.map(c => ({ id: c.id, text: c.text })))
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    const results = parsed.results || [];

    let pos = 0, neu = 0, neg = 0;
    const analyzed = comments.map(c => {
      const match = results.find(x => x.id === c.id);
      const sentiment = match ? match.sentiment : 'Neutral';
      if (sentiment === 'Positive') pos++;
      else if (sentiment === 'Negative') neg++;
      else neu++;
      return { ...c, sentiment };
    });

    const total = comments.length || 1;
    return {
      provider: `Groq (${this.model})`,
      metrics: {
        positive: Math.round((pos / total) * 100),
        neutral: Math.round((neu / total) * 100),
        negative: Math.round((neg / total) * 100)
      },
      analyzedComments: analyzed
    };
  }

  async getRecommendations({ recentPosts = [] }) {
    // Data-driven: insights computed from the user's REAL published posts
    return InsightEngine.build(recentPosts);
  }
}

module.exports = GroqProvider;
