const express = require("express");
const { getAdminClasses } = require("../controllers/adminController");

const router = express.Router();

// Route to get all classes for a specific admin
router.get("/:adminId/classes", getAdminClasses);

module.exports = router;
