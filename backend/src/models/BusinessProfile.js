'use strict';

const mongoose = require('mongoose');

/**
 * BusinessProfile — single-document (singleton) schema.
 * Represents the real business profile entered by the user.
 * No seeded / demo data: starts empty until the user fills it in.
 */
const businessProfileSchema = new mongoose.Schema(
  {
    id: { type: String, default: 'business', unique: true },
    businessName: { type: String, default: '' },
    industry: { type: String, default: '' },
    description: { type: String, default: '' },
    targetAudience: { type: String, default: '' },
    brandTone: { type: String, default: 'Warm & Welcoming' },
    keywords: { type: [String], default: [] },
    postingFrequency: { type: String, default: '' },
    defaultMode: { type: String, enum: ['review', 'auto'], default: 'review' },
    preferredPostingTimes: { type: [String], default: [] },
    targetPlatforms: { type: [String], default: ['twitter', 'instagram', 'facebook', 'tiktok'] }
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

businessProfileSchema.set('toJSON', {
  virtuals: false,
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('BusinessProfile', businessProfileSchema);
