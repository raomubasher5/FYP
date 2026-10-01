'use strict';

const app = require('./app');
const config = require('./config');
const schedulerService = require('./services/SchedulerService');
const { connectDB, disconnectDB } = require('./db/mongo');

let server = null;

const handleShutdown = async (signal) => {
  console.log(`\n[Process] Received ${signal}. Initiating graceful shutdown...`);
  schedulerService.stop();
  if (server) {
    server.close(async () => {
      await disconnectDB();
      console.log('[Process] HTTP server closed and MongoDB disconnected cleanly. Exiting.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

(async () => {
  // 1. Connect to real MongoDB first — fail fast with a clear message.
  try {
    await connectDB(config.mongo.uri);
  } catch (err) {
    console.error('================================================================');
    console.error('  MongoDB connection FAILED');
    console.error(`  Reason: ${err.message}`);
    console.error('  Check MONGO_URI in .env, then either:');
    console.error('    - run `npm run dev:mongo` to start a local MongoDB, or');
    console.error('    - point MONGO_URI at your MongoDB Atlas / local mongod.');
    console.error('================================================================');
    process.exit(1);
  }

  // 2. Start autonomous background scheduler
  schedulerService.start();

  // 3. Bind HTTP
  server = app.listen(config.port, config.host, () => {
    console.log(`================================================================`);
    console.log(`  AUTOMATRIX PLATFORM (Layered Architecture + MongoDB)`);
    console.log(`  Environment: ${config.env}`);
    console.log(`  Server Listening on: http://${config.host}:${config.port}`);
    console.log(`  Database: MongoDB (connected)`);
    console.log(`  AI Engine: ${require('./services/ai').activeProviderName} (Factory Pattern)`);
    console.log(`  Publishing: LIVE for OAuth-connected channels + sandbox simulation fallback`);
    console.log(`================================================================`);
  });

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
})();

module.exports = server;
