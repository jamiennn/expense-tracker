const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {

  //初始化模組
  app.use(passport.initialize())
  app.use(passport.session())

  //設定本地登入策略
  passport.use(new LocalStrategy(
    { usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            const object = {
              alert: '此email尚未註冊',
              email: email,
              password: password
            }
            return done(null, false, { message: JSON.stringify(object) })
          }
          return bcrypt
            .compare(password, user.password)
            .then(isMatched => {
              //如果密碼錯誤
              if (!isMatched) {
                const object = {
                  alert: '密碼錯誤',
                  email: email,
                  password: password
                }
                return done(null, false, { message: JSON.stringify(object) })
              }
              //如果驗證成功
              return done(null, user)
            })
        })
        .catch(err => done(err, false))
    }
  ));


  //設定序列化、反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((userId, done) => {
    User.findById(userId)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, false))
  })
}