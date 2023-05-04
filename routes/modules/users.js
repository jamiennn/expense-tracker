const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')

//Setting validator
const createEmailChain = () => body('email').trim().isEmail().withMessage('請填寫有效的email')
const notEmptyChain = (sth) => body(sth).trim().notEmpty().withMessage('星號為必填')
const passwordLength = (sth) => body(sth).trim().isLength({ min: 8 }).withMessage('密碼必須含有8個字元')


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
router.post('/login',
  createEmailChain(),
  passwordLength('password'),
  (req, res, next) => {
    //先確認輸入的資料是否適當
    const errors = validationResult(req).errors
    if (errors.length) {
      return res.render('login', { ...req.body, errors })
    }
    return next()
  },
  //用passport驗證身份
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect: '/',
    failureMessage: true
  }))

//register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register',
  createEmailChain(),
  notEmptyChain('password') || notEmptyChain('confirmPassword'),
  passwordLength('password'),
  body('confirmPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('密碼與確認密碼不相符')
    return true
  }),
  (req, res) => {

    //如表單有錯誤
    const { name, email, password, confirmPassword } = req.body
    const errors = validationResult(req).errors
    if (errors.length) {
      return res.render('register', { ...req.body, errors })
    }

    //如表單無錯誤
    User.findOne({ email })
      .then(user => {
        //若此email已經註冊過
        if (user) {
          errors.push({ msg: '此email已經註冊過' })
          return res.render('register', { ...req.body, errors })
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