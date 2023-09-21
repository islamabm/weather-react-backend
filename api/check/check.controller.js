const checkService = require('./check.service.js')

const logger = require('../../services/logger.service.js')
async function checkWeather(req, res) {
  try {
    const { cityName, countryName } = req.body
    console.log('cityName', cityName)
    console.log('countryName', countryName)
    const result = await checkService.query(cityName, countryName)
    res.json(result)
  } catch (err) {
    logger.error('Failed to get stations', err)
    res.status(500).send({ err: 'Failed to get stations' })
  }
}

module.exports = {
  checkWeather,
}
