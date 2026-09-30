'use strict';

const express = require('express');
const profileController = require('../controllers/ProfileController');

const router = express.Router();

router.get('/', profileController.get);
router.put('/', profileController.update);
router.post('/ai-config', profileController.updateAIConfig);

module.exports = router;
