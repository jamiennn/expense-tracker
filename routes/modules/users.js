const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

//login
router.get('/login', (req, res) => {
  const message = req.session.messages || []
  if (message.length) {
    const { alert, email, password } = JSON.parse(message[0])
    req.session.messages = []
    return res.render('login', {
      email,
      password,
      alert
    })
  }
  res.render('login')
})

//middleware
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  successRedirect: '/',
  failureMessage: true
}))

//register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  //設定必填項目
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '星號項目為必填' })
  }

  //密碼必須與確認密碼相符
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符' })
  }

  if (errors.length) {
    return res.render('register', { name, email, password, confirmPassword, errors })
  }

  User.findOne({ email })
    .then(user => {
      //若此email已經註冊過
      if (user) {
        errors.push({ message: '此email已經註冊過' })
        return res.render('register', { name, email, password, confirmPassword, errors })
      }
      //若沒問題，成功註冊
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({ name, email, password: hash })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

//logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { console.log(err) }
    req.flash('success_msg', '您已經成功登出')
    res.redirect('/users/login')
  })
})

module.exports = router