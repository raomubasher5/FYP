'use strict';

/**
 * Route aggregator — one dedicated router file per resource, mounted here.
 *
 *   POSTS      -> ./postRoutes
 *   PROFILE    -> ./profileRoutes
 *   ACCOUNTS   -> ./accountRoutes
 *   ANALYTICS  -> ./analyticsRoutes
 *   SYSTEM     -> ./systemRoutes
 */

const express = require('express');
const postRoutes = require('./postRoutes');
const profileRoutes = require('./profileRoutes');
const accountRoutes = require('./accountRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const systemRoutes = require('./systemRoutes');
const oauthRoutes = require('./oauthRoutes');
const systemController = require('../controllers/SystemController');

const router = express.Router();

router.use('/posts', postRoutes);
router.use('/profile', profileRoutes);
router.use('/accounts', accountRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/system', systemRoutes);
router.use('/auth', oauthRoutes); // live platform OAuth callbacks

// Convenience alias used by the client: /api/logs -> /api/system/logs
router.get('/logs', systemController.getLogs);

module.exports = router;
