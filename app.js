const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const PORT = 3000

//Setting view template
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')


//Setting route
app.get('/', (req, res) => {
  res.render('index')
})

//Start and Listening on the server
app.listen(PORT, () => {
  console.log(`Now listening on http://localhost${PORT}`)
})