/**
 * ======================================================================================
 * AI SERVICE MODULE (EMPTY / MOCK INTERFACE)
 * ======================================================================================
 * This module is decoupled from the rest of the application.
 * You can decide later which LLM to use (e.g. Google Gemini 1.5 Flash, Groq Llama-3,
 * OpenAI GPT-4o-mini, or local Ollama).
 *
 * TO PLUG IN A REAL LLM LATER:
 * Simply replace the internal logic of the methods below with your LLM API call.
 * The rest of the app (frontend, database, queue, scheduler) does NOT need to change.
 * ======================================================================================
 */

class AIService {
  constructor() {
    this.providerName = "Mock / Decoupled Engine (Ready for Gemini / Groq / OpenAI)";
  }

  /**
   * Generates tailored posts for Twitter, Instagram, Facebook, and TikTok.
   * Accepts business context, campaign topic, target platforms, and tone.
   */
  async generateMultiPlatformPost({
    businessName = "Artisan Cafe",
    industry = "Coffee & Bakery",
    targetAudience = "Students and remote professionals",
    tone = "Friendly & Warm",
    topic = "Special Weekend Roast & Pastry Deal",
    customInstructions = "",
    targetPlatforms = ["twitter", "instagram", "facebook", "tiktok"]
  }) {
    // -------------------------------------------------------------------------
    // TODO: WHEN READY TO CONNECT A REAL MODEL:
    // e.g. using Gemini:
    //   const response = await geminiModel.generateContent({ ...prompt... });
    //   return JSON.parse(response.text);
    // -------------------------------------------------------------------------

    // Simulated network/generation delay (makes the UI feel realistic in demo)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleanTopic = topic.trim() || `Exciting promotion at ${businessName}`;
    const tagBase = industry.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "business";
    const brandTag = businessName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "brand";

    // Clean image prompt for visual generation
    const imagePrompt = `High quality commercial product photo of ${cleanTopic} for ${businessName} in ${industry} industry. Warm aesthetic, soft natural lighting, shallow depth of field, 4k advertising shoot.`;

    // High quality themed royalty-free mock image (Unsplash direct query matching the topic)
    const encodedTopic = encodeURIComponent(industry + " " + cleanTopic);
    const imageUrl = `https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80`;

    const generatedPlatforms = {};

    if (targetPlatforms.includes("twitter")) {
      generatedPlatforms.twitter = {
        platform: "twitter",
        charLimit: 280,
        text: `Fuel your grind with our ${cleanTopic}! 🚀 Specially crafted for ${targetAudience.toLowerCase()} who love great taste. Stop by today or tap the link in bio.\n\n#${brandTag} #${tagBase} #Trending`,
        hashtags: [`#${brandTag}`, `#${tagBase}`, "#Trending"]
      };
    }

    if (targetPlatforms.includes("instagram")) {
      generatedPlatforms.instagram = {
        platform: "instagram",
        caption: `✨ Special Highlight: ${cleanTopic} ✨\n\nAt ${businessName}, we believe in crafting moments that matter. Crafted specifically with our community in mind — whether you're taking a breather or catching up with friends.\n\n📍 Drop by our location today or order online!\n💬 What's your favorite go-to treat? Let us know below 👇`,
        hashtags: [
          `#${brandTag}`,
          `#${tagBase}`,
          "#SmallBusinessLove",
          "#DailyInspo",
          "#SupportLocal",
          "#WeekendVibes"
        ]
      };
    }

    if (targetPlatforms.includes("facebook")) {
      generatedPlatforms.facebook = {
        platform: "facebook",
        text: `Big news from ${businessName}! 🎉\n\nWe are proud to introduce our ${cleanTopic}. Designed to deliver the highest quality for our customers.\n\n👉 Learn more and view our full schedule at our page or visit us in-store. Tag a friend who needs to see this!`,
        callToAction: "Learn More",
        link: "https://example.com/promotion"
      };
    }

    if (targetPlatforms.includes("tiktok")) {
      generatedPlatforms.tiktok = {
        platform: "tiktok",
        caption: `POV: You just discovered ${businessName}'s ${cleanTopic} ☕✨ Don't walk, run! #${brandTag} #${tagBase} #fyp #viral`,
        hashtags: [`#${brandTag}`, `#${tagBase}`, "#fyp", "#viral"],
        suggestedSound: "Trending Lo-Fi Aesthetic Beats (15s)",
        scriptIdea: "Quick 3-shot montage: 1. Making the item, 2. Close-up detail, 3. Happy customer reaction."
      };
    }

    if (targetPlatforms.includes("linkedin")) {
      generatedPlatforms.linkedin = {
        platform: "linkedin",
        text: `Innovation in ${industry}: How ${businessName} is redefining customer experiences.\n\nWith our latest focus on "${cleanTopic}", we are continuing to invest in quality and community satisfaction.\n\nRead our full business journey and insights below. #Entrepreneurship #SME #${tagBase}`
      };
    }

    return {
      success: true,
      modelUsed: this.providerName,
      generatedAt: new Date().toISOString(),
      coreTopic: cleanTopic,
      toneUsed: tone,
      imagePrompt,
      imageUrl,
      platforms: generatedPlatforms
    };
  }

