const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const dateFormat = require('dateformat')

//Search by category
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const categoryId = req.params.id
  Record.find({ categoryId, userId })
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

//Search by date
router.post('/', (req, res) => {
  const userId = req.user._id
  const { searchDate } = req.body

  Record.find({ userId })
    .lean()
    .then(expenses => {
      //過濾出日期一樣的資料
      return expenses.filter(expense => {
        const expenseDate = dateFormat(expense.date, 'yyyy-mm')
        return (expenseDate === searchDate)
      })
    })
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
      res.render('index', { expenses, totalAmount, categorys, searchDate })
    })
})

module.exports = router