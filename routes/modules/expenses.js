const express = require('express')
const router = express.Router()

//Create
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/')

//Edit
router.get('/:id/edit', (req, res) => {
  res.render('edit')
})
router.put('/:id')

//Delete
router.delete('/:id')




module.exports = router