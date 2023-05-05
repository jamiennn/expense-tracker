const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')
const dateFormat = require('dateformat')


//Create
router.get('/new', (req, res) => {
  Category.find().lean().sort({ id: 'asc' })
    .then(categorys => res.render('new', { categorys }))
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const body = req.body
  if (!body.categoryId) {
    body.message = '請選擇類別'
    return res.render('new', { body })
  }
  Record.create({ ...body, userId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})

//Edit
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id

  Record.findOne({ _id, userId })
    .lean()
    .then(async (expense) => {
      const categorys = await Category.find().lean().sort({ id: 'asc' })
      categorys.forEach(category => {
        if (category._id.equals(expense.categoryId)) category.selected = 'true'
      })
      expense.date = dateFormat(expense.date, "yyyy-mm-dd")
      res.render('edit', { expense, categorys })
    })
    .catch(err => console.log(err))
})


router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, categoryId, amount } = req.body
  Record.findOne({ _id, userId })
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
  const userId = req.user._id
  const _id = req.params.id
  Record.deleteOne({ _id, userId })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})




module.exports = router