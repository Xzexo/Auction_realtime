const { query } = require('express')
const express = require('express')
const router = express.Router()
const path = require('path')
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt')
const {body, validationResult} = require('express-validator')

//!call model
const User = require('../models/user')
const Item = require('../models/item')
const Room = require('../models/room')

//!upload file
const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'.views/image/item')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+".jpg")// change name file
    }
})

//!Start upload
const upload = multer({
    storage:storage
})

//! Home
router.get("/",(req,res)=>{
    Room.find().exec((err,doc)=>{
        res.render('index.ejs',{room:doc})
    })
})

//! User
router.get('/user',(req,res)=>{
    Room.find().exec((err,doc)=>{
        res.render('users.ejs',{room:doc})
    })
})
router.get('/user_edit',(req,res)=>{
    res.render('user_edit.ejs')
})



//! Login 
router.post('/check',async (req,res)=>{
    const user_name = req.body.username
    const pass_wd = req.body.passwd
    const timeExpire = 1000000 
    //!Find username and password in DB
    const user = await User.findOne({
        username : user_name,
        passwd : pass_wd
    })
    if (user_name === "admin" && pass_wd === "123"){
        req.session.username = user_name
        req.session.password = pass_wd
        req.session.login = true
        req.session.cookie.maxAge = timeExpire
        res.redirect('/admin')
    }else if(user){
        Room.find().exec((err,doc)=>{
            res.render('users.ejs',{room:doc})
        })
    }
    else{ 
        res.redirect('/login')

    }

})

router.get('/login',(req,res)=>{
    res.render('login.ejs')
})

router.get('/register',(req,res)=>{
    res.render('register.ejs')
})


//! Admin
router.get('/admin',(req,res)=>{
    Room.find().exec((err,doc)=>{
        res.render('admin.ejs',{room:doc})
    })
})
router.get('/admin_add',(req,res)=>{
    res.render('admin_add_room.ejs')
})


//! Feature
router.get("/user",(req,res)=>{
    res.render('users.ejs')
})

router.get("/history",(req,res)=>{
    res.render('history.ejs')
})

router.get("/history_check",(req,res)=>{
    res.render('history_check.ejs')
})

router.get("/register_item",(req,res)=>{
    res.render('register_item.ejs')
})

router.get("/room",(req,res)=>{
    Room.find().exec((err,doc)=>{
        res.render('room.ejs',{room:doc})
    })
})
router.get('/auction',(req,res)=>{
    res.render('auction.ejs')
})

router.get("/:id",(req,res)=>{
    const room_id = req.params.id
    Room.findOne({_id:room_id}).exec((err,doc)=>{
        res.render('book_room.ejs',{room:doc})
    })
})



//!DataBase
router.post('/register_db',(req,res)=>{
    console.log(req.body);
    let data = new User({
        username:req.body.username,
        first_name:req.body.firstname,
        last_name:req.body.lastname,
        critizen_id:req.body.critizenID,
        email:req.body.email,
        passwd:req.body.passwd,
        phone:req.body.phone,

    })
    User.saveUser(data,(err)=>{
        if(err) console.log(err)
        res.redirect('/login')
    })
})

router.post('/register_item_db',(req,res)=>{
    console.log(req.body);
    let data = new Item({
        item_name:req.body.item_name,
        item_description:req.body.item_descrip,
        item_begin_price:req.body.begin_price,
        item_minimum_bid:req.body.min_bid,
        item_minimum_sell:req.body.min_sell,
        item_pic:req.body.item_pic,
        item_defect:req.body.scar_descrip,
        item_defect_pic:req.body.scar_pic,
        user_id:req.body.user_id
    })
    Item.saveItem(data,(err)=>{
        if(err) console.log(err)
        res.redirect('/register_item')
    })
})

router.post('/open_room_db',(req,res)=>{
    console.log(req.body);
    let data = new Room({
        time_open:req.body.time_open,
        time_close_door:req.body.time_close_door,
        time_finish:req.body.time_finish,
        auction_day:req.body.auction_day,
        item_id:req.body.item_id,
        user_id:req.body.user_id

    })
    Room.saveRoom(data,(err)=>{
        if(err) console.log(err)
        res.redirect('/admin')
    })
})

router.post('/edit_room',(req,res)=>{
    const reserve_id = req.body.reserve_id
    let data = {
        time_open:req.body.time_open,
        time_close_door:req.body.time_close_door,
        time_finish:req.body.time_finish,
        auction_day:req.body.auction_day
    }
    Room.findByIdAndUpdate(reserve_id,data,{useFindAndModify:false}).exec(err =>{
        res.redirect('/room')
    })
})

module.exports = router