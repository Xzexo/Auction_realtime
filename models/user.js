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
let userSchema = mongoose.Schema({
    user_id:Number,
    username:String,
    first_name:String,
    last_name:String,
    critizen_id:Number,
    email:String,
    passwd:String,
    phone:Number,
    user_type:String
})

//create model
let User = mongoose.model("user",userSchema)

module.exports = User

//save document(data)
module.exports.saveUser=function(model,document){
   model.save(document)
}