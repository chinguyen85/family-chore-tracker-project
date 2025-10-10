const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');

// Helper function to get token from user and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Get token
    const token = user.getSignedJwtToken();

    // Send response in JSON
    res.status(statusCode).json({
        success: true,
        token,
        // Send basic user data back to the client
        user: { 
            id: user._id, 
            fullName: user.fullName, 
            email: user.email,
            role: user.role,
            familyId: user.familyId,
            starTotal: user.starTotal
        }
    });
};

// Handle user signup request (route POST /signup)
exports.register = async (req, res, next) => {
    console.log('Signup attempt received for email:', req.body.email);
    const { fullName, email, password } = req.body;

    try {
        // Check if this is the first user
        const userCount = await User.countDocuments({});
        const role = userCount === 0 ? 'supervisor' : 'member'; // Assign first user as supervisor
        
        // Create user
        const user = await User.create({
            fullName,
            email,
            password,
            role
        });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        // Response with bad request status & error message
        res.status(400).json({ success: false, error: err.message });
        res.redirect('/register');
    }
};

// Handle user login request (route POST /login)
exports.login = async (req, res, next) => {
    console.log('Login attempt received for email:', req.body.email);
    const { email, password } = req.body;
    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password'); // Include password for comparison
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' }); // 401 Unauthorized
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' }); // 500 Server error
        res.redirect('/login');
    }
};

// Handle forgot password request (route POST /forgot-password)
exports.forgotPassword = async (req, res, next) => {
    console.log('Forgot password attempt received for email:', req.body.email);
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
         return res.status(400).json({ success: false, error: 'Please provide email and new password' });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        // Update the password (Mongoose pre-save hook handles hashing)
        user.password = newPassword; 
        await user.save();
        res.status(200).json({ success: true, data: 'Password updated successfully. Please log in with new password.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
        res.redirect('/forgot-password');
    }
};