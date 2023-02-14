const express = require('express')
const router = require('./routes/myRouter')
const app = express()
const path = require('path')

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(router)

app.listen(8080,()=>{
    console.log("run server at port 8080")
})