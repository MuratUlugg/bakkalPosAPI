//Express
var express = require("express");

//Mongoose
var mongoose = require("mongoose");

//Redis
const redisClient = require('./redisClient');

//Mongo
const mongoClient = require('./mongo');

// Stock Schema 
var stockSchema = require('./stock_schema');

// Enable Cors
var cors = require("cors");
var app = express();
app.use(cors());  // !Full Açık Güvenlik domain kısıtlaması yapılmalı .

//bodyParser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//RabitMQ 
const sendRabbitMq = require('./rabbitMQ');
const { json } = require("body-parser");


// EndPoints
app.get('/stock', function (req, res) {
    mongoClient.find(function (err, doc) {
        const page = req.query.page;
        const limit = req.query.limit;
        const startIndex = (page -1) * limit;
        const EndIndex = page * limit;
        const result = doc.slice(startIndex,EndIndex)
        res.send(result);
    })
})

app.get("/stock/:stockId", function (req, res) {
    //stockId Alınır 
    var stockId = req.params.stockId;
    //Redis Bağlandı Kontrolü Yapılır 
    if (redisClient.connected) {
        var stockKey = 'stock:' + stockId;
        //Redisten stok kartı çekilir . 
        redisClient.get(stockKey, function (err, stocks) {
            //Stok yok ise 
            if (stocks == null) {
                var query = { "sku": stockId };
                //Mongodb üzerinden çekilir ve redise kaydedilir.
                mongoClient.findOne(query, function (err, doc) {
                    var data = JSON.stringify(doc);
                    redisClient.set(stockKey, data, function (err, res) { });
                    redisClient.expire(stockKey, 300); // expire süresi 5 dk
                    res.send(doc);
                })
            } else {
                var doc = JSON.parse(stocks)
                res.send(stocks);
            }
        });
    }
    else {
        var query = { "stock_id": req.params.stockId };
        mongoClient.find(query, function (err, doc) {
            res.send(doc);
        });
    }
})

app.post('/updateStock', async (req, res) => {
    try {
        var Stocks = mongoose.model('stock', stockSchema, 'stocks');
        var updateStocks = new Stocks(req.body);
        const stocks = await Stocks.findOne({ stockId: updateStocks.stockId });
        await stocks.updateOne(updateStocks);
        //Send RabbitMq
        sendRabbitMq('newsChannel', JSON.stringify(updateStocks));
        return res.status(200).json({ status: 'succesfully update' });
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(1995);