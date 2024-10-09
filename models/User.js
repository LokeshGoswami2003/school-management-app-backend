const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,  // Ensure unique username
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure unique email
        match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Basic email validation
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: ['admin', 'teacher', 'student'], // Different user types
    },
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
});


module.exports = mongoose.model('User', userSchema);
