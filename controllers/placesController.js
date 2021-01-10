const { v4 } = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../utils/location')
const Place = require('../models/PlaceModel')

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous skyscrapers is the world!',
    imageUrl:
      'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u1',
  },
  // {
  //   id: 'p2',
  //   title: 'Emp. State Building',
  //   description: 'One of the most famous skyscrapers is the world!',
  //   imageUrl:
  //     'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  //   address: '20 W 34th St, New York, NY 10001',
  //   location: {
  //     lat: 40.7484405,
  //     lng: -73.9878584,
  //   },
  //   creator: 'u2',
  // },
]

// @desc    get place by id
// @route   GET /api/places/:placeId
// @access  private
exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    )
    return next(error)
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place of the provided id.',
      404
    )
    return next(error)
  }

  res.json({ place: place.toObject({ getters: true }) })
}

// @desc    get place by user id
// @route   GET /api/places/user/:userId
// @access  private
exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId

  let places
  try {
    places = await Place.find({ creator: userId }).exec()
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    )

    return next(error)
  }

  if (!places || places.length === 0) {
    const error = new HttpError(
      'Could not find places of the provided user id.',
      404
    )

    return next(error)
  }

  res.json({ places: places.map((place) => place.toObject({ getters: true })) })
}

// @desc    get place by user id
// @route   POST /api/places/
// @access  private
exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors)
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422)
    )
  }

  const { title, description, address, creator } = req.body

  let coordinates
  try {
    coordinates = await getCoordsForAddress(address)
  } catch (err) {
    return next(err)
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://images.pexels.com/photos/5499131/pexels-photo-5499131.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    creator,
  })

  try {
    await createdPlace.save()
  } catch (err) {
    const error = new HttpError('Creating place failed, please try again.', 500)
    return next(error)
  }

  res.status(201).json({ place: createdPlace })
}

// @desc    get place by user id
// @route   PATCH /api/places/:placeId
// @access  private
exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error =  new HttpError('Invalid inputs passed, please check your data', 422)
    return next(error)
  }

  const { title, description } = req.body
  const placeId = req.params.placeId

  let place
  try {
    place = await Place.findById(placeId).exec()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place',
      500
    )
    return next(error)
  }

  place.title = title
  place.description = description

  try {
    await place.save()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place',
      500
    )
    return next(error)
  }

  res.status(200).json({ place: place.toObject({ getters: true }) })
}

// @desc    get place by user id
// @route   DELETE /api/places/:placeId
// @access  private
exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place',
      500
    )
    return next(error)
  }

  try {
    await place.remove()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place',
      500
    )
    return next(error)
  }

  res.status(200).json({ message: 'Deleted place.' })
}
