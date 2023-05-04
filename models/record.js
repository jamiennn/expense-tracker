const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({

  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  // userId: {
  //   type: Number,
  //   required: true
  // },
  categoryId: {
    type: Number,
    ref: 'Category',
    required: true
  },

})

module.exports = mongoose.model('Record', recordSchema)



