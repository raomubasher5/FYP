'use strict';

const mongoose = require('mongoose');

/**
 * Comment — real audience comments imported for sentiment analysis.
 * `sentiment` is null until the active AI provider classifies it.
 */
const commentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    author: { type: String, default: 'Anonymous' },
    text: { type: String, required: true },
    platform: { type: String, default: 'unknown' },
    topic: { type: String, default: '' },
    sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative', null],
      default: null
    },
    createdAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
);

commentSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Comment', commentSchema);
