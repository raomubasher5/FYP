'use strict';

const express = require('express');
const systemController = require('../controllers/SystemController');

const router = express.Router();

router.get('/logs', systemController.getLogs);
router.get('/ollama-models', systemController.getOllamaModels);
router.post('/reset', systemController.resetDemo);

module.exports = router;
