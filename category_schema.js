var mongoose = require("mongoose");
var categorySchema = new mongoose.Schema({
    categoryId: Number,
    categoryName:String,
});

module.exports = categorySchema;