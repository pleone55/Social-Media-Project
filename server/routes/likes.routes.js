const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const PostLikesController = require('../controllers/postLikes.controllers');

router.post('/dashboard/:postId/like-post', auth, PostLikesController.postPostLikes);

module.exports = router;