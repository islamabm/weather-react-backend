const axios = require('axios')
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
require('dotenv').config()

async function get(city, country, handleSave) {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json`,
      {
        params: {
          key: process.env.WEATHER_API_KEY,
          q: `${city},${country}`,
          aqi: 'no',
        },
      }
    )

    const weather = response.data.current.temp_c
    const weatherData = prepareData(city, country, weather)
    if (handleSave === 'add') await add(weatherData)
    console.log('weather', weather)
    return weather
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw new Error('Failed to fetch weather data')
  }
}

function prepareData(cityName, countryName, value) {
  return {
    cityName,
    countryName,
    value,
    date: Date.now(),
  }
}

async function add(weatherData) {
  try {
    const collection = await dbService.getCollection('weather')
    await collection.insertOne(weatherData)
  } catch (err) {
    logger.error('cannot insert station', err)
    throw err
  }
}
module.exports = {
  get,
}
