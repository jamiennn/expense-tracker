const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')
const dateFormat = require('dateformat')
const { body } = require('express-validator')


//Setting validator
const nameLength = (sth) => body(sth).trim().isLength({ min: 1, max: 22 })
const isDate = (sth) => body(sth).isISO8601().toDate()
const { isValidObjectId } = require('mongoose')
const isCost = (sth) => body(sth).trim().isLength({ min: 1, max: 10 })

//Create
router.get('/new', (req, res) => {
  Category.find().lean().sort({ id: 'asc' })
    .then(categorys => res.render('new', { categorys }))
})

router.post('/',
  nameLength('name'),
  isDate('date'),
  isCost('cost'),
  (req, res) => {
    const userId = req.user._id
    const body = req.body
    if (!isValidObjectId(body.categoryId)) {
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


router.put('/:id',
  nameLength('name'),
  isDate('date'),
  isCost('cost'),
  (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    const { name, date, categoryId, amount } = req.body

    if (!isValidObjectId(categoryId)) {
      return res.render('edit', { ...req.body })
    }
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