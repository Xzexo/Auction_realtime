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
const Transaction = require('../models/transactions')
const Transfer = require('../models/transfer')

//!upload file
const multer = require('multer')

// Load environment variables from a .env file
require('dotenv').config();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '.views/image/item')
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
router.get('/user', (req, res) => {
    Room.find().exec((err, doc) => {
        res.render('users.ejs', { room: doc })
    })
})

router.get('/user_edit', (req, res) => {
    res.render('user_edit.ejs')
})



//! Login 

router.post('/check', async (req, res) => {
    const user_name = req.body.username;
    const pass_wd = req.body.passwd;

    if (authenticationSuccess(user_name, pass_wd)) {

        if (user_name == process.env.USERNAME && pass_wd == process.env.PASS) {
            const user = {
                name: user_name
            }
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' })
            res.cookie('token', token, { httpOnly: true })
            res.redirect('/admin')

        } else {
            const userPayload = {
                username: user_name,
                password: pass_wd
            }

            const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });

            Room.find().exec((err, doc) => {
                res.render('users.ejs', { room: doc });
            })
        }
    } else {
        res.redirect('/login');
    }
});

function authenticationSuccess(username, password) {
    const user =  User.findOne({
        username: username,
        password: password
    });
    return user != null;
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
    console.log(authenticate);

    Room.find().exec((err, doc) => {
    console.log("doc : ",doc);
        
        res.render('admin.ejs', { room: doc })
    })
})


router.get('/admin_add', (req, res) => {
    res.render('admin_add_room.ejs')
})


//! Feature
router.get("/user", (req, res) => {
    res.render('users.ejs')
})

router.get("/history", (req, res) => {
    res.render('history.ejs')
})

router.get("/history_check", (req, res) => {
    res.render('history_check.ejs')
})

router.get("/register_item", (req, res) => {
    res.render('register_item.ejs')
})

router.get("/room", (req, res) => {
    Room.find().exec((err, doc) => {
        res.render('room.ejs', { room: doc })
    })
})

router.get('/auction', (req, res) => {
    res.render('auction.ejs')
})

router.get('/payment', (req, res) => {
    res.render('payment.ejs')
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


router.post('/register_item_db', (req, res) => {
    console.log(req.body);
    let data = new Item({
        item_name: req.body.item_name,
        item_description: req.body.item_descrip,
        item_begin_price: req.body.begin_price,
        item_minimum_bid: req.body.min_bid,
        item_minimum_sell: req.body.min_sell,
        item_pic: req.body.item_pic,
        item_defect: req.body.scar_descrip,
        item_defect_pic: req.body.scar_pic,
        user_id: req.body.user_id
    })
    Item.saveItem(data, (err) => {
        if (err) console.log(err)
        res.redirect('/register_item')
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
    let data = {
        time_open: req.body.time_open,
        time_close_door: req.body.time_close_door,
        time_finish: req.body.time_finish,
        auction_day: req.body.auction_day
    }
    Room.findByIdAndUpdate(reserve_id, data, { useFindAndModify: false }).exec(err => {
        res.redirect('/room')
    })
})


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




module.exports = router

router.get("/:id", (req, res) => {
    const room_id = req.params.id
    Room.findOne({ _id: room_id }).exec((err, doc) => {
        res.render('book_room.ejs', { room: doc })
    })
})