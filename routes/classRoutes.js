const express = require('express');
const { getAllClasses, createClass } = require('../controllers/classController');

const router = express.Router();

router.route('/')
    .get(getAllClasses)
    .post(createClass);

module.exports = router;
