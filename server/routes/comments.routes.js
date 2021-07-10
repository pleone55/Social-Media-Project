const express = require('express');

const auth = require('../middleware/auth');
const CommentController = require('../controllers/comments.controllers');

const router = express.Router();

router.get('/comments/create-comment/:postId', auth, CommentController.getCreateComment);
router.post('/comments/create-comment/:postId', auth, CommentController.postCreateComment);
router.post('/comments/delete-comment', auth, CommentController.deleteComment);

module.exports = router;