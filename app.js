const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const router = require('./routes')
const PORT = 3000

//Setting mongodb
require('./config/mongoose')

//Setting method override
app.use(methodOverride('_method'))

//Setting view template
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')

//Setting body parser
app.use(bodyParser.urlencoded({ extended: false }))

//Setting route
app.use(router)

//Start and Listening on the server
app.listen(PORT, () => {
  console.log(`Now listening on http://localhost${PORT}`)
})