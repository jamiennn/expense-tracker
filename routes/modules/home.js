const express = require('express')
const router = express.Router()
const Expense = require('../../models/expense')

//待解決
const CATEGORY = {
  home: "fa-solid fa-house",
  traffic: "fa-solid fa-van-shuttle",
  entertain: "fa-solid fa-face-grin-beam",
  food: "fa-solid fa-utensils",
  others: "fa-solid fa-pen"
}

router.get('/', (req, res) => {
  Expense.find()
    .lean()
    .then(expenses => {
      let total = 0
      expenses.forEach(expense => {
        expense.CATEGORY = CATEGORY[expense.category]
        total += expense.cost
      })
      res.render('index', { expenses, total })
    })
})

module.exports = router