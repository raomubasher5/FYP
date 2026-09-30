'use strict';

const express = require('express');
const accountController = require('../controllers/AccountController');

const router = express.Router();

router.get('/', accountController.getAll);
router.post('/', accountController.create);
router.post('/:id/toggle', accountController.toggleConnection);
router.post('/:id/mode', accountController.setMode);
router.delete('/:id', accountController.delete);

module.exports = router;
