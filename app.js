const express = require('express')

// routes
const placesRoutes = require('./routes/places-routes')

const app = express()

app.use(placesRoutes)
// app.use(express.json())


app.listen(5000)