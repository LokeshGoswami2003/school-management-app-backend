const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");
const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

const signupController = async (req, res) => {
    try {
        const { username, email, password, userType, schoolName, gender, dob } =
            req.body;

        if (!email || !password || !username || !userType) {
            return res.send(error(400, "All fields are required"));
        }

        if (userType == "admin") {
            if (!schoolName) {
                return res.send(error(401, "All fields are required"));
            }
        }

        if (userType == "student" || userType == "teacher") {
            if (!gender) {
                return res.send(error(400, "All fields are required"));
            }
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send(error(409, "User is already registered"));
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            userType,
        });
        if (userType === "admin") {
            await Admin.create({
                userId: user._id,
                username,
                email,
                schoolName,
            });
        } else if (userType === "teacher") {
            await Teacher.create({
                userId: user._id,
                username,
                gender,
                dob,
                email,
            });
        } else if (userType === "student") {
            await Student.create({
                userId: user._id,
                username,
                gender,
                dob,
                email,
            });
        }

        return res.send(success(201, "User created successfully"));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

// User Login
const loginController = async (req, res) => {
    try {
        const { email, password, userType } = req.body; // Include userType in the request body

        if (!email || !password || !userType) {
            // Check for userType
            return res.send(error(400, "All fields are required"));
        }

        // Find user by email
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.send(error(404, "User is not registered"));
        }

        // Check if the user type matches
        if (user.userType !== userType) {
            return res.send(error(403, "User type does not match"));
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            return res.send(error(403, "Incorrect password"));
        }

        const accessToken = generateAccessToken({ _id: user._id });
        const refreshToken = generateRefreshToken({ _id: user._id });
        res.cookie("jwt", refreshToken, { httpOnly: true, secure: true });

        return res.send(success(200, { accessToken }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

// Logout
const logoutController = async (req, res) => {
    try {
        res.clearCookie("jwt", { httpOnly: true, secure: true });
        return res.send(success(200, "User logged out"));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

// Refresh Access Token
const refreshAccessTokenController = async (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);

    if (!cookies || !cookies.jwt) {
        return res.send(error(401, "Refresh token in cookie is required"));
    }

    const refreshToken = cookies.jwt;
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_PRIVATE_KEY
        );
        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });

        return res.send(success(201, { accessToken }));
    } catch (err) {
        return res.send(error(401, "Invalid refresh token"));
    }
};

// Internal functions
const generateAccessToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
        expiresIn: "45m",
    });
};

const generateRefreshToken = (data) => {
    return jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
        expiresIn: "1y",
    });
};

module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController,
};
