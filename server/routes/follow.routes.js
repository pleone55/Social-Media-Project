const express = require('express');
const auth = require('../middleware/auth');
const followController = require('../controllers/following.controllers');

const router = express.Router();

// Following Routes
router.post('/user/:userId/follow', auth, followController.postFollowUser);
router.get('/user/:userId/following', auth, followController.getFollowing);
router.post('/user/:userId/unfollow', auth, followController.unfollowUser);

// Follower Routes
router.get('/user/:userId/followers', auth, followController.getFollowers);

module.exports = router