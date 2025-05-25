const express = require('express');
const router = express.Router();
exports.router = router;
const UserController = require('../controller/user');


router.post('/signup', UserController.createUser)

router.post('/login', UserController.loginUser)

module.exports = router