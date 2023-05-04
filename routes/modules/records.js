const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const dateFormat = require('dateformat')


//Create
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const body = req.body
  if (!body.categoryId) {
    body.message = '請選擇類別'
    return res.render('new', { body })
  }
  Record.create(body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

//Edit
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Record.findById(id)
    .lean()
    .then(expense => {
      if (expense.categoryId === 1) expense.home = 'home'
      if (expense.categoryId === 2) expense.traffic = 'traffic'
      if (expense.categoryId === 3) expense.entertain = 'entertain'
      if (expense.categoryId === 4) expense.food = 'food'
      if (expense.categoryId === 5) expense.others = 'others'
      expense.date = dateFormat(expense.date, "yyyy-mm-dd")
      res.render('edit', { expense })
    })
    .catch(err => console.log(err))
})
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, categoryId, amount } = req.body
  Record.findById(id)
    .then(expense => {
      expense.name = name
      expense.date = date
      expense.categoryId = categoryId
      expense.amount = amount
      return expense.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

//Delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  Record.deleteOne({ _id: id })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})




module.exports = router