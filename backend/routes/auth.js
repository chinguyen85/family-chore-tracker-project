const express = require('express');
const authController = require('./authController');

const authRouter = express.Router();

// Define routes to handle authentication
authRouter.post('/signup', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/forgot-password', authController.forgotPassword);

module.exports = authRouter;