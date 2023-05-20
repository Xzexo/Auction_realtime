const mongoose = require('mongoose');

//connect to MongoDB
mongoose.set("strictQuery", false);
//connect data
const dbUrl = 'mongodb://127.0.0.1:27017/auctionDB';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err));

//Schema
let transferSchema = mongoose.Schema({
    id: String,
    type: String,
    description: String,
    is_delete: Boolean
});

//create model
let Transfer = mongoose.model("Transfer", transferSchema);

//export model
module.exports = Transfer;

//save document(data)
module.exports.saveTransfer = function (model, document) {
    model.save(document);
};
