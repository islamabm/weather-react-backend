const express = require('express')
const { getWeather } = require('./weather.controller')
const router = express.Router()

router.post('/', getWeather)

module.exports = router
