const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')

// routes
const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error')

const app = express()

app.use(express.json())

app.use('/api/places', placesRoutes) // /api/places/...
app.use('/api/users', usersRoutes) // /api/users/...

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

const PORT = process.env.PORT || 5000
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(
      PORT,
      console.log(
        `Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
      )
    )
  })
  .catch((err) => {
    console.log(err)
  })
