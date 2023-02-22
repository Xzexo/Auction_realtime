const { query } = require('express')
const express = require('express')
const router = express.Router()
const path = require('path')

//call model
const User = require('../models/user')
const Item = require('../models/item')
const Room = require('../models/room')

//upload file
const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'.views/image/item')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+".jpg")// change name file
    }
})

// Start upload
const upload = multer({
    storage:storage
})


router.get("/",(req,res)=>{
    Room.find().exec((err,doc)=>{
        res.render('index.ejs',{room:doc})
    })
})

router.get("/register_item",(req,res)=>{
    res.render('register_item.ejs')
})

router.get("/room",(req,res)=>{
    res.render('room.ejs')
})
router.get("/book_room",(req,res)=>{
    res.render('book_room.ejs')
})

router.get('/register',(req,res)=>{
    res.render('register.ejs')
})
router.get('/users',(req,res)=>{
    res.render('users.ejs')
})
router.get('/user_edit',(req,res)=>{
    res.render('user_edit.ejs')
})
router.get('/admin',(req,res)=>{
    res.render('admin.ejs')
})
router.get('/admin_add',(req,res)=>{
    res.render('admin_add_room.ejs')
})
router.get('/login',(req,res)=>{
    res.render('login.ejs')
})

//DB
router.post('/register_db',(req,res)=>{
    console.log(req.body);
    let data = new User({
//        user_id:,
        username:req.body.username,
        first_name:req.body.firstname,
        last_name:req.body.lastname,
        critizen_id:req.body.critizenID,
        email:req.body.email,
        passwd:req.body.passwd,
        phone:req.body.phone,
//        user_type:

    })
    User.saveUser(data,(err)=>{
        if(err) console.log(err)
        res.redirect('/login')
    })
})

router.post('/register_item_db',(req,res)=>{
    console.log(req.body);
    let data = new Item({
//        item_id:,
        item_name:req.body.item_name,
        item_description:req.body.item_descrip,
        item_begin_price:req.body.begin_price,
        item_minimum_bid:req.body.min_bid,
        item_minimum_sell:req.body.min_sell,
        item_pic:req.body.item_pic,
        item_defect:req.body.scar_descrip,
        item_defect_pic:req.body.scar_pic,

    })
    Item.saveItem(data,(err)=>{
        if(err) console.log(err)
        res.redirect('/register_item')
    })
})

router.post('/open_room_db',(req,res)=>{
    console.log(req.body);
    let data = new Room({
//        room_id:,
        time_open:req.body.time_open,
        time_close_door:req.body.time_close_door,
        time_finish:req.body.time_finish,
        auction_day:req.body.auction_day

    })
    Room.saveRoom(data,(err)=>{
        if(err) console.log(err)
        res.redirect('/admin')
    })
})

module.exports = router