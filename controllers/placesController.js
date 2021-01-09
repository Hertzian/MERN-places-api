const HttpError = require('../models/http-error')
const { v4 } = require('uuid')

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
// @route   /api/places/:placeId
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
// @route   /api/places/user/:userId
// @access  private
exports.getPlaceByUserId = (req, res, next) => {
  const userId = req.params.userId

  const place = DUMMY_PLACES.find((p) => p.creator === userId)

  if (!place) {
    return next(
      new HttpError('Could not find a place of the provided user id.', 404)
    )
  }

  res.json({ place })
}

// @desc    get place by user id
// @route   POST /api/places/
// @access  private
exports.createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body

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
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId)

  res.status(200).json({ message: 'Deleted place.' })
}
