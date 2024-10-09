const mongoose = require('mongoose');

// Define the Class Schema
const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    teachersList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
    }],
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    classFees: {
        type: Number,
        required: true,
    },
    studentList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Class', classSchema);
