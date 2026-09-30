'use strict';

const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

/**
 * Connect to MongoDB (Mongoose). Fails fast with a clear message so the
 * operator knows to set MONGO_URI in .env.
 */
async function connectDB(uri) {
  mongoose.connection.on('connected', () => {
    const safeUri = uri.replace(/:[^:@/]+@/, ':•••@');
    console.log(`[MongoDB] Connected: ${safeUri}`);
  });
  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('[MongoDB] Disconnected');
  });

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  return mongoose.connection;
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
