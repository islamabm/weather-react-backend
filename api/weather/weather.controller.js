const weatherService = require('./weather.service')

async function getWeather(req, res) {
  try {
    const { cityName, countryName } = req.body

    const weatherData = await weatherService.get(cityName, countryName, 'add')

    res.json({ temp_c: weatherData })
  } catch (error) {
    console.error(`Error generating image: ${error}`)
    res.status(500).send({ error: 'Failed to get weather data' })
  }
}

module.exports = {
  getWeather,
}
