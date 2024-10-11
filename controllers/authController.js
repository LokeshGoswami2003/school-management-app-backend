const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");
const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Class = require("../models/Class");

const signupController = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            userType,
            schoolName,
            gender,
            dob,
            salary,
            className,
        } = req.body;

        console.log(
            `${email} ${password} ${username} ${userType} ${schoolName} ${gender} ${dob} ${salary} ${className}`
        );

        if (
            !email ||
            !password ||
            !username ||
            !userType ||
            !schoolName ||
            !gender ||
            !dob
        ) {
            return res.send(error(400, "All fields are required"));
        }

        if (userType === "student" || userType === "teacher") {
            console.log("1");

            if (!className) {
                return res.send(error(400, "className is required"));
            }

            if (userType === "teacher" && !salary) {
                return res.send(error(400, "Salary is required"));
            }

            console.log("2");

            const adminExists = await Admin.findOne({ schoolName });
            console.log(adminExists);

            if (!adminExists) {
                return res.send(error(400, "School name does not exist"));
            }

            console.log("3");

            const classes = await Class.findOne({ className });
            console.log("4");

            if (!classes) {
                return res.send(error(400, "Class does not exist"));
            }

            console.log("this is my class" + classes);

            if (classes.totalStudents == classes.capacity) {
                return res.send(error(400, "Class is full"));
            }

            console.log("11");

            // Update the male and female counts based on the user's gender
            if (gender.toLowerCase() === "male") {
                classes.maleCount += 1;
            } else if (gender.toLowerCase() === "female") {
                classes.femaleCount += 1;
            }

            classes.totalStudents += 1; // Increment the total students count

            await classes.save();
            console.log("12");
        } else if (userType === "admin") {
            const existingAdmin = await Admin.findOne({ schoolName });

            if (existingAdmin) {
                return res.send(error(400, "School name already taken"));
            }
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send(error(409, "User is already registered"));
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("I am here");

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            userType,
            gender,
            schoolName,
            salary,
            dob,
        });

        // Assign className (ObjectId) for student or teacher
        if (userType === "student" || userType === "teacher") {
            const classData = await Class.findOne({ className });

            if (!classData) {
                return res.send(error(404, "Class not found"));
            }

            user.className = classData._id; // Assign the ObjectId of the class
        }

        console.log("Our user", user);

        // Add the userId field based on the user's `_id`
        user.userId = user._id;
        await user.save(); // Save the user again with userId

        console.log("User saved", user);

        if (userType === "admin") {
            await Admin.create({
                userId: user._id,
                username,
                email,
                userType,
                schoolName,
                gender,
                dob,
            });
        } else if (userType === "teacher") {
            const t = await Teacher.create({
                userId: user._id,
                username,
                gender,
                dob,
                email,
                userType,
                schoolName,
                dob,
                salary,
                className: user.className, // Save the ObjectId of the class
            });
            console.log("Teacher created", t);
        } else if (userType === "student") {
            await Student.create({
                userId: user._id,
                username,
                gender,
                dob,
                email,
                userType,
                schoolName,
                className: user.className, // Save the ObjectId of the class
            });
        }

        delete user.password; // Remove password before returning the user

        return res.send(success(201, { user }));
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
        delete user.password;
        console.log(user);

        return res.send(success(200, { accessToken, user }));
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
const requireUserObj = async (req, res) => {
    const user = awaitrequireUser(req).user;
    console.log(user);

    return res.send(success(201, { user }));
};
const updateProfileController = async (req, res) => {
    try {
        const { username, email, phone, dob, userType, userId, gender } =
            req.body;
        console.log(gender + "nnngendernnn");

        console.log(username, email, phone, dob + " `````", userId + "hh");
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email, phone, dob, gender }, // Update these fields
            { new: false, runValidators: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("kdmld" + updatedUser);

        // Update corresponding userType model based on userType
        if (userType === "admin") {
            const updatedAdmin = await Admin.findOneAndUpdate(
                { userId: userId },
                { username, email, phone, dob, gender }, // Update admin fields if needed
                { new: false, runValidators: true } // Return the updated document
            );

            if (!updatedAdmin) {
                return res
                    .status(404)
                    .json({ message: "Admin details not found" });
            }
            console.log("s", updatedAdmin);
        } else if (userType === "teacher") {
            const updatedTeacher = await Teacher.findOneAndUpdate(
                { userId: userId },
                { username, email, phone, gender, dob }, // Update teacher fields if needed
                { new: false, runValidators: true }
            );

            if (!updatedTeacher) {
                return res
                    .status(404)
                    .json({ message: "Teacher details not found" });
            }
            console.log("t", updatedTeacher);
        } else if (userType === "student") {
            const updatedStudent = await Student.findOneAndUpdate(
                { userId: userId },
                { username, email, phone, gender, dob }, // Update student fields if needed
                { new: false, runValidators: true }
            );

            if (!updatedStudent) {
                return res
                    .status(404)
                    .json({ message: "Student details not found" });
            }
            console.log("s", updatedStudent);
        }

        return res
            .status(200)
            .json({ message: "Profile updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController,
    updateProfileController,
    requireUserObj,
};
