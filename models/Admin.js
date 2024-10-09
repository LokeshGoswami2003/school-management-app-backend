const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Reference to the User model
    },
    username: {
        type: String,
        required: true, // Admin's name
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure unique email for admin
        match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Basic email validation
    },
    schoolName: {
        type: String,
        required: true, // Admin's school name
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Admin', adminSchema);
