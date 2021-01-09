const express = require('express')
const router = express.Router()

const DUMMY_PLACES = [
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
  {
    id: 'p2',
    title: 'Emp. State Building',
    description: 'One of the most famous skyscrapers is the world!',
    imageUrl:
      'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: 'u2',
  },
]

// @desc    get place by id
// @route   /api/places/:placeId
// @access
router.get('/:placeId', (req, res, next) => {
  const placeId = req.params.placeId
  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId
  })

  res.json({ place })
})

// @desc    get place by user id
// @route   /api/places/user/:userId
// @access
router.get('/user/:userId',( req, res, next) => {
  const userId = req.params.userId

  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId
  })

  res.json({place})
})

module.exports = router
