import Qualification from '../models/qualification.model.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
  try {
    const qualification = new Qualification(req.body)
    await qualification.save()
    res.status(201).json(qualification)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const list = async (req, res) => {
  try {
    res.json(await Qualification.find())
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const read = async (req, res) => {
  try {
    const qualification = await Qualification.findById(req.params.id)
    if (!qualification) return res.status(404).json({ error: 'Qualification not found' })
    res.json(qualification)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const update = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!qualification) return res.status(404).json({ error: 'Qualification not found' })
    res.json(qualification)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndDelete(req.params.id)
    if (!qualification) return res.status(404).json({ error: 'Qualification not found' })
    res.json(qualification)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const removeAll = async (req, res) => {
  try {
    const result = await Qualification.deleteMany({})
    res.json({ message: `${result.deletedCount} qualifications deleted` })
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, list, read, update, remove, removeAll }
