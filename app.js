const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

const usePassport = require('./config/passport')
const router = require('./routes')


//Require dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const port = process.env.PORT

//Setting mongodb
require('./config/mongoose')

//Setting static files
app.use(express.static('public'))

//Setting method override
app.use(methodOverride('_method'))

//Setting view template
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


//Setting body parser
app.use(bodyParser.urlencoded({ extended: false }))

//Setting session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

//Setting passport
usePassport(app)

//Setting flash
app.use(flash())

//Setting middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.success_msg = req.flash('success_msg')
  next()
})

//Setting route
app.use(router)

//Start and Listening on the server
app.listen(port, () => {
  console.log(`Now listening on http://localhost${port}`)
})