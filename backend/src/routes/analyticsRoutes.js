'use strict';

const express = require('express');
const analyticsController = require('../controllers/AnalyticsController');

const router = express.Router();

router.get('/', analyticsController.getOverview);
router.post('/comments', analyticsController.addComment);

module.exports = router;
