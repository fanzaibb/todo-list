const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')

const { authenticated } = require('../config/auth')

// Todo 首頁
router.get('/', authenticated ,(req, res) => {
  Todo.find({})
  .sort({ name: 'asc'}) //用name升冪排序
  .exec((err, todos) => { //exec是mongoose的API
    if(err) return console.log(err)
    return res.render('index', { todos: todos })
  })
})

module.exports = router