const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Global Middlewares
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// API Endpoints
app.use('/api', routes);

// Static Client Files (Production Distribution)
if (process.env.NODE_ENV !== 'test') {
  app.use(express.static(config.paths.clientDist));

  // SPA Route Fallback (Express 5 safe)
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(config.paths.clientDist, 'index.html'));
  });
}

// Central Error Handling Middleware
app.use(errorHandler);

module.exports = app;
