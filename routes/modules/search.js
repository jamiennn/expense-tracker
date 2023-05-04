const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const dateFormat = require('dateformat')

const CATEGORY = {
  1: "fa-solid fa-house",
  2: "fa-solid fa-van-shuttle",
  3: "fa-solid fa-face-grin-beam",
  4: "fa-solid fa-utensils",
  5: "fa-solid fa-pen"
}

router.get('/:id', (req, res) => {
  const userId = req.user._id
  const categoryId = Number(req.params.id)
  Record.find({ categoryId, userId })
    .lean()
    .then(expenses => {
      let totalAmount = 0
      expenses.forEach(expense => {
        expense.CATEGORY = CATEGORY[Number(expense.categoryId)]
        totalAmount += expense.amount
        expense.date = dateFormat(expense.date, "yyyy/mm/dd")
      })
      res.render('index', { expenses, totalAmount })
    })
})

module.exports = router