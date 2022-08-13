const HttpError = require('../models/http-error')
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const UserSchema = require('../models/user_schema');


const DUMMY_USERS = [
  {
    id: "u1",
    name: 'Shawn Chiao',
    email: 'test123@gmail.com',
    password: '12345678'
  }
];

const getAllUsers = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await UserSchema.find({}, '-password');
  } catch (err) {
    const error = new HttpError("can't retreive the users data, please try again.", 500)
    return next(error);
  };
  res.status(200).json({users: allUsers.map(user => user.toObject({getters:true}))});
};

const signUpUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError('Invalid inputs passed, please check your data', 422);
    return next(error);
  };

  const { name, email, password, places } = req.body;
  let existUser;
  try {
    existUser = await UserSchema.findOne({ email: email });
    console.log(existUser);
  } catch (err) {
    const error = new HttpError('Something went wrong, please try again', 500);
    return next(error);
  }
  let newUser;
  if (!existUser) {
    newUser = new UserSchema({
      name,
      email,
      password,
      image: "https://i.natgeofe.com/n/9135ca87-0115-4a22-8caf-d1bdef97a814/75552.jpg",
      places
    })
  } else {
    const error = new HttpError('the email is existed, please try again', 500);
    return next(error);
  };
  try {
    console.log(newUser);
    await newUser.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not create the user', 500);
    return next(error);
  }

  res.status(200).json('You have singed up!');

};


const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  return res.status(200).json('You have logged in!');
};

exports.getAllUsers = getAllUsers;
exports.signUpUser = signUpUser;
exports.login = login;
