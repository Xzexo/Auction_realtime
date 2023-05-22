const { query } = require('express')
const express = require('express')
const router = express.Router()
const path = require('path')
const cookieSession = require('cookie-session')
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')

//!call model
const User = require('../models/user')
const Item = require('../models/item')
const Room = require('../models/room')
const Transaction = require('../models/transaction')
const Transfer = require('../models/tranfer')

//!upload file
const multer = require('multer')

// Load environment variables from a .env file
require('dotenv').config();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/image/item')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".jpg")// change name file
    }
})

//!Start upload
const upload = multer({
    storage: storage
})

//! Home
router.get("/", (req, res) => {
    Room.find().exec((err, doc) => {
        res.render('index.ejs', { room: doc })
    })
})

//! User
router.get('/user/:id', (req, res) => {
    const user_id = req.params.id;
    User.findOne({_id: user_id}).exec((err, doc_user) =>{
        Room.find().exec((err, doc) => {
            res.render('users.ejs', { room: doc , user: doc_user })
        })
    });
})

router.get('/user_edit/:id', (req, res) => {
    const user_id = req.params.id
    User.findOne({ _id: user_id }).exec((err, doc) => {
        res.render('user_edit.ejs', { user: doc })
        console.log("user :", user_id);
    })
})



//! Login 

router.post('/check', async (req, res) => {
    const user_name = req.body.username;
    const pass_wd = req.body.passwd;

    //Find username and password in DB

    const user = await findUser(user_name, pass_wd);


    if (user_name == process.env.USERNAME && pass_wd == process.env.PASS) {
        const userPayload = {
            name: user_name
        }
        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true })
        res.redirect('/admin')

    } else if (user) {
        const userPayload = {
            username: user_name,
            password: pass_wd
        }

        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        console.log("user :", user);
        Room.find().exec((err, doc) => {
            res.render('users.ejs', { room: doc, user: user }); //add user object
        })

    }
    else {
        res.redirect('/login');

    }
});

async function findUser(username, passwd) {
    try {
        // Find user in the database
        let user = await User.findOne({ username: username, passwd: passwd });

        if (user) {
            // If user is found, return user data
            return user;
        } else {
            // If no user is found, return an error message
            throw new Error("User not found.");
        }
    } catch (error) {
        // If there's an error, throw the error
        throw error;
    }
}


function authenticate(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        res.redirect('/login')
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.redirect('/login')
            } else {
                req.user = user
                next()
            }
        })
    }
}



router.get('/login', (req, res) => {
    res.render('login.ejs')
})

router.get('/register', (req, res) => {
    res.render('register.ejs')
})


//! Admin
router.get('/admin', authenticate, (req, res) => {
    Room.find().exec((err, doc) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            // console.log("doc : ",doc);
            console.log("userInfo : ", req.user); // assuming that authenticate middleware adds user info to req.user

            res.render('admin.ejs', { room: doc, userInfo: req.user })
        }
    })
})


router.get('/admin_add', (req, res) => {
    res.render('admin_add_room.ejs')
})


//! Feature
router.get("/history", (req, res) => {
    res.render('history.ejs')
})

router.get("/history_check", (req, res) => {
    res.render('history_check.ejs')
})

router.get("/register_item/:id", (req, res) => {
    const user_id = req.params.id;
    res.render('register_item.ejs', {user_id})
    console.log(user_id)
})

router.get("/room/:id", (req, res) => {
    const user_id = req.params.id;
    Item.find().exec((err, doc_item) => {
        User.findOne({_id: user_id}).exec((err, doc_user) =>{
            Room.find().exec((err, doc) => {
                res.render('room.ejs', { room: doc , user: doc_user, item: doc_item})
            })
        })
    })
    console.log(user_id)
})

router.get("/book_room/:user_id/:room_id", (req, res) => {
    const user_id = req.params.user_id
    const room_id = req.params.room_id
    Item.find({user_id: user_id}).exec((err, doc_item) =>{
        User.findOne({_id: user_id}).exec((err, doc_user) =>{
            Room.findOne({_id: room_id}).exec((err, doc) => {
                res.render('book_room.ejs', { room: doc , user: doc_user , item: doc_item})
            })
        })
    });
})

