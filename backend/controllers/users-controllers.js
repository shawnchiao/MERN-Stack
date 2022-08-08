const HttpError = require('../models/http-error')
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');


const DUMMY_USERS = [
  {
    id: "u1",
    name: 'Shawn Chiao',
    email: 'test123@gmail.com',
    password: '12345678'
  }
];

const getAllUsers = (req, res, next) => {
  res.status(200).json(DUMMY_USERS);
};

const signUpUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data', 422);
  };

  const { name, email, password } = req.body;
  const place = DUMMY_USERS.find(u => u.email === email);
  if (!place) {
    const createPlace = {
      id: uuidv4(),
      name,
      email,
      password
    };
    DUMMY_USERS.push(createPlace);
    res.status(200).json('You have singed up!');
  } else {
    throw new HttpError('Could not create user, email already exists.', 422)
  };

};


const login = (req, res, next) => {
  const { email, password } = req.body;
  const theUser = DUMMY_USERS.find(u => u.email === email && u.password === password);

  if (theUser) {
    return res.status(200).json('You have logged in!');
  }
  throw new HttpError('wrong email or passwords', 401);

};

exports.getAllUsers = getAllUsers;
exports.signUpUser = signUpUser;
exports.login = login;
