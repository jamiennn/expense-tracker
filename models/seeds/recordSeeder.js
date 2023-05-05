//Include modules
const User = require('../user')
const Record = require('../record')
const Category = require('../category')

const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', async () => {
  await Promise.all(SEED_USER.map(async (user) => {
    const { name, email } = user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    const createdUser = await User.create({ name, email, password: hash })
    const userId = createdUser._id
    const categorys = await Category.find().lean()
    const categoryIds = categorys.map(category => category._id)

    await Promise.all(Array.from({ length: 10 }, (_, i) => {
      return Record.create({
        name: `name: ${i}`,
        date: Date.now(),
        amount: i * 100,
        userId,
        categoryId: categoryIds[i % 5]
      })
    }))
  }))
  console.log('done.')
  process.exit()
})