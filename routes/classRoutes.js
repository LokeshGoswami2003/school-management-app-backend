const express = require("express");
const {
    createClass,
    fetchClassController,
    getClassId,
} = require("../controllers/classController");

const router = express.Router();

// Route to create a new class
router.post("/", createClass);
router.get("/:classId", fetchClassController);
router.get("/get-class-id", getClassId);

module.exports = router;
