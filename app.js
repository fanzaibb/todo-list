const express = require('express')
const app = express()
const mongoose = require('mongoose')

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

//與資料庫連線的語法
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

const Todo = require('./models/todo')

// Todo 首頁
app.get('/', (req, res) => {
  Todo.find((err, todos) => {
    if(err) return console.log(err)
    return res.render('index', { todos: todos })
  })
})

// 列出全部 Todo
app.get('/todos', (req, res) => {
  return res.redirect('/')
})

// 新增一筆 Todo 頁面
app.get('/todos/new', (req, res) => {
  res.render('new')
})

// 顯示一筆 Todo 的詳細內容
app.get('/todos/:id', (req, res) => {
  console.log(req.params.id)
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.log(err)
    return res.render('detail', { todo: todo })
  })
})

// 新增一筆  Todo
app.post('/todos', (req, res) => {
  const todo = new Todo({
    name: req.body.name,
  })
  
  todo.save(err => {
    if(err) return console.error(err)
    return res.redirect('/')
  })
})

// 修改 Todo 頁面
app.get('/todos/:id/edit', (req, res) => {
  res.send('修改 Todo 頁面')
})

// 修改 Todo
app.post('/todos/:id/edit', (req, res) => {
  res.send('修改 Todo')
})

// 刪除 Todo
app.post('/todos/:id/delete', (req, res) => {
  res.send('刪除 Todo')
})

app.listen(3000, () => {
  console.log('App is running!')
})