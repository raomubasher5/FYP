const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');

const INITIAL_DATA = {
  businessProfile: {
    businessName: "Lumina Specialty Coffee & Bakery",
    industry: "Food & Beverage / Artisan Cafe",
    description: "Handcrafted espresso, fresh sourdough pastries, and a cozy workspace for creatives and students.",
    targetAudience: "Young professionals, university students, and remote workers aged 18-35",
    brandTone: "Warm & Welcoming",
    keywords: ["Artisan Roast", "Organic Pastries", "Co-working friendly", "Locally Sourced"],
    postingFrequency: "Daily (Monday - Saturday)",
    defaultMode: "review", // 'review' (Review Before Posting) or 'auto' (Automatic Posting)
    preferredPostingTimes: ["09:30", "13:00", "18:00"],
    targetPlatforms: ["twitter", "instagram", "facebook", "tiktok"]
  },
  socialAccounts: [
    {
      id: "acc-ig",
      platform: "instagram",
      name: "Instagram Business",
      handle: "@luminacoffee",
      status: "connected",
      mode: "sandbox", // 'live' or 'sandbox'
      connectedAt: "2026-09-01T10:00:00Z",
      followers: 4820,
      avatar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "acc-tw",
      platform: "twitter",
      name: "X / Twitter",
      handle: "@LuminaCafe",
      status: "connected",
      mode: "live",
      connectedAt: "2026-09-02T11:30:00Z",
      followers: 1950,
      avatar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "acc-fb",
      platform: "facebook",
      name: "Facebook Page",
      handle: "Lumina Cafe & Roasters",
      status: "connected",
      mode: "sandbox",
      connectedAt: "2026-09-03T09:15:00Z",
      followers: 3200,
      avatar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80"
    },
    {
      id: "acc-tt",
      platform: "tiktok",
      name: "TikTok Creator",
      handle: "@luminacafetok",
      status: "connected",
      mode: "sandbox",
      connectedAt: "2026-09-10T14:00:00Z",
      followers: 8400,
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
      followers: 430,
      avatar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80"
    }
  ],
  posts: [
    {
      id: "post-101",
      topic: "Introducing Caramel Cinnamon Honey Latte",
      tone: "Warm & Welcoming",
      mode: "review",
      status: "published",
      scheduledTime: "2026-09-23T09:30:00Z",
      publishedAt: "2026-09-23T09:30:04Z",
      imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
      imagePrompt: "Cozy caramel cinnamon latte with intricate leaf latte art on a dark slate table with cinnamon sticks.",
      targetPlatforms: ["instagram", "twitter", "facebook"],
      platforms: {
        twitter: {
          text: "Autumn in a cup! 🍂 Introducing our Caramel Cinnamon Honey Latte, made with organic clover honey and house-roasted espresso. Available starting today!\n\n#LuminaCoffee #LatteLove #CoffeeVibes",
          hashtags: ["#LuminaCoffee", "#LatteLove", "#CoffeeVibes"]
        },
        instagram: {
          caption: "✨ Meet our newest seasonal favorite: The Caramel Cinnamon Honey Latte! ✨\n\nInfused with organic wild clover honey, Madagascar cinnamon, and our signature slow-roasted beans.\n\nTag a friend who owes you a coffee date! ☕👇",
          hashtags: ["#SpecialtyCoffee", "#LuminaRoasters", "#LatteArt", "#CafeVibes", "#AutumnFlavors"]
        },
        facebook: {
          text: "We are thrilled to unveil our latest seasonal craft drink: The Caramel Cinnamon Honey Latte! Made fresh daily with organic honey and house-ground spices. Stop by between 8 AM and 6 PM to try it.",
          callToAction: "Order In-Store"
        }
      },
      metrics: {
        likes: 248,
        comments: 32,
        shares: 19,
        reach: 2840
      },
      sentiment: {
        positive: 85,
        neutral: 12,
        negative: 3
      }
    },
    {
      id: "post-102",
      topic: "Weekend Morning Baker's Special (Fresh Croissants)",
      tone: "Friendly & Casual",
      mode: "auto",
      status: "scheduled",
      scheduledTime: new Date(Date.now() + 3600 * 1000 * 2).toISOString(), // 2 hours from now
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
      imagePrompt: "Golden flaky French butter croissants fresh out of the oven on parchment paper with dusting of flour.",
      targetPlatforms: ["instagram", "facebook", "tiktok"],
      platforms: {
        instagram: {
          caption: "Crispy on the outside, soft buttery layers on the inside 🥐 Freshly rolled and baked at 6:30 AM every weekend morning.\n\nPair it with our batch-brew filter coffee for the perfect Saturday kickstart!",
          hashtags: ["#FreshPastry", "#ArtisanBakery", "#CroissantLove", "#WeekendTreat"]
        },
        facebook: {
          text: "Nothing beats the aroma of freshly baked French butter croissants on a crisp morning. Limited batches baked every 2 hours this weekend!",
          callToAction: "Visit Us"
        },
        tiktok: {
          caption: "Sound on for the pastry crunch 🥐🔥 Baked fresh every morning at Lumina #croissant #bakingtok #cafe #fyp",
          suggestedSound: "ASMR Baking Sounds / Crunch",
          hashtags: ["#croissant", "#bakingtok", "#cafe", "#fyp"]
        }
      },
      metrics: null,
      sentiment: null
    },
    {
      id: "post-103",
      topic: "Remote Work & Quiet Workspace Hours",
      tone: "Professional & Welcoming",
      mode: "review",
      status: "draft",
      scheduledTime: new Date(Date.now() + 3600 * 1000 * 24).toISOString(), // tomorrow
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      imagePrompt: "Minimalist sunny coffee shop with ergonomic wooden desks, plants, laptop, and espresso cup.",
      targetPlatforms: ["twitter", "instagram"],
      platforms: {
        twitter: {
          text: "Looking for high-speed Wi-Fi and plenty of power outlets for your workday? Our mezzanine floor is quiet, comfortable, and fully equipped. 💻☕ #RemoteWork #Coworking #WorkFromCafe",
          hashtags: ["#RemoteWork", "#Coworking", "#WorkFromCafe"]
        },
        instagram: {
          caption: "Your new favorite out-of-office desk is ready! 🌿\n\nEnjoy gigabit Wi-Fi, power sockets at every booth, and endless specialty coffee refills until 4 PM. We love hosting freelancers, students, and teams.",
          hashtags: ["#WorkFromCafe", "#ProductivitySpace", "#FreelanceLife", "#StudySpot"]
        }
      },
      metrics: null,
      sentiment: null
    }
  ],
  sampleComments: [
    { id: "c1", author: "sara_designs", text: "The new cinnamon latte is literally the best coffee in town!! 😭❤️", sentiment: "Positive" },
    { id: "c2", author: "alex_dev", text: "Tried the sourdough toast today, absolutely delicious and crispy.", sentiment: "Positive" },
    { id: "c3", author: "mark_w", text: "Is parking available nearby on weekends?", sentiment: "Neutral" },
    { id: "c4", author: "coffee_nerd_99", text: "Good espresso pull, though beans were slightly darker than previous batch.", sentiment: "Neutral" },
    { id: "c5", author: "tariq_k", text: "Super cozy atmosphere to work from with my laptop! 💻", sentiment: "Positive" },
    { id: "c6", author: "anna_b", text: "Waited 15 mins for takeaway yesterday, was a bit crowded.", sentiment: "Negative" },
    { id: "c7", author: "zayn_m", text: "Best almond croissant I have had in months. Keep it up guys!", sentiment: "Positive" }
  ],
  logs: [
    { timestamp: "2026-09-23T09:30:04Z", level: "info", message: "AI Agent successfully published post-101 to Instagram and Twitter." },
    { timestamp: "2026-09-23T09:30:00Z", level: "info", message: "Scheduler triggered execution for post-101." },
    { timestamp: "2026-09-22T14:10:00Z", level: "info", message: "AI Agent generated 4 platform drafts for topic: 'Autumn Drinks'." }
  ]
};

