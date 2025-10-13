const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to protect routes and ensure the user is authenticated
const protect = async (req, res, next) => {
    console.log('Protect middleware invoked');
    let token;

    // Check for the token in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_TOKEN);

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

// Middleware to authorize based on user roles
const authorize = (roles = []) => {
    console.log('Authorize middleware invoked with roles:', roles);
    // Convert roles to an array if it is a single string
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        // Check if user exits and has one of the required roles
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: `Forbidden. User role ${req.user.role} not authorized.` });
        }
        
        // If authorization successful, proceed
        next();
    };
}

module.exports = { protect, authorize };