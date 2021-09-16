const express = require('express');

const auth = require('../middleware/auth');
const PostController = require('../controllers/posts.controllers');

const router = express.Router();

router.get('/api/dashboard', auth, PostController.getDashboard);
// router.get('/api/dashboard/create-post', auth, PostController.getCreatePost);
router.post('/api/dashboard/create-post', auth, PostController.postCreatePost);
router.delete('/api/dashboard/delete-post/:postId', auth, PostController.deletePost);
router.get('/api/dashboard/get-post/:postId', auth, PostController.getPost);

module.exports = router;