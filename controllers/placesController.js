const { v4 } = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const getCoordsForAddress = require('../utils/location')

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
exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId
  const place = DUMMY_PLACES.find((p) => p.id === placeId)

  if (!place) {
    throw new HttpError('Could not find a place of the provided id.', 404)
  }
  res.json({ place })
}

// @desc    get place by user id
// @route   GET /api/places/user/:userId
// @access  private
exports.getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId

  const places = DUMMY_PLACES.filter((p) => p.creator === userId)

  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places of the provided user id.', 404)
    )
  }

  res.json({ places })
}

// @desc    get place by user id
// @route   POST /api/places/
// @access  private
exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors)
    // throw new HttpError('Invalid inputs passed, please check your data', 422)
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

  const createdPlace = {
    id: v4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  }

  DUMMY_PLACES.push(createdPlace) // unshift(createdPlace) for first element

  res.status(201).json({ place: createdPlace })
}

// @desc    get place by user id
// @route   PATCH /api/places/:placeId
// @access  private
exports.updatePlace = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    console.log(errors)
    // res.status(422)
    throw new HttpError('Invalid inputs passed, please check your data', 422)
  }

  const { title, description } = req.body
  const placeId = req.params.placeId

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId)

  updatedPlace.title = title
  updatedPlace.description = description

  DUMMY_PLACES[placeIndex] = updatedPlace

  res.status(200).json({ place: updatedPlace })
}

// @desc    get place by user id
// @route   DELETE /api/places/:placeId
// @access  private
exports.deletePlace = (req, res, next) => {
  const placeId = req.params.placeId

  if (DUMMY_PLACES.find((place) => place.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404)
  }

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId)

  res.status(200).json({ message: 'Deleted place.' })
}