  /**
   * Analyzes sentiment of audience comments.
   * Can be connected to HuggingFace or an LLM later.
   */
  async analyzeSentiment(comments = []) {
    // -------------------------------------------------------------------------
    // TODO: Plug in real HuggingFace RoBERTa or Gemini prompt here later
    // -------------------------------------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 400));

    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    const analyzedComments = comments.map((comment) => {
      const lower = comment.text.toLowerCase();
      let sentiment = "Neutral";
      let score = 0.5;

      if (
        lower.includes("love") ||
        lower.includes("great") ||
        lower.includes("best") ||
        lower.includes("amazing") ||
        lower.includes("delicious") ||
        lower.includes("awesome")
      ) {
        sentiment = "Positive";
        score = 0.92;
        positiveCount++;
      } else if (
        lower.includes("bad") ||
        lower.includes("slow") ||
        lower.includes("expensive") ||
        lower.includes("disappointed") ||
        lower.includes("hate")
      ) {
        sentiment = "Negative";
        score = 0.85;
        negativeCount++;
      } else {
        sentiment = "Neutral";
        score = 0.65;
        neutralCount++;
      }

      return {
        ...comment,
        sentiment,
        confidence: score
      };
    });

    const total = comments.length || 1;
    const positivePct = Math.round((positiveCount / total) * 100);
    const negativePct = Math.round((negativeCount / total) * 100);
    const neutralPct = 100 - positivePct - negativePct;

    return {
      success: true,
      modelUsed: this.providerName,
      metrics: {
        positive: positivePct || 72,
        neutral: neutralPct || 22,
        negative: negativePct || 6
      },
      analyzedComments
    };
  }

  /**
   * Generates smart recommendations based on historical post engagement.
   */
  async getRecommendations({ recentPosts = [], audienceData = {} }) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return [
      {
        id: "rec-1",
        type: "timing",
        title: "Optimal Posting Window Detected",
        message: "Your audience engages 42% more on Instagram between 1:00 PM and 3:00 PM on Thursdays and Fridays.",
        action: "Apply to Schedule"
      },
      {
        id: "rec-2",
        type: "content",
        title: "Top Performing Topic: Behind the Scenes",
        message: "Posts featuring production process and staff stories achieved 2.4x higher comment counts than standard promotional announcements.",
        action: "Draft New Story"
      },
      {
        id: "rec-3",
        type: "format",
        title: "Short-Form Video Trend on TikTok",
        message: "TikTok videos under 18 seconds with ambient coffee sounds had an average watch-through rate of 81%.",
        action: "Explore Script Ideas"
      }
    ];
  }
}

module.exports = new AIService();
