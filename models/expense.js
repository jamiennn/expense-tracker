const mongoose = require('mongoose')
const Schema = mongoose.Schema

const expenseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String
  },
  category: {
    type: String
  },
  cost: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Expense', expenseSchema)



