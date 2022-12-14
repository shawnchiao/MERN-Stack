const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');
const fileUploadForUsers = require('../middleware/file-upload-for-users');


router.get('/', usersControllers.getAllUsers);

router.post(
  '/signup',
  fileUploadForUsers.single('image'),
[
  check('name').notEmpty(),
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({min:6})
],
 usersControllers.signUpUser);

router.post('/login', check('email').normalizeEmail(), usersControllers.login);


module.exports = router;