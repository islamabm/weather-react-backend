const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const reviewService = require('../review/review.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add,
  getUserDetails,
  updateImg,
  // updateLatestStations,
  updateStations,
  removeSong,
}
async function removeSong(songId, userId) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ _id: ObjectId(userId) })
    user.LikedSongs = user.LikedSongs.filter((song) => song._id !== songId)
    const updatedUser = await collection.findOneAndUpdate(
      { _id: ObjectId(userId) },
      { $set: user },
      { returnOriginal: false }
    )
    return updatedUser.value
  } catch (err) {
    logger.error(`while removing song from user: ${userId}`, err)
    throw err
  }
}
async function getUserDetails(userId) {
  const user = await dbService
    .getCollection('user')
    .findOne({ _id: new ObjectId(userId) })
  return user
}

async function query(filterBy = {}) {
  const criteria = _buildCriteria(filterBy)
  try {
    const collection = await dbService.getCollection('user')
    var users = await collection.find(criteria).toArray()
    users = users.map((user) => {
      delete user.password
      user.createdAt = ObjectId(user._id).getTimestamp()
      // Returning fake fresh data
      // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
      return user
    })
    return users
  } catch (err) {
    logger.error('cannot find users', err)
    throw err
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ _id: ObjectId(userId) })
    delete user.password

    // user.LikedSongs = LikedSongs
    // user.imgUrl = imgUrl
    // user.latestStations = latestStations
    user.givenReviews = await reviewService.query({
      byUserId: ObjectId(user._id),
    })
    // user.givenReviews = user.givenReviews.map(review => {
    //     delete review.byUser
    //     return review
    // })

    return user
  } catch (err) {
    logger.error(`while finding user by id: ${userId}`, err)
    throw err
  }
}
async function getByUsername(username) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ username })
    return user
  } catch (err) {
    logger.error(`while finding user by username: ${username}`, err)
    throw err
  }
}

async function remove(userId) {
  try {
    const collection = await dbService.getCollection('user')
    await collection.deleteOne({ _id: ObjectId(userId) })
  } catch (err) {
    logger.error(`cannot remove user ${userId}`, err)
    throw err
  }
}

async function update(user) {
  try {
    // peek only updatable properties
    const userToSave = {
      _id: new ObjectId(user._id),
      username: user.username,
      LikedSongs: user.LikedSongs,
      imgUrl: user.imgUrl,
      stations: user.stations,
    }
    const collection = await dbService.getCollection('user')
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    return userToSave
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err)
    throw err
  }
}
async function updateStations(user) {
  try {
    // peek only updatable properties
    const userToSave = {
      _id: new ObjectId(user._id),
      username: user.username,
      stations: user.stations,
      LikedSongs: user.LikedSongs,
      imgUrl: user.imgUrl,
    }
    const collection = await dbService.getCollection('user')
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    return userToSave
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err)
    throw err
  }
}
async function updateImg(user) {
  try {
    const userToSave = {
      _id: new ObjectId(user._id),
      username: user.username,
      imgUrl: user.imgUrl,
      LikedSongs: user.LikedSongs,
      stations: user.stations,
    }

    const collection = await dbService.getCollection('user')
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    return userToSave
  } catch (err) {
    logger.error(`cannot update user ${user._id}`, err)
    throw err
  }
}

async function add(user) {
  try {
    const userToAdd = {
      username: user.username,
      password: user.password,
      email: user.email,
      imgUrl: user.imgUrl,
      LikedSongs: user.LikedSongs,
      latestStations: user.latestStations,
    }
    const collection = await dbService.getCollection('user')
    await collection.insertOne(userToAdd)
    return userToAdd
  } catch (err) {
    logger.error('cannot add user', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.txt) {
    const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    criteria.$or = [
      {
        username: txtCriteria,
      },
      // {
      //   fullname: txtCriteria,
      // },
    ]
  }
  if (filterBy.minBalance) {
    criteria.score = { $gte: filterBy.minBalance }
  }
  return criteria
}

// try {
//   const collection = await dbService.getCollection('user')
//   const updatedUser = await collection.findOneAndUpdate(
//     { _id: new ObjectId(user._id) },
//     {
//       $set: {
//         latestStations: user.latestStations,
//         LikedSongs: user.LikedSongs,
//       },
//     },
//     { returnOriginal: false }
//   )

//   return updatedUser
// } catch (err) {
//   throw err
// }
