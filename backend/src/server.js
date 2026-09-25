const app = require('./app');
const config = require('./config');
const schedulerService = require('./services/SchedulerService');

// Start autonomous background scheduler
schedulerService.start();

const server = app.listen(config.port, config.host, () => {
  console.log(`================================================================`);
  console.log(`  AUTOMATRIX INDUSTRIAL PLATFORM (Layered Architecture)`);
  console.log(`  Environment: ${config.env}`);
  console.log(`  Server Listening on: http://${config.host}:${config.port}`);
  console.log(`  AI Engine: ${config.ai.provider} (Decoupled Strategy Pattern)`);
  console.log(`================================================================`);
});

// Graceful Shutdown Management
const handleShutdown = (signal) => {
  console.log(`\n[Process] Received ${signal}. Initiating graceful shutdown...`);
  schedulerService.stop();
  server.close(() => {
    console.log('[Process] HTTP server closed cleanly. Exiting.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

module.exports = server;
