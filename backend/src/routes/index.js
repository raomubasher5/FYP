'use strict';

const express = require('express');
const postRoutes = require('./postRoutes');
const {
  profileController,
  accountController,
  analyticsController,
  systemController
} = require('../controllers');

const router = express.Router();

// 1. Profile Routes
const profileRouter = express.Router();
profileRouter.get('/', profileController.get);
profileRouter.put('/', profileController.update);
profileRouter.post('/ai-config', profileController.updateAIConfig);

// 2. Accounts Routes
const accountRouter = express.Router();
accountRouter.get('/', accountController.getAll);
accountRouter.post('/', accountController.create);
accountRouter.post('/:id/toggle', accountController.toggleConnection);
accountRouter.post('/:id/mode', accountController.setMode);
accountRouter.delete('/:id', accountController.delete);

// 3. Analytics Routes
const analyticsRouter = express.Router();
analyticsRouter.get('/', analyticsController.getOverview);
analyticsRouter.post('/comments', analyticsController.addComment);

// 4. System Routes
const systemRouter = express.Router();
systemRouter.get('/logs', systemController.getLogs);
systemRouter.post('/reset', systemController.resetDemo);

// Mount All Submodules under /api
router.use('/posts', postRoutes);
router.use('/profile', profileRouter);
router.use('/accounts', accountRouter);
router.use('/analytics', analyticsRouter);
router.use('/system', systemRouter);
router.get('/logs', systemController.getLogs);

module.exports = router;
