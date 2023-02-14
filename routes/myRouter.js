const { query } = require('express')
const express = require('express')
const router = express.Router()
const path = require('path')

//call model
const User = require('../models/user')


router.get("/",(req,res)=>{
    res.render('index.ejs')
})

router.get("/register_item",(req,res)=>{
    res.render('register_item.ejs')
})

router.get("/reserve_room",(req,res)=>{
    res.render('reserve_room.ejs')
})

router.get('/register',(req,res)=>{
    res.render('register.ejs')
})

//DB
//router.post('/register_db',(req,res)=>{
//    console.log(req.body);
//    let data = new User({
        //user_id:
//        username:req.body.username,
//        first_name:req.body.firstname,
//        last_name:req.body.lastname,
//        critizen_id:req.body.critizenID,
//        email:req.body.email,
//        passwd:req.body.passwd,
//        phone:req.body.phone,
        //user_type:

 //   })
 //   console.log(data);
 //   res.render('register')
//})

module.exports = router