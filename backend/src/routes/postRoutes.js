const express = require('express');
const postController = require('../controllers/PostController');

const router = express.Router();

router.get('/', postController.getAll);
router.post('/', postController.create);
router.post('/generate', postController.generate);
router.get('/:id', postController.getById);
router.put('/:id', postController.update);
router.delete('/:id', postController.delete);
router.post('/:id/approve', postController.approve);
router.post('/:id/publish-now', postController.publishNow);

module.exports = router;
