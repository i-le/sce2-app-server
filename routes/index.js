const express = require('express')
const router = express.Router()
const {UserModel, ChatModel} = require('../models')
const md5 = require('blueimp-md5')
const filter = {password: 0, __v: 0}



//register a router -> user regi

/* 1 path: /register
2 action： post
3 接收username 和 pw 参数 
4 admin 
5 succss return {code: 0, data: {_id:'xxx", username:"xxx", password:"xxx"}}
6 falied return {code: 1, msg: 'username already used' }
*/
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  })

  //register router
router.post('/register', (req, res) => {
    // 读取请求参数数据
    const {username, password, type} = req.body
    // if user have been regied
        // based on username
        UserModel.findOne({username}, function (err, user) {
            if (user) {
            res.send({code: 1, msg: 'username has been already registered'})
            } else {
            new UserModel({username, password: md5(password), type}).save(function (err, user) {
            //once loged in , stay loged in
            res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
            //return json data(user)
            // 响应数据中不要携带密码返回前端
            const data = {username, type, _id: user._id}
            res.send({code: 0, data})
        })
    }
        })
})
//返回响应数据




//login router
router.post('/login', (req, res) => {
    const {username, password} = req.body
    UserModel.findOne({username, password: md5(password)}, filter, (err,user) => {
        if (user) {
            res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
            res.send({code: 0, data: user})
        } else {
            res.send({code: 1, msg: 'user name or password is incorract'})
        }
    })
})

// updating user info router

router.post('/update', (req, res) => {
    // 从请求携带的cookies中获取用户_id
    const userid = req.cookies.userid
    console.log(userid)
    // 不存在（过期或者被用户删掉），返回提示信息
    if (!userid) {
      return res.send({
        code: 1, 
        msg: 'Please Login'
      })
      // return | else {...}
    }
    // 得到提交的用户信息,更新对应user
    const user = req.body
    UserModel.findByIdAndUpdate({_id: userid}, user, function(err, oldUser) {
      // 如果没有查到
      if (!oldUser) {
        // 通知浏览器删除cookie
        res.clearCookie('userid')
        res.send({
          code: 1, 
          msg: 'Please Login'
        })
      } else {
        // 合并用户信息
        const {_id, username, type} = oldUser
        const data = Object.assign(user, {_id, username, type})
        
        res.send({
          code: 0, 
          data
        })
      }
    })
  })

// router get users info (cookie -> userid)
router.get('/user', (req, res) => {
    // userid from cookie requesting
  const userid = req.cookies.userid
  // !user, return a msg
  if(!userid) {
      return res.send({code: 1, msg: 'login please'})
  }
  // userid -> user
  UserModel.findOne({_id: userid}, filter, (err, user) => {
      res.send({code: 0, data: user})
  })
})
  
// getting userlist ( based on type(boss/pro))
router.get('/userlist', (req, res) => {
    const {type} = req.query
    UserModel.find({type}, filter, (err, users) => {
        res.send({code: 0, data: users})
    })
})

// 获取当前用户消息列表
router.get('/msglist', function (req, res) {
    const userid = req.cookies.userid
    UserModel.find(function(err, userDocs) {
      // getting all users avatar and info
      /* const users = {}
      userDocs.forEach(doc => {
        users[doc._id] = {username: doc.username, header: doc.header}
      }) */
      const users = userDocs.reduce((users, user) => {
        users[user._id] = {username: user.username, header: user.header}
        return users
      }, {})
  
      // find matched msgs matchs userid 
      ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function(err, chatMsgs) {
        // renturn all users avatars userid and msg associated with current user
        res.send({
          code: 0,
          data: {users, chatMsgs}
        })
      })
    })
  })


// change selected msg to read: true
router.post('/readmsg', function (req, res) {
    const from = req.body.from
    const to = req.cookies.userid
    // updating db's chat data
    // arguments：查询条件；更新为指定数据对象；是否1次更新多条（默认1）；更新后的回调
    ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function(err, doc) {
      console.log('---readmsg---- ', doc)
      res.send({
        code: 0,
        // tell client side to updating the numbers
        data: doc.nModified
      })
    })
  })
  

module.exports = router