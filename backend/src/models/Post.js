'use strict';

const mongoose = require('mongoose');

/**
 * Post — a multi-platform post going through the pipeline:
 * draft -> scheduled -> published.
 * `metrics` and `sentiment` are null until real platform data is
 * recorded (no fabricated engagement numbers).
 */
const postSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    topic: { type: String, required: true },
    tone: { type: String, default: 'Warm & Welcoming' },
    mode: { type: String, enum: ['review', 'auto'], default: 'review' },
    status: { type: String, enum: ['draft', 'scheduled', 'published'], default: 'draft', index: true },
    scheduledTime: { type: Date, default: null },
    publishedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now, index: true },
    imageUrl: { type: String, default: null },
    imagePrompt: { type: String, default: '' },
    platforms: { type: mongoose.Schema.Types.Mixed, default: {} },
    targetPlatforms: { type: [String], default: [] },
    metrics: {
      type: {
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        reach: { type: Number, default: 0 }
      },
      default: null
    },
    sentiment: {
      type: {
        positive: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 },
        negative: { type: Number, default: 0 }
      },
      default: null
    },
    executionResults: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  { timestamps: false }
);

postSchema.index({ status: 1, scheduledTime: 1 });

postSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Post', postSchema);
