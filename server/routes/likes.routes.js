const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const PostLikesController = require('../controllers/postLikes.controllers');
const CommentLikesController = require('../controllers/commentLikes.controllers');

router.post('/dashboard/:postId/like-post', auth, PostLikesController.postPostLikes);
router.post('/dashboard/get-post/:postId/like-comment/:commentId', auth, CommentLikesController.postCommentLikes);

module.exports = router;