const Class = require("../models/Class");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Admin = require("../models/Admin");
const { error, success } = require("../utils/responseWrapper");

// Get all students subscribed to the admin's school
// Add a class (Admins only)
const addClass = async (req, res) => {
    try {
        const { className, year, teachersList, studentFees, studentList } =
            req.body;

        // Validate required fields
        if (!className || !year || !studentFees) {
            return res.send(error(400, "All fields are required"));
        }

        // Create the new class
        const newClass = await Class.create({
            className,
            year,
            teachersList,
            studentFees,
            studentList,
        });

        return res.send(success(201, newClass));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

// Remove a class (Admins only)
const removeClass = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the class by ID
        const classData = await Class.findByIdAndDelete(id);
        if (!classData) {
            return res.send(error(404, "Class not found"));
        }

        return res.send(success(200, "Class removed successfully"));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};
const getStudentsBySchool = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user._id }); // Get the admin
        if (!admin) {
            return res.send(error(404, "Admin not found"));
        }

        // Find all students with the same school name
        const students = await Student.find({
            schoolName: admin.schoolName,
        }).populate("userId");

        return res.send(success(200, students));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

// Add a student to a class
const addStudentToClass = async (req, res) => {
    try {
        const { classId, studentId } = req.body;

        // Validate input
        if (!classId || !studentId) {
            return res.send(error(400, "Class ID and Student ID are required"));
        }

        // Check if the student is already in another class
        const existingClass = await Class.findOne({ studentList: studentId });
        if (existingClass) {
            return res.send(error(400, "Student is already in a class"));
        }

        // Find the class and add the student
        const classData = await Class.findById(classId);
        if (!classData) {
            return res.send(error(404, "Class not found"));
        }

        // Add the student to the class
        classData.studentList.push(studentId);
        await classData.save();

        return res.send(success(200, "Student added to the class"));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

// Remove a student from a class
const removeStudentFromClass = async (req, res) => {
    try {
        const { classId, studentId } = req.body;

        if (!classId || !studentId) {
            return res.send(error(400, "Class ID and Student ID are required"));
        }

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.send(error(404, "Class not found"));
        }

        // Remove the student from the class
        classData.studentList = classData.studentList.filter(
            (id) => id.toString() !== studentId
        );
        await classData.save();

        return res.send(success(200, "Student removed from the class"));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

// Get all teachers subscribed to the admin's school
const getTeachersBySchool = async (req, res) => {
    try {
        const admin = await Admin.findOne({ userId: req.user._id });
        if (!admin) {
            return res.send(error(404, "Admin not found"));
        }

        // Find all teachers with the same school name
        const teachers = await Teacher.find({
            schoolName: admin.schoolName,
        }).populate("userId");

        return res.send(success(200, teachers));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

// Add a teacher to a class
const addTeacherToClass = async (req, res) => {
    try {
        const { classId, teacherId } = req.body;

        if (!classId || !teacherId) {
            return res.send(error(400, "Class ID and Teacher ID are required"));
        }

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.send(error(404, "Class not found"));
        }

        // Add the teacher to the class
        classData.teachersList.push(teacherId);
        await classData.save();

        return res.send(success(200, "Teacher added to the class"));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

// Remove a teacher from a class
const removeTeacherFromClass = async (req, res) => {
    try {
        const { classId, teacherId } = req.body;

        if (!classId || !teacherId) {
            return res.send(error(400, "Class ID and Teacher ID are required"));
        }

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.send(error(404, "Class not found"));
        }

        // Remove the teacher from the class
        classData.teachersList = classData.teachersList.filter(
            (id) => id.toString() !== teacherId
        );
        await classData.save();

        return res.send(success(200, "Teacher removed from the class"));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

module.exports = {
    addClass,
    removeClass,
    getStudentsBySchool,
    addStudentToClass,
    removeStudentFromClass,
    getTeachersBySchool,
    addTeacherToClass,
    removeTeacherFromClass,
};
