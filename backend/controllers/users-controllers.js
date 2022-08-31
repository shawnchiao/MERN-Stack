const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = require('../models/user_schema');

const getAllUsers = async (req, res, next) => {
  let allUsers;
  try {
    allUsers = await UserSchema.find({}, '-password');
  } catch (err) {
    const error = new HttpError("can't retreive the users data, please try again.", 500)
    return next(error);
  };
  res.status(200).json({ users: allUsers.map(user => user.toObject({ getters: true })) });
};

const signUpUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError('Invalid inputs passed, please check your data', 422);
    return next(error);
  };

  const { name, email, password, image } = req.body;

  let existUser;
  try {
    existUser = await UserSchema.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Something went wrong, please try again', 500);
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  }
  catch (err) {
    const error = HttpError('Could not create user, please try again.', 500);
    return next(error);
  };


  let newUser;
  if (!existUser) {
    newUser = new UserSchema({
      name,
      email,
      password: hashedPassword,
      places: [],
      image: req.file && !image ? 'http://localhost:5000/' + req.file.path : image
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
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "this_is_my_secret_key!",
      { expiresIn: '1h' }
    )
  } catch (err) {
    const error = new HttpError('Something went wrong, could not create the user', 500);
    return next(error);
  };

  res
    .status(201)
    .json({ userId: newUser.id, email: newUser.email, token: token });

};


const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await UserSchema.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'You have not signed up yet, please sign up an account',
      401
    );
    return next(error);
  }

  let isValidPasspord;
  try {
    isValidPasspord = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Couldn't log in now, please try again.",
      500
    );
    return next(error);
  };

  if (!isValidPasspord) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401)
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "this_is_my_secret_key!",
      { expiresIn: '1h' }
    )
  } catch (err) { 
    const error = new HttpError(
      "Couldn't log in now, please try again.",
      500
    );
    return next(error);
  };

  res
    .status(200)
    // .json({ 
    //   message: 'You have logged in!', user: existingUser.toObject({ getters: true }) });
    .json({ 
        userId: existingUser.id,
        email: existingUser.email,
        token:token
       });
};

exports.getAllUsers = getAllUsers;
exports.signUpUser = signUpUser;
exports.login = login;