router.get('/item/:user_id/:room_id', (req, res) => {
    const user_id = req.params.user_id
    const room_id = req.params.room_id
    Item.findOne({room_id: room_id}).exec((err, doc_item) =>{
        User.findOne({_id: user_id}).exec((err, doc_user) =>{
            Room.findOne({_id: room_id}).exec((err, doc) => {
                res.render('item.ejs', { room: doc , user: doc_user , item: doc_item})
            })
        })
    });
})

router.get('/auction/:user_id/:room_id/:item_id', (req, res) => {
    const user_id = req.params.user_id
    const room_id = req.params.room_id
    const item_id = req.params.item_id
    Item.findOne({room_id: room_id}).exec((err, doc_item) =>{
        User.findOne({_id: user_id}).exec((err, doc_user) =>{
            Room.findOne({_id: room_id}).exec((err, doc) => {
                res.render('auction.ejs', { room: doc , user: doc_user , item: doc_item})
            })
        })
    });
})

router.get('/payment', (req, res) => {
    res.render('payment.ejs')
})

router.get('/testchat', (req, res) => {
    res.render('Testchat.ejs')
})





//!DataBase
router.post('/register_db', (req, res) => {
    console.log(req.body);
    let data = new User({
        username: req.body.username,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        critizen_id: req.body.critizenID,
        email: req.body.email,
        passwd: req.body.passwd,
        phone: req.body.phone,

    })
    User.saveUser(data, (err) => {
        if (err) console.log(err)
        res.redirect('/login')
    })
})

router.post('/edit_user', (req, res) => {
    const user_id = req.body.user_id
    let data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.Email,
        phone: req.body.Phone
    }
    console.log(data)
    Room.findByIdAndUpdate(reserve_id, data, { useFindAndModify: false }).exec(err => {
        res.redirect('/user')
    })
})


router.post('/register_item_db',upload.single("item_pic"),(req, res) => {
    console.log(req.body);
    console.log(req.file);
    const state_item = 0
    let data = new Item({
        item_name: req.body.item_name,
        item_description: req.body.item_descrip,
        item_begin_price: req.body.begin_price,
        item_minimum_bid: req.body.min_bid,
        item_minimum_sell: req.body.min_sell,
        item_pic: req.file.filename,
        item_defect: req.body.scar_descrip,
        item_defect_pic: req.body.scar_pic,
        user_id: req.body.user_id,
        status: state_item
    })
    const user_ID = req.body.user_id
    Item.saveItem(data, (err) => {
        if (err) console.log(err)
        res.redirect('/user/'+user_ID)
    })
})

router.post('/open_room_db', (req, res) => {
    console.log(req.body);
    let data = new Room({
        time_open: req.body.time_open,
        time_close_door: req.body.time_close_door,
        time_finish: req.body.time_finish,
        auction_day: req.body.auction_day,
        item_id: req.body.item_id,
        user_id: req.body.user_id

    })
    Room.saveRoom(data, (err) => {
        if (err) console.log(err)
        res.redirect('/admin')
    })
})

router.post('/edit_room', (req, res) => {
    const reserve_id = req.body.reserve_id
    const item_ID = req.body.item_id
    const state_room = 1
    let data = {
        time_open: req.body.time_open,
        time_close_door: req.body.time_close_door,
        time_finish: req.body.time_finish,
        auction_day: req.body.auction_day,
        item_id: req.body.item_id,
        user_id: req.body.user_id,
        item_ad: req.body.item_ad,
        status:state_room
    }
    let data_i = {
        room_id: req.body.reserve_id
    }
    const user_ID = req.body.user_id
    Item.findByIdAndUpdate(item_ID, data_i,{ useFindAndModify: false } ).exec(err => {
        Room.findByIdAndUpdate(reserve_id, data, { useFindAndModify: false }).exec(err => {
            res.redirect('/room/'+user_ID)
        })
    })
})

//! OH
// get room by id
router.get('/room/:id', (req, res) => {
    const roomId = req.params.id;
    Room.findById(roomId, (err, room) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(room);
    });
});


