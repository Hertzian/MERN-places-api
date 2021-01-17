const fs = require('fs')
const path = require('path')
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

// middleware to access images
app.use('/uploads/images', express.static(path.join('uploads', 'images')))

// to prevent CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404)
  throw error
})

// error handling
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err)
    })
  }

  if (res.headerSent) {
    return next(error)
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occurred!' })
})

const PORT = process.env.PORT || 5000

mongoose
.connect(process.env.MONGO_URI, { // with dotenv
  // .connect(
  //   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-qhfig.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  //   {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log('Conected to MongoDB')
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
