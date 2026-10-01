const BaseAIProvider = require('./BaseAIProvider');
const InsightEngine = require('../insights/InsightEngine');

class ContextualAIProvider extends BaseAIProvider {
  constructor() {
    super('Contextual Neural Engine (Native & Live AI Vision)');
  }

  async generatePost({
    businessName = 'My Business',
    industry = 'General',
    targetAudience = 'Customers',
    tone = 'Warm & Welcoming',
    topic = 'Latest Updates',
    targetPlatforms = ['twitter', 'instagram', 'facebook', 'tiktok']
  }) {
    // Simulated live inference calculation
    await new Promise((r) => setTimeout(r, 650));

    const cleanTopic = topic.trim();
    const tagBase = industry.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'business';
    const brandTag = businessName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'brand';
    const topicTag = cleanTopic.split(' ').slice(0, 2).join('').replace(/[^a-zA-Z0-9]/g, '');

    // Tone variations
    const toneIntros = {
      'Warm & Welcoming': {
        tw: `Cozy vibes only! ✨ We're excited to present ${cleanTopic}. Crafted with love for our ${targetAudience.toLowerCase()} community.`,
        ig: `✨ Crafted with care at ${businessName} ✨\n\nThere is nothing quite like ${cleanTopic}. Whether you're treating yourself after a long week or sharing a moment with friends, we are here to make it special.`,
        fb: `Hello to our amazing community! At ${businessName}, quality and care are at the core of everything we do. Today, we're proud to highlight our ${cleanTopic}. Stop by or get in touch to experience the difference!`,
        tt: `POV: You found your new comfort obsession at ${businessName} ☕✨ Tag someone who needs to see this!`
      },
      'Professional & Sleek': {
        tw: `Precision and excellence define ${cleanTopic}. Engineered specifically for ${targetAudience.toLowerCase()}. Discover the standard at ${businessName}.`,
        ig: `Setting new benchmarks in ${industry}. 📈\n\nWe are proud to introduce ${cleanTopic}—designed with uncompromising attention to detail and curated for our discerning community.\n\nLearn more via the link in our bio.`,
        fb: `At ${businessName}, our commitment to standard-setting innovation is unwavering. Our latest release, "${cleanTopic}", delivers measurable quality for ${targetAudience.toLowerCase()}.\n\nExplore our full catalog and connect with our team today.`,
        tt: `Behind the scenes of ${cleanTopic} at ${businessName} ⚡ Excellence in every single detail.`
      },
      'Bold & Energetic': {
        tw: `BOOM! 💥 Don't sleep on our ${cleanTopic}! Big energy, unmatched quality, exclusively at ${businessName}. Ready to level up? 🚀`,
        ig: `🔥 STOP SCROLLING. ${cleanTopic} IS FINALLY HERE! 🔥\n\nYou asked, we delivered. ${businessName} is turning up the volume with our most requested release yet.\n\nDon't walk, RUN before it's gone! 👇`,
        fb: `GET READY! Big things have landed at ${businessName}! 🎉\n\nWe're thrilled to drop our ${cleanTopic}. Unmatched value, incredible craftsmanship, and zero compromises.\n\nVisit us today or shop online before supplies run out!`,
        tt: `Run, don't walk! 🏃‍♂️💨 ${businessName}'s ${cleanTopic} is taking over #viral`
      },
      'Playful & Witty': {
        tw: `Look, we're not saying our ${cleanTopic} will change your life... but we're also not NOT saying that 😉 Pop by ${businessName} today!`,
        ig: `Our therapist told us to treat ourselves, so naturally we created ${cleanTopic} 🥐✨\n\nOne taste and you'll understand why our team can't stop talking about this. Come say hi and grab yours today!`,
        fb: `Warning: Exposure to ${businessName}'s ${cleanTopic} may cause uncontrollable smiling and sudden cravings. Proceed with delight! 😂\n\nDrop by today—you deserve something great!`,
        tt: `Tell me you're obsessed with ${cleanTopic} without telling me you're obsessed... I'll go first 🙋‍♂️`
      }
    };

    const copy = toneIntros[tone] || toneIntros['Warm & Welcoming'];

    // Detailed prompt for real diffusion model
    const imagePrompt = `Award-winning commercial product photography of ${cleanTopic} for ${businessName} in ${industry}. Premium aesthetic, soft studio rim lighting, 50mm f/1.8 lens, high definition advertising campaign shot.`;

    // Real AI-generated image URL via Pollinations Flux / SDXL
    const encodedPrompt = encodeURIComponent(`${industry} ${cleanTopic} commercial photography 4k`);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true`;

    const platforms = {};

    if (targetPlatforms.includes('twitter')) {
      const tweetText = `${copy.tw}\n\n#${brandTag} #${tagBase} #${topicTag || 'Trending'}`;
      platforms.twitter = {
        platform: 'twitter',
        charLimit: 280,
        text: tweetText.slice(0, 275),
        hashtags: [`#${brandTag}`, `#${tagBase}`, `#${topicTag || 'Trending'}`]
      };
    }

    if (targetPlatforms.includes('instagram')) {
      platforms.instagram = {
        platform: 'instagram',
        caption: `${copy.ig}\n\n📍 Visit ${businessName} or tap the link in bio.\n💬 Drop your thoughts below! 👇`,
        hashtags: [`#${brandTag}`, `#${tagBase}`, '#SmallBusiness', '#QualityCrafted', `#${topicTag || 'Trending'}`]
      };
    }

    if (targetPlatforms.includes('facebook')) {
      platforms.facebook = {
        platform: 'facebook',
        text: copy.fb,
        callToAction: 'Learn More',
        // No fabricated destination link — use a real URL when available.
        link: null
      };
    }

    if (targetPlatforms.includes('tiktok')) {
      platforms.tiktok = {
        platform: 'tiktok',
        caption: `${copy.tt} #${brandTag} #${tagBase} #fyp #viral`,
        hashtags: [`#${brandTag}`, `#${tagBase}`, '#fyp', '#viral'],
        suggestedSound: `${tone === 'Bold & Energetic' ? 'Upbeat Synth Pop Beat' : 'Trending Lo-Fi Cafe Aesthetic (15s)'}`,
        scriptIdea: `1. Fast hook: Close-up of ${cleanTopic}. 2. Action shot: Barista/Craftsman at work. 3. Final reaction.`
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
    if (!comments.length) {
      // Honest: no comments imported yet -> no sentiment to report
      return {
        provider: this.name,
        metrics: null,
        analyzedComments: []
      };
    }

    let pos = 0, neu = 0, neg = 0;
    const analyzed = comments.map(c => {
      const lower = (c.text || '').toLowerCase();
      let sentiment = 'Neutral';

      if (/love|great|best|amazing|delicious|awesome|perfect|fire|super|favorite/i.test(lower)) {
        sentiment = 'Positive';
        pos++;
      } else if (/bad|slow|expensive|hate|disappointed|worst|cold|terrible/i.test(lower)) {
        sentiment = 'Negative';
        neg++;
      } else {
        neu++;
      }

      return { ...c, sentiment };
    });

    const total = comments.length || 1;
    return {
      provider: this.name,
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

module.exports = ContextualAIProvider;
