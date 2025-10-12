const express = require('express');
const familyController = require('./familyController');
const { protect, authorize } = require('../middleware/auth');

const familyRouter = express.Router();

// Define routes
familyRouter.post('/create', protect, authorize('Supervisor'), familyController.createFamily);
familyRouter.post('/join', protect, familyController.joinFamily);
familyRouter.get('/', protect, familyController.getFamilyDetails);
familyRouter.get('/members', protect, familyController.getFamilyMembers);

module.exports = familyRouter;