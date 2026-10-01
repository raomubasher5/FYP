'use strict';

/**
 * Local development MongoDB — starts a REAL mongod instance (managed by
 * mongodb-memory-server) on 127.0.0.1:27017 for local development.
 *
 *   npm run dev:mongo     -> start local MongoDB (keeps running)
 *   npm start             -> start the Automatrix server (reads MONGO_URI)
 *
 * For production or your laptop's own mongod / MongoDB Atlas, just set
 * MONGO_URI in .env — this script is not needed.
 */
const { MongoMemoryServer } = require('mongodb-memory-server');

const PORT = process.env.MONGO_LOCAL_PORT || 27017;

(async () => {
  try {
    const mem = await MongoMemoryServer.create({
      instance: { port: Number(PORT), ip: '127.0.0.1' }
    });

    const uri = mem.getUri('automatrix');
    console.log('================================================================');
    console.log('  Local MongoDB (real mongod) started for Automatrix');
    console.log(`  URI: ${uri}`);
    console.log('  Set MONGO_URI in .env to this value to use it.');
    console.log('================================================================');

    const stop = async (signal) => {
      console.log(`\n[local-mongo] Received ${signal}. Shutting down MongoDB...`);
      await mem.stop();
      process.exit(0);
    };
    process.on('SIGTERM', () => stop('SIGTERM'));
    process.on('SIGINT', () => stop('SIGINT'));
  } catch (err) {
    console.error('[local-mongo] Failed to start local MongoDB:', err.message);
    console.error('[local-mongo] Check your network (the mongod binary is downloaded on first run) or run your own MongoDB and set MONGO_URI in .env.');
    process.exit(1);
  }
})();
