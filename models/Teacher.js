const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Reference to the User model
        },
        dob: {
            type: String,
            required: true,
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
            type: Date,
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"],
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
        salary: {
            type: Number,
        },
        classList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Class",
            },
        ],
        schoolName: {
            type: String,
            required: true, // Admin's school name
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Teacher", teacherSchema);
