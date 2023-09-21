const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const { get } = require('../weather/weather.service')

async function query(cityName, country) {
  try {
    const collection = await dbService.getCollection('weather')
    const cityData = await collection.findOne({ cityName })

    if (!cityData) {
      return { exists: false }
    }

    const currentDate = new Date()
    const cityDate = new Date(cityData.date)

    const isSameDay =
      currentDate.getDate() === cityDate.getDate() &&
      currentDate.getMonth() === cityDate.getMonth() &&
      currentDate.getFullYear() === cityDate.getFullYear()

    if (!isSameDay) {
      await updateWeather(cityName, country)
      return { exists: true, isSameDay: false }
    }

    return { exists: true, isSameDay }
  } catch (err) {
    logger.error('cannot find stations', err)
    throw err
  }
}

async function updateWeather(city, country) {
  try {
    const weather = await get(city, country, 'update')
    console.log('weather', weather)

    const collection = await dbService.getCollection('weather')
    await collection.updateOne(
      { cityName: city },
      {
        $set: {
          date: Date.now(),
          value: weather,
        },
      }
    )
  } catch (error) {
    logger.error('Error updating weather data', error)
    throw error
  }
}

async function add(weatherData) {
  try {
    const collection = await dbService.getCollection('weather')
    await collection.insertOne(weatherData)
    return station
  } catch (err) {
    logger.error('cannot insert station', err)
    throw err
  }
}

module.exports = {
  query,
  add,
}
