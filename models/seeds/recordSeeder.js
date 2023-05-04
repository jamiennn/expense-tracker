//Include modules
const User = require('../user')
const Record = require('../record')

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
    await Promise.all(Array.from({ length: 10 }, (_, i) => {
      return Record.create({
        name: `name: ${i}`,
        date: Date.now(),
        amount: i * 100,
        userId,
        categoryId: i % 5 + 1
      })
    }))
  }))
  console.log('done.')
  process.exit()
})


// db.once('open', async () => {
//   await Promise.all(SEED_USER.map(async (user) => {
//     const { name, email } = user
//     const salt = bcrypt.genSalt(10)
//     const hash = bcrypt.hash(user.password, salt)
//       .then(salt => bcrypt.hash(user.password, salt))
//       .then(hash => {
//         return User.create({ name, email, password: hash })
//           .then(user => {
//             const userId = user._id
//             return Promise.all(Array.from(
//               { length: 10 },
//               (_, i) => {
//                 return Record.create({
//                   name: i,
//                   date: Date.now(),
//                   amount: i * 100,
//                   userId,
//                   categoryId: i % 5 + 1
//                 })
//               }
//             ))
//           })
//           .catch(err => console.log(err))
//       })
//   }))
//   console.log('done.')
//   process.exit()
// })