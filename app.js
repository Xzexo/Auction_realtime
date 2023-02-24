const express = require('express')
const router = require('./routes/myRouter')
const app = express()
const path = require('path')
const cookieSession = require('cookie-session')
const session = require('express-session')
const bcrypt = require('bcrypt')
const {body, validationResult} = require('express-validator')
const cookieParser = require('cookie-parser')

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(session({secret:"mysession",resave:false,saveUninitialized:false}))
app.use(router)


app.listen(8080,()=>{
    console.log("run server at port 8080")
})