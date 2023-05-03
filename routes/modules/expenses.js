const express = require('express')
const router = express.Router()

const Expense = require('../../models/expense')


//Create
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const body = req.body
  Expense.create(body)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

//Edit
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Expense.findById(id)
    .lean()
    .then(expense => {
      if (expense.category === 'home') expense.home = 'home'
      if (expense.category === 'traffic') expense.traffic = 'traffic'
      if (expense.category === 'entertain') expense.entertain = 'entertain'
      if (expense.category === 'food') expense.food = 'food'
      if (expense.category === 'others') expense.others = 'others'
      res.render('edit', { expense })
    })
    .catch(err => console.log(err))
})
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, category, cost } = req.body
  Expense.findById(id)
    .then(expense => {
      expense.name = name
      expense.date = date
      expense.category = category
      expense.cost = cost
      return expense.save()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

//Delete
router.delete('/:id')




module.exports = router