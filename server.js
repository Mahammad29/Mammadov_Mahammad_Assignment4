import 'dotenv/config'
import config from './config/config.js'
import app from './server/express.js'
import mongoose from 'mongoose'

mongoose.Promise = global.Promise

mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connected to the database!')
  })
  .catch((err) => {
    console.log('Database connection error:', err.message)
  })

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to My Portfolio Assignment 4 application.' })
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})

export default app
