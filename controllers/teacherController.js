const Teacher = require("../models/Teacher");
const Class = require("../models/Class");

const getTeacherClasses = async (req, res) => {
    try {
        const teacherId = req.params.teacherId; // Get teacher ID from request params
        console.log(teacherId);

        // Fetch all classes
        const classes = await Class.find()
            .populate("teachersList")
            .populate("studentList");

        // Filter classes that contain the teacherId in their teachersList
        const teacherClasses = classes.filter((classItem) =>
            classItem.teachersList
                .map((teacher) => teacher.toString())
                .includes(teacherId)
        );

        if (teacherClasses.length === 0) {
            return res
                .status(404)
                .json({ message: "No classes found for this teacher" });
        }

        return res.status(200).json({ classes: teacherClasses });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getTeacherClasses };
