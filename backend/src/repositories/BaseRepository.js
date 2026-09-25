const fs = require('fs');
const path = require('path');
const config = require('../config');

const CLEAN_INITIAL_DATA = {
  businessProfile: {
    businessName: "Lumina Cafe & Roasters",
    industry: "Specialty Food & Beverage",
    description: "Artisan espresso bar, organic sourdough pastries, and community workspace.",
    targetAudience: "Coffee enthusiasts, university students, and remote professionals",
    brandTone: "Warm & Welcoming",
    keywords: ["Artisan", "Organic", "Craft", "Local"],
    postingFrequency: "Daily (Monday - Saturday)",
    defaultMode: "review",
    preferredPostingTimes: ["09:00", "14:00", "19:00"],
    targetPlatforms: ["twitter", "instagram", "facebook", "tiktok"]
  },
  socialAccounts: [
    {
      id: "acc-ig",
      platform: "instagram",
      name: "Instagram Business",
      handle: "@luminacoffee",
      status: "connected",
      mode: "sandbox",
      connectedAt: new Date().toISOString(),
      followers: 1240,
      avatar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "acc-tw",
      platform: "twitter",
      name: "X / Twitter",
      handle: "@LuminaCafe",
      status: "connected",
      mode: "live",
      connectedAt: new Date().toISOString(),
      followers: 890,
      avatar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "acc-fb",
      platform: "facebook",
      name: "Facebook Page",
      handle: "Lumina Cafe & Roasters",
      status: "connected",
      mode: "sandbox",
      connectedAt: new Date().toISOString(),
      followers: 1450,
      avatar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "acc-tt",
      platform: "tiktok",
      name: "TikTok Creator",
      handle: "@luminacafetok",
      status: "connected",
      mode: "sandbox",
      connectedAt: new Date().toISOString(),
      followers: 3200,
      avatar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "acc-li",
      platform: "linkedin",
      name: "LinkedIn Company",
      handle: "Lumina Coffee Roasters",
      status: "disconnected",
      mode: "sandbox",
      connectedAt: null,
      followers: 120,
      avatar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80"
    }
  ],
  posts: [], // 100% Clean! Zero dummy posts!
  sampleComments: [], // 100% Clean!
  logs: [
    {
      timestamp: new Date().toISOString(),
      level: "info",
      message: "Automatrix real data engine initialized. Ready for AI campaign generation."
    }
  ]
};

class BaseDatabase {
  constructor() {
    this.filePath = config.paths.dbFile;
    this.memoryData = this.init();
  }

  init() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure posts array exists
        if (parsed && Array.isArray(parsed.posts)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[Database] Initializing clean storage:', err.message);
    }
    const data = JSON.parse(JSON.stringify(CLEAN_INITIAL_DATA));
    this.persist(data);
    return data;
  }

  persist(data) {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(data || this.memoryData, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Failed to write database file:', err.message);
    }
  }

  get data() {
    return this.memoryData;
  }

  reset() {
    this.memoryData = JSON.parse(JSON.stringify(CLEAN_INITIAL_DATA));
    this.persist(this.memoryData);
    return this.memoryData;
  }
}

const db = new BaseDatabase();
module.exports = db;
