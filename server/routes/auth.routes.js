const express = require('express');
const authController = require('../controllers/auth.controllers');
const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignUp);
// router.post('/login', authController);
router.post('/signup', authController.postSignup);
// router.post('/logout', authController);

module.exports = router;