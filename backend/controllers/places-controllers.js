const fs = require('fs')

const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const PlaceSchema = require('../models/place_schema');
const UserSchema = require('../models/user_schema');
const { default: mongoose } = require('mongoose');



const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await PlaceSchema.findById(placeId);
  } catch (err) {
    const error = new HttpError('Somthing wehnt wrong, could not find a place', 500);
    return next(error);
  };

  if (!place) {
    const error = new HttpError('Could not find a place for the provided id.', 404);
    return next(error);
  } else {
    res.json({ place: place.toObject({ getters: true }) });
  };
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await PlaceSchema.find({ creator: userId });
  } catch (err) {
    const error = new HttpError('Something went wrong, couldn nott find the place', 500);
    return next(error);
  };

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  };
  res.json({ places: places.map(p => p.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError('Invalid inputs passed, please check your data', 422));
  };

  const { title, description, address, creator} = req.body;
  
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new PlaceSchema({
    title,
    description,
    image: 'http://localhost:5000/' + req.file.path,
    location: coordinates,
    address,
    creator
  });

  // check if a exist userid is existing
  let user;
  try {
    user = await UserSchema.findById(creator);
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500)
    return next(error);
  };

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404)
    return next(error);
  }
 
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {

    const error = new HttpError('Creating place failed, please try again.', 500);
    return next(error);
  };

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(HttpError('Invalid inputs passed, please check your data', 422));
  };

  const { title, description } = req.body;
  const placeId = req.params.pid;
  let placeToBeUpdated;
  try {
    placeToBeUpdated = await PlaceSchema.findById(placeId)
  } catch (err) {
    const error = new HttpError('Somthing went wrong, could not update the place.', 500)
    return next(error);
  };

  if (placeToBeUpdated.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not authorized to edit this place', 401)
    return next(error);
  };

  try {
    await PlaceSchema.findByIdAndUpdate(placeId, {
      title, description
    })
  } catch (err) {
    const error = new HttpError('Somthing went wrong, could not update the place.', 500)
    return next(error);
  };
 
  res.status(200).json('updated');
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let thePlace;
  let theUser;
  try {
    thePlace = await PlaceSchema.findById(placeId).populate({path:'creator', model: UserSchema});
    theUser =  await UserSchema.findById(thePlace.creator);
    
  } catch (err) {
    console.log(err)
    const error = new HttpError('a Somthing went wrong, could delete the place', 500);
    return next(error);
  };

  if (thePlace.creator.id !== req.userData.userId) {
    const error = new HttpError('You are not authorized to delete this place.', 401);
    return next(error);
  }

  const imagePath = thePlace.image.replace("http://localhost:5000", "");

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction(); 
    await thePlace.creator.places.pull(thePlace);
    // await theUser.places.pull(placeId)
    // await theUser.save({ session: sess });
    await thePlace.creator.save({session:sess});
    await PlaceSchema.findByIdAndDelete(placeId, { session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError('b Somthing went wrong, could delete the place', 500);
    return next(error);
  };
  fs.unlink("."+imagePath, (err) => console.log(err));
  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;