const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection

db.once('open', () => {
  console.log('Mongodb connected.')
})

db.on('error', () => {
  console.log('Mongodb error.')
})

module.exports = db