const express = require("express");
const {
    createClass,
    fetchClassController,
} = require("../controllers/classController");

const router = express.Router();

// Route to create a new class
router.post("/", createClass);
router.get("/:classId", fetchClassController);

module.exports = router;