// update room status 
router.put('/room/:id', (req, res) => {
    const roomId = req.params.id;

    console.log(req.body);

    Room.findByIdAndUpdate(roomId, req.body, { new: true }, (err, room) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Room updated successfully, send the updated room as a response
        res.json(room);
    });
});



// Items //
// get all items
router.get('/items', (req, res) => {
    Item.find().exec((err, items) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(items);
        }
    });
});

// เพื่อดึง Item ตาม id 
router.get('/item/:id', (req, res) => {
    const itemId = req.params.id;
    Item.findById(itemId, (err, item) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    });
});


// API endpoint เพื่อดึง Item ตาม user_id
router.get('/items/users/:user_id', async (req, res) => {
    try {
        const items = await Item.find({ user_id: req.params.user_id });
        res.json(items);
    } catch (error) {
        res.status(500).send(error);
    }
});

// API endpoint เพื่อดึง Item ตาม room_id
router.get('/items/room/:room_id', async (req, res) => {
    try {
        const items = await Item.find({ room_id: req.params.room_id });
        res.json(items);
    } catch (error) {
        res.status(500).send(error);
    }
});


// update item status 
router.put('/item/:id', (req, res) => {
    const itemId = req.params.id;

    console.log(req.body);

    Item.findByIdAndUpdate(itemId, req.body, { new: true }, (err, item) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        // Item updated successfully, send the updated item as a response
        res.json(item);
    });
});




// Transactions //
// Fetch all transactions
router.get("/transactions", (req, res) => {
    Transaction.find().exec((err, items) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(items);
        }
    });
});


//get transaction by seller id
router.get('/transactions/seller/:seller_id', async (req, res) => {
    try {
        const transactions = await Transaction.find({ seller_id: req.params.seller_id });

        const total = await Promise.resolve(Transaction.aggregate([
            {
                $match: { seller_id: req.params.seller_id }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$price' }
                }
            }
        ]));

        const sum = total.length > 0 ? total[0].total : 0;
        res.json({ transactions, sum });

    } catch (error) {
        res.status(500).send(error);
    }
});


//get transaction by buyer id
router.get('/transactions/buyer/:buyer_id', async (req, res) => {
    try {
        const transactions = await Transaction.find({ buyer_id: req.params.buyer_id });
        const total = await Promise.resolve(Transaction.aggregate([
            {
                $match: { buyer_id: req.params.buyer_id }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$price' }
                }
            }
        ]));

        const sum = total.length > 0 ? total[0].total : 0;
        res.json({ transactions, sum });
    } catch (error) {
        res.status(500).send(error);
    }
});

//create transaction
router.post('/transactions', async (req, res) => {
    try {
        const { item_id, seller_id, buyer_id, price, paid_date } = req.body;

        const newTransaction = new Transaction({
            item_id,
            seller_id,
            buyer_id,
            price,
            paid_date
        });

        const savedTransaction = await newTransaction.save();

        res.status(201).json(savedTransaction);
    } catch (error) {
        console.error('Failed to create transaction', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});



// Room //
router.get('/rooms/user/:user_id', async (req, res) => {
    try {
        const rooms = await Room.find({ user_id: req.params.user_id });
        res.json(rooms);
    } catch (error) {
        res.status(500).send(error);
    }
});



// Transfer //
// Fetch all transfers
router.get('/transfers', async (req, res) => {
    Transfer.find().exec((err, items) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(items);
        }
    });
});


// Users //
// Get all users
router.get('/users', async (req, res) => {
    User.find().exec((err, items) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err });
        } else {
            res.status(200).json(items);
        }
    });
});



// get user by Id
router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
});


// find user by username and password
router.post('/findUser', async (req, res) => {
    const { username, passwd } = req.body;

    console.log("AAAAAAAAAA");
    try {
        // Find user in the database
        let user = await User.findOne({ username: username, passwd: passwd });

        if (user) {
            // If user is found, return user data
            res.status(200).json(user);
            console.log("This User : ", user);


        } else {
            // If no user is found, return an error message
            res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        // If there's an error, return an error message
        res.status(500).json({ message: "Error occurred.", error: error.message });
    }

});


module.exports = router

