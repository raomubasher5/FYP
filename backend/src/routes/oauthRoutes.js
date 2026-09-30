'use strict';

const express = require('express');
const oauthController = require('../controllers/OAuthController');

const router = express.Router();

// Platform redirects back here after the user authorizes
//   /api/auth/callback/twitter | facebook | instagram | tiktok
router.get('/callback/:platform', oauthController.callback);

module.exports = router;
