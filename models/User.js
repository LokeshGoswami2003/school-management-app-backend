const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User Schema
const userSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        dob: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensure unique email
            match: [/.+\@.+\..+/, "Please enter a valid email address"], // Basic email validation
        },
        password: {
            type: String,
            required: true,
        },
        userType: {
            type: String,
            required: true,
            enum: ["admin", "teacher", "student"], // Different user types
        },
        schoolName: {
            type: String,
            required: true, // Admin's school name
        },
        gender: {
            type: String,
            required: true,
        },
        salary: {
            type: Number,
        },
        className: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class", // Reference the Class model
        },
        phone: {
            type: String,
            required: false,
            validate: {
                validator: function (v) {
                    return /^\d{10}$/.test(v);
                },
                message: (props) =>
                    `${props.value} is not a valid phone number!`,
            },
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("User", userSchema);
