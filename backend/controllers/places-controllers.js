const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const PlaceSchema = require('../models/place_schema');


let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];


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

  const { title, description, address, creator, image } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new PlaceSchema({
    title,
    description,
    image,
    location: coordinates,
    address,
    creator
  });
  try {
    await createdPlace.save();
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
    throw new HttpError('Invalid inputs passed, please check your data', 422);
  };

  const { title, description } = req.body;
  const placeId = req.params.pid;

  try {
    PlaceSchema.findByIdAndUpdate(placeId, {
      title, description
    })
  } catch (err) {
    const error = new HttpError('Somthing went wrong, could not update the place.', 500)
    return next(error);
  };
  // let updatedPlace;
  // try {
  //   updatedPlace = await PlaceSchema.findById(placeId);

  //   updatedPlace.title = title;
  //   updatedPlace.description = description;
  // } catch (err) {
  //   const error = new HttpError('Somthing went wrong, could not update the place.', 500)
  //   return next(error);
  // };

  // try {
  //   await updatedPlace.save();
  // } catch (err) {
  //   const error = new HttpError('Somthing went wrong, could not update the place.', 500)
  //   return next(error);
  // };


  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  try {
    await PlaceSchema.findByIdAndDelete(placeId);
  } catch (err) {
    const error = new HttpError('Somthing went wrong, could delete the place', 500);
    return next(error);
  };

  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;