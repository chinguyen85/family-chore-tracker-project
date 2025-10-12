const express = require('express');
const { createFamily, getFamilyById, joinFamily } = require('./familyController');
const { protect } = require('../middleware/auth');

const familyRouter = express.Router();

// Define routes
familyRouter.post('/create', protect, createFamily);
familyRouter.get('/:familyId', protect, getFamilyById);
familyRouter.post('/join', protect, joinFamily);

module.exports = familyRouter;