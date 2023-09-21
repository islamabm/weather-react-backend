const MongoClient = require('mongodb').MongoClient

const config = require('../config')
const logger = require('./logger.service')

module.exports = {
  getCollection,
}

const dbName = 'weather_db'
var dbConn = null

async function getCollection(collectionName) {
  try {
    const db = await connect()
    const collection = await db.collection(collectionName)
    return collection
  } catch (err) {
    logger.error('Failed to get Mongo collection', err)
    throw err
  }
}
async function getRandomSongsFromMoodTag(mood, songLimit) {
  try {
    const collection = await getCollection('playlist')
    const playlists = await collection.find({}).toArray()

    const matchedPlaylists = await collection.find({ tags: mood }).toArray()

    const songs = await collection
      .aggregate([
        { $match: { tags: mood } },
        { $unwind: '$songs' },
        { $sample: { size: songLimit } },
        { $project: { _id: 0, song: '$songs' } },
      ])
      .toArray()

    return songs.map((playlist) => playlist.song)
  } catch (err) {
    logger.error('Failed to get songs from Mongo', err)
    throw err
  }
}
async function connect() {
  if (dbConn) return dbConn
  try {
    const client = await MongoClient.connect(config.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const db = client.db(config.dbName)
    dbConn = db
    return db
  } catch (err) {
    logger.error('Cannot Connect to DB', err)
    throw err
  }
}

module.exports = {
  getCollection,
  getRandomSongsFromMoodTag,
}
