const router = require("express").Router();
const authController = require("../controllers/authController");

// User Signup
router.post("/signup", authController.signupController);

// User Login
router.post("/login", authController.loginController);

// Refresh Access Token
router.get("/refresh", authController.refreshAccessTokenController);

// User Logout
router.post("/logout", authController.logoutController);

router.put("/updateProfile", authController.updateProfileController);

router.get("requireUserObj", authController.requireUserObj);

module.exports = router;
