const express = require('express');
const {
    addClass,
    removeClass,
    getStudentsBySchool,
    addStudentToClass,
    removeStudentFromClass,
    getTeachersBySchool,
    addTeacherToClass,
    removeTeacherFromClass
} = require('../controllers/classController');
const requireUser = require('../middlewares/requireUser'); // JWT auth middleware
const checkAdmin = require('../middlewares/checkAdmin');   // Admin check middleware

const router = express.Router();

// Route for adding a class
router.post('/add', requireUser, checkAdmin, addClass);

// Route for removing a class
router.delete('/remove/:id', requireUser, checkAdmin, removeClass);

// Route for getting all students by school name
router.get('/students', requireUser, checkAdmin, getStudentsBySchool);

// Route for adding a student to a class
router.post('/add-student', requireUser, checkAdmin, addStudentToClass);

// Route for removing a student from a class
router.delete('/remove-student', requireUser, checkAdmin, removeStudentFromClass);

// Route for getting all teachers by school name
router.get('/teachers', requireUser, checkAdmin, getTeachersBySchool);

// Route for adding a teacher to a class
router.post('/add-teacher', requireUser, checkAdmin, addTeacherToClass);

// Route for removing a teacher from a class
router.delete('/remove-teacher', requireUser, checkAdmin, removeTeacherFromClass);

module.exports = router;
