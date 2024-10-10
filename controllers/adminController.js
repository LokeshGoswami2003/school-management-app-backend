const Admin = require("../models/Admin");
const Class = require("../models/Class");

const getAdminClasses = async (req, res) => {
    try {
        const adminId = req.params.adminId; // Get admin ID from request params
        console.log(adminId);

        // Fetch all classes
        const classes = await Class.find()
            .populate("teachersList")
            .populate("studentList");

        // Filter classes that belong to the given admin ID
        const adminClasses = classes.filter(
            (classItem) => classItem.adminId.toString() === adminId
        );

        if (adminClasses.length === 0) {
            return res
                .status(404)
                .json({ message: "No classes found for this admin" });
        }

        return res.status(200).json({ classes: adminClasses });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAdminClasses };
