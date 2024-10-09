const mongoose = require('mongoose');

// Define the Student Schema
const studentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],  // Optional: restrict values to specific genders
    },
    dob: {
        type: Date,
        required: false,
    },
    contactNo: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Simple validation for a 10-digit phone number
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure emails are unique
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],  // Simple email regex validation
    },
    feesPaid: {
        type: Boolean,
        required: false,
        default: false,  // Default to false
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',  // Reference the Class model
        required: false,
    },
    schoolName: {
        type: String,
        unique: true,
        required: true, // Admin's school name
    },
}, {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Student', studentSchema);
