'use strict';

const mongoose = require('mongoose');

/**
 * SocialAccount — a channel the user registers for their own business.
 * Status/mode reflect real state: 'connected' accounts are channels the
 * user added; publishing remains a sandbox simulation until live OAuth
 * credentials are integrated.
 */
const socialAccountSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    platform: {
      type: String,
      required: true,
      enum: ['instagram', 'twitter', 'facebook', 'tiktok', 'linkedin']
    },
    name: { type: String, required: true },
    handle: { type: String, required: true },
    status: { type: String, enum: ['connected', 'disconnected'], default: 'connected' },
    mode: { type: String, enum: ['sandbox', 'live'], default: 'sandbox' },
    connectedAt: { type: Date, default: null },
    followers: { type: Number, min: 0, default: 0 },
    avatar: { type: String, default: '' }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

socialAccountSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('SocialAccount', socialAccountSchema);
