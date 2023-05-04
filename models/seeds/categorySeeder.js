//Include modules
const Category = require('../category')
const db = require('../../config/mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const SEED_CATEGORY = [
  { id: 1, name: '家居物業' },
  { id: 2, name: '交通出行' },
  { id: 3, name: '休閒娛樂' },
  { id: 4, name: '餐飲食品' },
  { id: 5, name: '其他' },
]

db.once('open', async () => {
  await Promise.all(SEED_CATEGORY.map(category => {
    return Category.create(category)
  }))
  console.log('done.')
  process.exit()
})

