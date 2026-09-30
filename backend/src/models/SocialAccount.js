'use strict';

const mongoose = require('mongoose');

/**
 * SocialAccount — a channel the user registers for their own business.
 * mode = 'sandbox'  -> publishing is a clearly-labeled simulation
 * mode = 'live'     -> real platform API calls using stored OAuth credentials
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
    avatar: { type: String, default: '' },
    /**
     * OAuth credentials for LIVE publishing (null for sandbox accounts).
     * Shape depends on platform:
     *   twitter:  { accessToken, refreshToken, expiresAt, username }
     *   facebook/instagram: { pageId, pageAccessToken, userName, instagramUserId? }
     *   tiktok:   { accessToken, openId, username, expiresAt }
     */
    credentials: { type: mongoose.Schema.Types.Mixed, default: null }
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
