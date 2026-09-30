'use strict';

const express = require('express');
const accountController = require('../controllers/AccountController');
const oauthController = require('../controllers/OAuthController');

const router = express.Router();

router.get('/', accountController.getAll);
router.post('/', accountController.create);
router.post('/:id/toggle', accountController.toggleConnection);
router.post('/:id/mode', accountController.setMode);
router.delete('/:id', accountController.delete);
// Live platform connections (OAuth 2.0)
router.get('/:platform/connect', oauthController.startConnect);
router.get('/live-status', oauthController.liveStatus);

module.exports = router;
