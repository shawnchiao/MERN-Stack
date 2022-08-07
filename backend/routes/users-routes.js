const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/users-controllers');


router.get('/', usersControllers.getAllUsers);

router.post('/signup', usersControllers.signUpUser);

router.post('/login', usersControllers.login);


module.exports = router;