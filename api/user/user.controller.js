const userService = require('./user.service')

const logger = require('../../services/logger.service')

async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.id)
    res.send(user)
  } catch (err) {
    logger.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}
async function getUserDetails(req, res) {
  try {
    const user = await userService.getUserDetails(req.params.id)
    res.send(user)
  } catch (err) {
    logger.error('Failed to get user details', err)
    res.status(500).send({ err: 'Failed to get user details' })
  }
}

async function getUsers(req, res) {
  try {
    const filterBy = {
      txt: req.query?.txt || '',
      minBalance: +req.query?.minBalance || 0,
    }
    const users = await userService.query(filterBy)
    res.send(users)
  } catch (err) {
    logger.error('Failed to get users', err)
    res.status(500).send({ err: 'Failed to get users' })
  }
}

async function deleteUser(req, res) {
  try {
    await userService.remove(req.params.id)
    res.send({ msg: 'Deleted successfully' })
  } catch (err) {
    logger.error('Failed to delete user', err)
    res.status(500).send({ err: 'Failed to delete user' })
  }
}

async function updateUser(req, res) {
  try {
    const user = req.body

    const savedUser = await userService.update(user)
    res.send(savedUser)
  } catch (err) {
    logger.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}
async function updateUserStations(req, res) {
  try {
    const user = req.body

    const savedUser = await userService.updateStations(user)
    res.send(savedUser)
  } catch (err) {
    logger.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}
async function removeSongFromUser(req, res) {
  try {
    const { id } = req.params
    const { songId } = req.body

    const updatedUser = await userService.removeSong(songId, id)
    res.send(updatedUser)
  } catch (err) {
    logger.error('Failed to remove song from user', err)
    res.status(500).send({ err: 'Failed to remove song from user' })
  }
}

async function updateUserImg(req, res) {
  try {
    const user = req.body
    const savedUser = await userService.updateImg(user)
    res.send(savedUser)
  } catch (err) {
    logger.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}
async function updateLatestStations(req, res) {
  try {
    const user = req.body

    res.send(savedUser)
  } catch (err) {
    logger.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}

module.exports = {
  getUser,
  getUsers,
  deleteUser,
  removeSongFromUser,
  updateUser,
  getUserDetails,
  updateUserStations,
  updateUserImg,
  updateLatestStations,
}
