const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
    },
    dob: {
        type: Date,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    contactNo: {
        type: String,
        required: false,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    salary: {
        type: Number,
        required: false,
    },
    assignedClasses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Teacher', teacherSchema);
