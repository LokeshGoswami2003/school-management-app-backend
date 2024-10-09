const mongoose = require('mongoose');

// Define the Student Schema
const studentSchema = new mongoose.Schema({
    name: {
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
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
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
        required: true,
        default: false,  // Default to false
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',  // Reference the Class model
        required: true,
    },
}, {
    timestamps: true,  // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Student', studentSchema);
