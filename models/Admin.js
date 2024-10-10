const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Reference to the User model
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
        gender: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: false, // Admin's name
        },
        email: {
            type: String,
            required: true,
            unique: true, // Ensure unique email for admin
            match: [/.+\@.+\..+/, "Please enter a valid email address"], // Basic email validation
        },
        schoolName: {
            type: String,
            required: true, // Admin's school name
        },
        dob: {
            type: String,
            required: true,
        },
        classList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class",
            },
        ],
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model("Admin", adminSchema);
