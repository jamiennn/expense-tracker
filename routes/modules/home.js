const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const dateFormat = require('dateformat')

router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .then(async (expenses) => {
      let totalAmount = 0
      const categorys = await Category.find().lean().sort({ id: 'asc' })
      await Promise.all(
        expenses.map(async (expense) => {
          const category = await Category.findById(expense.categoryId).lean()
          expense.icon = category.icon
          totalAmount += expense.amount
          expense.date = dateFormat(expense.date, "yyyy/mm/dd")
        }))
      res.render('index', { expenses, totalAmount, categorys })
    })
})

module.exports = router