const express = require('express');
const HttpError = require('./models/http-error');
const mongoose  = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(express.json());

app.use('/api/places',placesRoutes);
// app.use('/api/user', usersRoutes);

app.use('/api/users',usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  };
  res.status(error.code || 500);
  res.json({message: error.message || 'An unkonwn error occurred!'});
});


mongoose.connect(
  "mongodb+srv://shawnjoe:asdf8869@cluster0.vidsobg.mongodb.net/KKK?retryWrites=true&w=majority",
  () => {
    app.listen(5000);
    console.log('connected to database');
  },
  (err) => {
    console.log(err);
  }
  );
