const express = require('express')

// routes
const placesRoutes = require('./routes/places-routes')

const app = express()

app.use('/api/places', placesRoutes) // /api/places/...
// app.use(express.json())


app.listen(5000)