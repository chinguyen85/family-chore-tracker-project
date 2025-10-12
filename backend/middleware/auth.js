const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming the path is correct

const protect = async (req, res, next) => {
    console.log('Protect middleware invoked');
    let token;

    // Check for the token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by the ID from the token's payload
            // Attach the user to the request object, excluding the password
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'User not found' });
            }

            // Proceed to the next middleware or the route handler
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
};

module.exports = { protect };