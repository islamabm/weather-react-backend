const express = require('express')
const {} = require('../../middlewares/requireAuth.middleware')

const { checkWeather } = require('./check.controller')
const router = express.Router()

router.post('/', checkWeather)

module.exports = router
