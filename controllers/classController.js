const Class = require("../models/Class");

const getClassId = async (req, res) => {
    try {
        const { className, schoolName } = req.body;

        const classData = await Class.findOne({ className, schoolName });

        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }

        return res.status(200).json({ classId: classData._id });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const fetchClassController = async (req, res) => {
    try {
        const classId = req.params.classId; // Get class ID from request parameters

        // Fetch the class by ID and populate teachers and students
        const classDetail = await Class.findById(classId)
            .populate("teachersList") // Populate teacher details
            .populate("studentList"); // Populate student details

        if (!classDetail) {
            return res.status(404).json({ message: "Class not found" });
        }

        return res.status(200).json({ class: classDetail });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const createClass = async (req, res) => {
    try {
        const { className, year, classFees, capacity, adminId, userType } =
            req.body;

        console.log(userType + className + "DD");

        // Check if the user is an admin
        if (userType !== "admin") {
            return res
                .status(403)
                .json({ message: "Only admins can create classes" });
        }

        const classes = await Class.find({
            className,
        });
        // Create the class
        const newClass = await Class.create({
            className,
            year,
            classFees,
            capacity,
            adminId,
        });

        return res.status(201).json({
            message: "Class created successfully",
            class: newClass,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { createClass, fetchClassController, getClassId };
