const BaseAIProvider = require('./BaseAIProvider');
const InsightEngine = require('../insights/InsightEngine');

class GeminiProvider extends BaseAIProvider {
  constructor(apiKey, model = 'gemini-1.5-flash') {
    super('Google Gemini (Live LLM)');
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
      throw new Error('Gemini API key is missing. Set GEMINI_API_KEY in Settings or .env');
    }

    const prompt = `You are a social media growth expert for "${businessName}" (${industry}).
Target audience: ${targetAudience}. Tone: ${tone}.
Topic / Campaign: "${topic}".
Target platforms: ${targetPlatforms.join(', ')}.

Generate platform-optimized social media posts.
Return ONLY valid JSON (no markdown formatting, no backticks, no code blocks) matching this exact JSON schema:
{
  "imagePrompt": "Detailed commercial product photography prompt for this post",
  "platforms": {
    "twitter": {
      "text": "Tweet text under 280 characters with 2-3 hashtags",
      "hashtags": ["#tag1", "#tag2"]
    },
    "instagram": {
      "caption": "Engaging Instagram caption with emojis and spacing",
      "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    },
    "facebook": {
      "text": "Detailed informative post with call-to-action",
      "callToAction": "Learn More"
    },
    "tiktok": {
      "caption": "Catchy short-form caption with viral tags",
      "hashtags": ["#fyp", "#tag1"],
      "suggestedSound": "Trending audio sound suggestion"
    }
  }
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errBody}`);
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Gemini returned an empty response');

    const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());

    // Real image generated from the LLM's own image prompt (Pollinations diffusion API)
    const imagePrompt = parsed.imagePrompt || `Professional promotional photo for ${topic}`;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=800&nologo=true`;

    return {
      provider: `Google Gemini (${this.model})`,
      coreTopic: topic,
      toneUsed: tone,
      imagePrompt,
      imageUrl,
      platforms: parsed.platforms,
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

    const prompt = `Classify the sentiment of each of the following comments as "Positive", "Neutral", or "Negative".
Comments:
${comments.map((c, i) => `${i + 1}. "${c.text}" (id: ${c.id})`).join('\n')}

Return ONLY a JSON array of objects: [{"id": string, "sentiment": "Positive" | "Neutral" | "Negative"}]`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    const json = await response.json();
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
    const classified = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());

    let pos = 0, neu = 0, neg = 0;
    const analyzed = comments.map(c => {
      const match = classified.find(x => x.id === c.id);
      const sentiment = match ? match.sentiment : 'Neutral';
      if (sentiment === 'Positive') pos++;
      else if (sentiment === 'Negative') neg++;
      else neu++;
      return { ...c, sentiment };
    });

    const total = comments.length || 1;
    return {
      provider: `Google Gemini (${this.model})`,
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

module.exports = GeminiProvider;
