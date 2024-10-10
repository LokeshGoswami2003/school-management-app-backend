const express = require("express");
const { getTeacherClasses } = require("../controllers/teacherController");

const router = express.Router();

// Route to get all classes for a specific teacher
router.get("/:teacherId/classes", getTeacherClasses);

module.exports = router;
