const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())


//與資料庫連線的語法
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })
const db = mongoose.connection

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
}))

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

const Todo = require('./models/todo')

app.use('/', require('./routes/home'))
app.use('/todos', require('./routes/todo'))
app.use('/users', require('./routes/user'))

app.listen(3000, () => {
  console.log('App is running!')
})