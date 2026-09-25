const BaseAIProvider = require('./BaseAIProvider');

class MockAIProvider extends BaseAIProvider {
  constructor() {
    super('Mock AI Engine (Decoupled Industrial Interface)');
  }

  async generatePost({
    businessName = 'Artisan Cafe',
    industry = 'Food & Beverage',
    targetAudience = 'Students & Professionals',
    tone = 'Warm & Welcoming',
    topic = 'Featured Deal',
    targetPlatforms = ['twitter', 'instagram', 'facebook', 'tiktok']
  }) {
    // Simulated realistic inference latency
    await new Promise((r) => setTimeout(r, 600));

    const cleanTopic = topic.trim() || `Special Offer at ${businessName}`;
    const tagBase = industry.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'business';
    const brandTag = businessName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'brand';

    const imagePrompt = `High quality commercial product photo of ${cleanTopic} for ${businessName} in ${industry} industry. Warm aesthetic, soft lighting, professional 4k advertising shoot.`;
    const imageUrl = `https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80`;

    const platforms = {};

    if (targetPlatforms.includes('twitter')) {
      platforms.twitter = {
        platform: 'twitter',
        charLimit: 280,
        text: `Fuel your hustle with our ${cleanTopic}! ☕ Perfect for ${targetAudience.toLowerCase()} seeking excellence. Drop by today!\n\n#${brandTag} #${tagBase} #Trending`,
        hashtags: [`#${brandTag}`, `#${tagBase}`, '#Trending']
      };
    }

    if (targetPlatforms.includes('instagram')) {
      platforms.instagram = {
        platform: 'instagram',
        caption: `✨ Special Highlight: ${cleanTopic} ✨\n\nAt ${businessName}, we take pride in crafting moments that matter. Crafted specifically for our community.\n\n📍 Drop by our location or order online today!\n💬 Let us know what you think below! 👇`,
        hashtags: [`#${brandTag}`, `#${tagBase}`, '#SmallBusiness', '#DailyInspo', '#SupportLocal']
      };
    }

    if (targetPlatforms.includes('facebook')) {
      platforms.facebook = {
        platform: 'facebook',
        text: `Big news from ${businessName}! 🎉\n\nWe are proud to introduce our ${cleanTopic}. Crafted with care and passion for our loyal patrons.\n\n👉 Learn more at our page or visit us in-store. Tag someone who shouldn't miss this!`,
        callToAction: 'Learn More',
        link: 'https://example.com'
      };
    }

    if (targetPlatforms.includes('tiktok')) {
      platforms.tiktok = {
        platform: 'tiktok',
        caption: `POV: You just experienced ${businessName}'s ${cleanTopic} 🔥 Don't walk, run! #${brandTag} #${tagBase} #fyp #viral`,
        hashtags: [`#${brandTag}`, `#${tagBase}`, '#fyp', '#viral'],
        suggestedSound: 'Trending Lo-Fi Cafe Aesthetic (15s)',
        scriptIdea: '3-shot sequence: Prep, Close-up reveal, Customer reaction.'
      };
    }

    return {
      provider: this.name,
      coreTopic: cleanTopic,
      toneUsed: tone,
      imagePrompt,
      imageUrl,
      platforms,
      timestamp: new Date().toISOString()
    };
  }

  async analyzeSentiment(comments = []) {
    await new Promise((r) => setTimeout(r, 300));

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    const analyzedComments = comments.map((c) => {
      const lower = (c.text || '').toLowerCase();
      let sentiment = 'Neutral';

      if (
        lower.includes('love') ||
        lower.includes('great') ||
        lower.includes('best') ||
        lower.includes('amazing') ||
        lower.includes('delicious') ||
        lower.includes('awesome')
      ) {
        sentiment = 'Positive';
        positiveCount++;
      } else if (
        lower.includes('bad') ||
        lower.includes('slow') ||
        lower.includes('expensive') ||
        lower.includes('disappointed') ||
        lower.includes('hate')
      ) {
        sentiment = 'Negative';
        negativeCount++;
      } else {
        neutralCount++;
      }

      return { ...c, sentiment };
    });

    const total = comments.length || 1;
    const positive = Math.round((positiveCount / total) * 100) || 75;
    const negative = Math.round((negativeCount / total) * 100) || 5;
    const neutral = 100 - positive - negative;

    return {
      provider: this.name,
      metrics: { positive, neutral, negative },
      analyzedComments
    };
  }

  async getRecommendations({ recentPosts = [] }) {
    await new Promise((r) => setTimeout(r, 200));

    return [
      {
        id: 'rec-1',
        type: 'timing',
        title: 'Optimal Posting Window Detected',
        message: 'Audience engagement peaks by 42% on Instagram between 1:00 PM and 3:00 PM on Thursdays.',
        action: 'Apply to Schedule'
      },
      {
        id: 'rec-2',
        type: 'content',
        title: 'Top Performing Topic: Behind the Scenes',
        message: 'Behind-the-scenes production clips earned 2.4x more comments than standard discount announcements.',
        action: 'Draft New Story'
      },
      {
        id: 'rec-3',
        type: 'format',
        title: 'Short-Form Video Trend on TikTok',
        message: 'Videos under 18 seconds with ambient artisan sound had an 81% completion rate.',
        action: 'Explore Script Ideas'
      }
    ];
  }
}

module.exports = MockAIProvider;
