require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const path = require('path')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // for parsing application/json
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'build')))




app.set('view engine', 'ejs');

app.use('/', indexRouter)
app.use('/users', userRouter)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})


module.exports = app