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
})

//Edit
router.get('/:id/edit', (req, res) => {
  res.render('edit')
})
router.put('/:id')

//Delete
router.delete('/:id')




module.exports = router