class Storage {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("Error reading db.json, initializing default data:", err);
    }
    this.save(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  save(dataToSave) {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Error writing db.json:", err);
    }
  }

  getProfile() {
    return this.data.businessProfile;
  }

  updateProfile(profile) {
    this.data.businessProfile = { ...this.data.businessProfile, ...profile };
    this.save();
    return this.data.businessProfile;
  }

  getSocialAccounts() {
    return this.data.socialAccounts;
  }

  updateSocialAccount(accountId, updates) {
    const idx = this.data.socialAccounts.findIndex(a => a.id === accountId);
    if (idx !== -1) {
      this.data.socialAccounts[idx] = { ...this.data.socialAccounts[idx], ...updates };
      this.save();
      return this.data.socialAccounts[idx];
    }
    return null;
  }

  getPosts() {
    return this.data.posts;
  }

  getPostById(id) {
    return this.data.posts.find(p => p.id === id);
  }

  addPost(post) {
    this.data.posts.unshift(post);
    this.save();
    return post;
  }

  updatePost(id, updates) {
    const idx = this.data.posts.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.posts[idx] = { ...this.data.posts[idx], ...updates };
      this.save();
      return this.data.posts[idx];
    }
    return null;
  }

  deletePost(id) {
    const initialLen = this.data.posts.length;
    this.data.posts = this.data.posts.filter(p => p.id !== id);
    if (this.data.posts.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  getLogs() {
    return this.data.logs;
  }

  addLog(message, level = "info") {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message
    };
    this.data.logs.unshift(logEntry);
    if (this.data.logs.length > 100) {
      this.data.logs = this.data.logs.slice(0, 100);
    }
    this.save();
    return logEntry;
  }

  getComments() {
    return this.data.sampleComments;
  }

  resetDemoData() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.save();
    return this.data;
  }
}

module.exports = new Storage();
