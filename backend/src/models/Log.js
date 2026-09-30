'use strict';

const mongoose = require('mongoose');

/**
 * Log — operational audit log (scheduler jobs, dispatches, profile changes).
 */
const logSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    level: { type: String, enum: ['info', 'warn', 'error'], default: 'info' },
    message: { type: String, required: true }
  },
  { timestamps: false }
);

logSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Log', logSchema);
