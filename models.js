const mongoose = require('mongoose')

// models 各种模块 用户模块 登陆模块 注册模块 etc

//connecting data base
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log('connected to db!'))
.catch(error => console.log(error.message))


//defind schema （描述文档结构）
//schema 用于指定文档的结构： 属性名/属性只类型，是否必须，默认etc。
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    avatar: {type: String},
    post: {type: String},
    info: {type: String},
    company: {type: String},
    salary: {type: String}
})


//通过model实例对集合数据进行CRUD操作
/*
    UserModel.create(
        {
        username: 'test person 1',
        password: md5('1234'),
        type: 'pro'
        },
        function(err, user) {
            console.log('new user')
            console.log(user)
        }
    )
    */


// defin chats collection doumcutation 

const chatSchema = mongoose.Schema({
    // sending msg 's id
    from: {type: String, required: true},
    // rescives msg 's id
    to: {type: String, required: true},
    // from和to组成的字符串
    chat_id: {type: String, required: true},
    // content
    content: {type: String, required: true},
    // if msg has been read
    read: {type: Boolean, default: false},
    // time msg created 
    create_time: {type: Number}
})

// defind Model
//定义model（与集合对应，可以操作集合） 集合的名为：： users

const UserModel = mongoose.model('user', userSchema)
const ChatModel = mongoose.model('chat', chatSchema)

// export Model, one by one
exports.UserModel = UserModel
exports.ChatModel = ChatModel

// all epxoert at once
// module.exports = xxx