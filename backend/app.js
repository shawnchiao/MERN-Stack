const fs = require('fs');
const path = require('path');

const express = require('express');
const HttpError = require('./models/http-error');
const mongoose  = require('mongoose');
var cors = require('cors')

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use(express.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use(cors());

app.use('/api/places',placesRoutes);
// app.use('/api/user', usersRoutes);

app.use('/api/users',usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => console.log(err));
  };

  if (res.headerSent) {
    return next(error);
  };
  res.status(error.code || 500);
  res.json({message: error.message || 'An unkonwn error occurred!'});
});


mongoose.connect(
  "mongodb+srv://shawnjoe:asdf8869@cluster0.vidsobg.mongodb.net/MERN?retryWrites=true&w=majority",
  () => {
    app.listen(5000);
    console.log('connected to database');
  },
  (err) => {
    console.log(err);
  }
  );
