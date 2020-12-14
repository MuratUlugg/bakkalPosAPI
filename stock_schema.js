var mongoose = require("mongoose");

var stockSchema = new mongoose.Schema({
    name: String,
    stock_id: Number,
    unit: String,
    unit2: String,
    unit2S: Number,
    price: Number,
    balance: Number,
    taxRate: Number,
    groupCode: Number
});

module.exports = stockSchema;