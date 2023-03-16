const mongoose = require('mongoose')

//connect to MongoDB
mongoose.set("strictQuery", false);
//connect data
const dbUrl = 'mongodb://127.0.0.1:27017/auctionDB'

mongoose.connect(dbUrl,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).catch(err=>console.log(err))




//Schema
let itemSchema = mongoose.Schema({
    item_name:String,
    item_description:String,
    item_begin_price:Number,
    item_minimum_bid:Number,
    item_minimum_sell:Number,
    item_pic:String,
    item_defect:String,
    item_defect_pic:String,
    user_id:String,
    room_id:String
})

//create model
let Item = mongoose.model("item",itemSchema)

//export model
module.exports = Item

//save document(data)
module.exports.saveItem=function(model,document){
   model.save(document)
}


 
