const express = require('express');
const authController = require('../controllers/auth.controllers');
const router = express.Router();

const auth = require('../middleware/auth');
const cache = require('../middleware/redis');

router.post('/login', authController.postLogin);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/auth', auth, authController.getUserById);
// router.get('/dashboard/search', auth, authController.searchUsers);
// router.get('/user/:userId', auth, cache, authController.getUser);

module.exports = router;