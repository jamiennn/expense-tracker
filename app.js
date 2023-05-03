const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const router = require('./routes')
const PORT = 3000

//Setting view template
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')


//Setting route
app.use(router)

//Start and Listening on the server
app.listen(PORT, () => {
  console.log(`Now listening on http://localhost${PORT}`)
})