const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');

const authRouter = express.Router();

// Define routes
router.post('/signup', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword); 

module.exports = authRouter;