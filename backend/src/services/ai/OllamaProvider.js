'use strict';

const config = require('../../config');
const BaseAIProvider = require('./BaseAIProvider');
const InsightEngine = require('../insights/InsightEngine');

/**
 * OllamaProvider — runs AI generation against a LOCAL Ollama server on the
 * user's machine (e.g. http://localhost:11434). No API key, no cloud,
 * no internet required. Uses Ollama's OpenAI-compatible chat endpoint so
 * it works with every model the user has pulled (llama3.1, mistral,
 * qwen2.5, phi3, ...).
 */
class OllamaProvider extends BaseAIProvider {
  constructor(baseUrl = config.ai.ollamaBaseUrl, model = 'llama3.1') {
    super('Ollama (Local)');
    this.baseUrl = String(baseUrl || config.ai.ollamaBaseUrl).replace(/\/+$/, '');
    this.model = model || 'llama3.1';
  }

  /** Local models wrap JSON in markdown fences or chatter — extract it safely. */
  static extractJson(raw, label = 'Ollama model') {
    if (!raw) throw new Error(`${label} returned an empty response`);
    let text = String(raw).trim();
    const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) text = fence[1].trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end <= start) {
      throw new Error(`${label} did not return valid JSON: ${text.slice(0, 140)}`);
    }
    return JSON.parse(text.slice(start, end + 1));
  }

  async chat(messages, temperature = 0.7) {
    let response;
    try {
      response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature
        })
      });
    } catch (err) {
      throw new Error(
        `Cannot reach Ollama at ${this.baseUrl} — is the Ollama app/server running on your PC? (ollama serve)`
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Ollama API Error (${response.status}): ${body.slice(0, 300) || response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? '';
  }

  async generatePost({
    businessName,
    industry,
    targetAudience,
    tone,
    topic,
    targetPlatforms = ['twitter', 'instagram', 'facebook', 'tiktok']
  }) {
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

    const content = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate social media campaign for topic: "${topic}"` }
      ],
      0.7
    );

    const parsed = OllamaProvider.extractJson(content);
    if (!parsed.platforms) {
      throw new Error('Ollama model response was missing the "platforms" field — try a larger model (e.g. llama3.1, qwen2.5)');
    }

    // Real image generated from the LLM's own image prompt (Pollinations diffusion API)
    const imagePrompt = parsed.imagePrompt || `Professional promotional photo for ${topic}`;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=800&nologo=true`;

    return {
      provider: `Ollama (${this.model})`,
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

    const content = await this.chat(
      [
        {
          role: 'system',
          content: 'Classify comments as Positive, Neutral, or Negative. Return JSON with key "results": [{"id": string, "sentiment": string}]'
        },
        {
          role: 'user',
          content: JSON.stringify(comments.map((c) => ({ id: c.id, text: c.text })))
        }
      ],
      0.2
    );

    const parsed = OllamaProvider.extractJson(content);
    const results = parsed.results || [];

    let pos = 0, neu = 0, neg = 0;
    const analyzed = comments.map((c) => {
      const match = results.find((x) => String(x.id) === String(c.id));
      const sentiment = match ? match.sentiment : 'Neutral';
      if (sentiment === 'Positive') pos++;
      else if (sentiment === 'Negative') neg++;
      else neu++;
      return { ...c, sentiment };
    });

    const total = comments.length || 1;
    return {
      provider: `Ollama (${this.model})`,
      metrics: {
        positive: Math.round((pos / total) * 100),
        neutral: Math.round((neu / total) * 100),
        negative: Math.round((neg / total) * 100)
      },
      analyzedComments: analyzed
    };
  }

  /** List models the user has pulled locally (GET /api/tags). */
  async listModels() {
    let response;
    try {
      response = await fetch(`${this.baseUrl}/api/tags`);
    } catch (err) {
      throw new Error(`Cannot reach Ollama at ${this.baseUrl} — is it running? (ollama serve)`);
    }
    if (!response.ok) {
      throw new Error(`Ollama API Error (${response.status}): ${response.statusText}`);
    }
    const data = await response.json();
    return (data.models || []).map((m) => m.name);
  }

  async getRecommendations({ recentPosts = [] }) {
    // Data-driven: insights computed from the user's REAL published posts
    return InsightEngine.build(recentPosts);
  }
}

module.exports = OllamaProvider;
