// User schema includes fields for email, password (hashed), fullName, role (supervisor/member), familyId, and starTotal
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['Supervisor', 'Member'],
        default: 'Member', 
    },
    familyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family',
        required: false // Can be set later when creating/joining a family group
    },
    starTotal: {
        type: Number,
        default: 0
    },
});

// Customize JSON output to convert _id to a string and exclude sensitive information
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.password; // Exclude password hash
    }
});

// Pre-save hook to hash passwords
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next(); // Only hash if password is new or modified
    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash the password with salt
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare password for login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_TOKEN, {
        expiresIn: '30d'
    });
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;