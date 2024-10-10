const mongoose = require("mongoose");

// Define the Class Schema
const classSchema = new mongoose.Schema(
    {
        className: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        teachersList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Teacher",
            },
        ],
        classFees: {
            type: Number,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
        studentList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        adminId: {
            // New field to store the Admin who owns this class
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        totalStudents: {
            type: Number,
            default: 0, // Default value for total students
        },
        maleCount: {
            type: Number,
            default: 0, // Default value for male students
        },
        femaleCount: {
            type: Number,
            default: 0, // Default value for female students
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Class", classSchema);
