const mongoose = require("mongoose");

// Define the Student Schema
const studentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Reference to the User model
        },
        username: {
            type: String,
            required: true,
            unique: false,
        },
        gender: {
            type: String,
            required: true,
        },
        dob: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v); // Simple validation for a 10-digit phone number
                },
                message: (props) =>
                    `${props.value} is not a valid phone number!`,
            },
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensure emails are unique
            match: [/.+\@.+\..+/, "Please enter a valid email address"], // Simple email regex validation
        },
        feesPaid: {
            type: Boolean,
            required: false,
            default: false, // Default to false
        },
        className: {
            type: String,
            required: true,
        },
        schoolName: {
            type: String,
            required: true, // Admin's school name
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("Student", studentSchema);
