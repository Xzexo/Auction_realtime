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
let roomSchema = mongoose.Schema({
    //room_id:Number,
    time_open:String,
    time_close_door:String,
    time_finish:String,
    auction_day:Date
})

//create model
let Room = mongoose.model("room",roomSchema)

//export model
module.exports = Room

//save document(data)
module.exports.saveRoom=function(model,document){
   model.save(document)
}
