const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')


// 列出全部 Todo
router.get('/', (req, res) => {
  return res.redirect('/')
})

// 新增一筆 Todo 頁面
router.get('/new', (req, res) => {
  res.render('new')
})

// 顯示一筆 Todo 的詳細內容
router.get('/:id', (req, res) => {
  console.log(req.params.id)
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.err(err)
    return res.render('detail', { todo: todo })
  })
})

// 新增一筆  Todo
router.post('/', (req, res) => {
  const todo = new Todo({
    name: req.body.name,
  })
  
  todo.save(err => {
    if(err) return console.error(err)
    return res.redirect('/')
  })
})

// 修改 Todo 頁面
router.get('/:id/edit', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.err(err)
    return res.render('edit', { todo: todo })
  })
})

// 修改 Todo
router.put('/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
      if (err) return console.error(err)
      todo.name = req.body.name

      if (req.body.done === 'on') {
        todo.done = true
      } else {
        todo.done = false //checkbox沒打勾不會有值
      }
    todo.save(err => {
      if (err) return console.error(err)
      return res.redirect(`/${req.params.id}`)
    })
  })
})

// 刪除 Todo
router.delete('/:id/delete', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err)
    todo.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router
