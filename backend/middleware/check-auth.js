const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  // if (req.method === 'OPTIONS') {
  //   return next();
  // }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed', 403);
    }
   const decodedToken = jwt.verify(token, "this_is_my_secret_key!");
   req.userData = { userId: decodedToken.userId};
   next();
  } catch (err) {
    const error = new HttpError('Authentication falled', 403);
    return next(error);
    
  };

};