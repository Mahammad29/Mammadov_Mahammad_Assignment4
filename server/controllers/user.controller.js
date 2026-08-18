import User from '../models/user.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: 'user'
  })

  try {
    await user.save()
    return res.status(200).json({ message: 'Successfully signed up!' })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const list = async (req, res) => {
  try {
    const users = await User.find().select('name email role updated created')
    res.json(users)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
    if (!user) return res.status(400).json({ error: 'User not found' })
    req.profile = user
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Could not retrieve user' })
  }
}

const read = (req, res) => {
  const user = req.profile.toObject()
  delete user.hashed_password
  delete user.salt
  return res.json(user)
}

const update = async (req, res) => {
  try {
    let user = req.profile
    const changes = { ...req.body }
    delete changes.role
    delete changes.hashed_password
    delete changes.salt

    user = extend(user, changes)
    user.updated = Date.now()
    await user.save()

    const result = user.toObject()
    delete result.hashed_password
    delete result.salt
    res.json(result)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    const user = req.profile
    const result = user.toObject()
    await user.deleteOne()
    delete result.hashed_password
    delete result.salt
    res.json(result)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const removeAll = async (req, res) => {
  try {
    const result = await User.deleteMany({ role: { $ne: 'Admin' } })
    res.json({ message: `${result.deletedCount} users deleted` })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, userByID, read, list, remove, update, removeAll }
