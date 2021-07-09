const express = require('express');

const auth = require('../middleware/auth');
const PostController = require('../controllers/posts.controllers');

const router = express.Router();

router.get('/dashboard', auth, PostController.getDashboard);
router.get('/dashboard/create-post', auth, PostController.getCreatePost);
router.post('/dashboard/create-post', auth, PostController.postCreatePost);
router.post('/dashboard/delete-post', auth, PostController.deletePost);
router.get('/dashboard/get-post/:postId', auth, PostController.getPost);

module.exports = router;