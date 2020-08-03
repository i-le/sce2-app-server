const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cookieParser = require('cookie-parser')
const indexRouter = require('./routes/index')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // for parsing application/json
app.use(cookieParser())
app.use('/', indexRouter)

app.set('view engine', 'ejs');



module.exports = app