var mongoose = require("mongoose");
var stockSchema = new mongoose.Schema({
    stockCode: String,
    stockName: String,
    unit: String,
    quantityAvailable: Number,
    cost: Number,
    status: String,
    quantityOnOrder: Number,
    currencyCode: String ,
    supplierName: String,
    supplierId: String,
    createDate: Date ,
    lastQuantityUpdateDate: Date ,
    lastCostUpdateDate: Date ,
    lastUpdateDate: Date,
    categoryId: Number,
    picture: String,
});

module.exports = stockSchema;