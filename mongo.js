const { Module } = require("module");
var mongoose = require("mongoose");
var stockShema = require('./stock_schema');

mongoose.connect('mongodb://127.0.0.1:27017/stock', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const mongoClient = mongoose.model('stock', stockShema, 'stock');

module.exports = mongoClient;

