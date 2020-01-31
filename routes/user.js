const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

//登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

//登入檢查
router.post('/login', (req, res, next) =>{
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })(req, res, next)
})

//註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

//註冊檢查
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  // aka const name = req.body.name
  User.findOne({ email: email }) //findOne為mongoose提供的方法
      .then(user => { //若findOne執行無誤，繼續執行then裡的callback(?)
        if (user) {
          //若email已存在，不送出並回到註冊表單頁面
          console.log('User already exists')
          res.render('register', {
            name,
            email,
            password,
            password2
          })
        } else {
          //若email不存在，新增使用者
          const newUser = new User({
            name,
            email,
            password
          })
          // 先用 genSalt 產生「鹽」，第一個參數是複雜度係數，預設值是 10
          bcrypt.genSalt(10, (err, salt) =>
          // 再用 hash 把鹽跟使用者的密碼配再一起，然後產生雜湊處理後的 hash
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash

          //新增完成後回首頁
          newUser
            .save()
            .then(user => {
              res.redirect('/')
            })
            .catch(err => console.log(err))
        }))}
  })
})

//登出
router.get('/logout', (req, res) => {
  req.logout() //passport提供的函數
  res.redirect('/users/login')
})

module.exports = router