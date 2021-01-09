const axios = require('axios')
const HttpError = require('../models/http-error')

const API_KEY = '<your-google-api-key>'

exports.getCoordsForAddress = async (address) => {
  // if not api key
  // return {
  //   lat: 40.7484405,
  //   lng: -73.9878584,
  // }

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  )

  const data = response.data

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for the especified address',
      42
    )
    throw error
  }

  const coordinates = data.results[0].geometry.location

  return coordinates
}
