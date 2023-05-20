const mongoose = require('mongoose')

//connect to MongoDB
mongoose.set("strictQuery", false);
//connect data
const dbUrl = 'mongodb://127.0.0.1:27017/auctionDB'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => console.log(err))



let transactionSchema = mongoose.Schema({
    item_id: { type: mongoose.Schema.Types.String, required: true, ref: 'Item' },
    seller_id: { type: mongoose.Schema.Types.String, required: true, ref: 'User' },
    buyer_id: { type: mongoose.Schema.Types.String, required: true, ref: 'User' },
    price: { type: Number, required: true },
    paid_date: { type: Date, default: Date.now }

},
    { versionKey: false } // ปิดการเก็บเขตข้อมูลเวอร์ชัน
);

// Create model
let Transaction = mongoose.model("Transaction", transactionSchema);

// Export model
module.exports = Transaction

// Save transaction
module.exports.saveTransaction = function (transaction, document) {
    transaction.save(document);
};
