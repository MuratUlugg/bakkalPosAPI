var mongoose = require("mongoose");

var stockSchema = new mongoose.Schema({
    stockCode: string,
    stockName: string,
    unit: string,
    quantityAvailable: number,
    cost: number,
    status: string,
    quantityOnOrder: number,
    currencyCode: string ,
    dscoItemId: number,
    supplierName: string,
    supplierId: string,
    createDate: Date ,
    lastQuantityUpdateDate: Date ,
    lastCostUpdateDate: Date ,
    lastUpdateDate: Date,
    categoryId: number,
    picture: string,

});

module.exports = stockSchema;