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
let TranSchema = mongoose.Schema({
    item_id:String,
    price:Number,
    date:Date,
    seller_id:String,
    bidder_id:String,
})

//create model
let Trans = mongoose.model("transaction",TranSchema)

//export model
module.exports = Trans

//save document(data)
module.exports.saveTrans=function(model,document){
   model.save(document)
}
