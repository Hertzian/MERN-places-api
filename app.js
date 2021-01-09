const express = require('express')

// routes
const placesRoutes = require('./routes/places-routes')
const HttpError = require('./models/http-error')

const app = express()

app.use(express.json())

app.use('/api/places', placesRoutes) // /api/places/...

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404)
  throw error
})

// error handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occurred!' })
})

app.listen(5000)
