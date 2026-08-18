import Contact from '../models/contact.model.js'
import errorHandler from './error.controller.js'

const create = async (req, res) => {
  try {
    const contact = new Contact(req.body)
    await contact.save()
    res.status(201).json(contact)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const list = async (req, res) => {
  try {
    res.json(await Contact.find())
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const read = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
    if (!contact) return res.status(404).json({ error: 'Contact not found' })
    res.json(contact)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const update = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!contact) return res.status(404).json({ error: 'Contact not found' })
    res.json(contact)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) return res.status(404).json({ error: 'Contact not found' })
    res.json(contact)
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const removeAll = async (req, res) => {
  try {
    const result = await Contact.deleteMany({})
    res.json({ message: `${result.deletedCount} contacts deleted` })
  } catch (err) {
    res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { create, list, read, update, remove, removeAll }
