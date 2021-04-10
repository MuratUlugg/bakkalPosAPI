//Express
var express = require("express");

//Mongoose
var mongoose = require("mongoose");

//Redis
const redisClient = require('./redisClient');

//Mongo
var stockShema = require('./stock_schema');
var categorySchema = require("./category_schema");

mongoose.connect('mongodb://127.0.0.1:27017/stock', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

var mongoClient = mongoose.model('stock', stockShema, 'stock');

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
    mongoClient = mongoose.model('stock', stockShema, 'stock');
 //Redis Bağlandı Kontrolü Yapılır 
 if (redisClient.connected) {
    var key = 'stock'
    //Redisten stok kartı çekilir . 
    redisClient.get(key, function (err, stocks) {
        //Stok yok ise 
        if (stocks == null || stocks == '[]') {
            mongoClient.find(function (err, doc) {
                var data = JSON.stringify(doc);
                redisClient.set(key, data, function (err, res) { });
                redisClient.expire(key, 300); // expire süresi 5 dk
                res.send(doc);
            })
        }
        else {
            var doc = JSON.parse(stocks)
            res.send(stocks);
        }
    });

 }
 else {
        mongoClient.find(function (err, doc) {
            res.send(doc);
        });
    } 
})

app.get('/category', function (req, res) {
    mongoClient = mongoose.model('category', categorySchema, 'category');
      //Redis Bağlandı Kontrolü Yapılır 
      if (redisClient.connected) {
        var key = 'categoryMain'
        //Redisten stok kartı çekilir . 
        redisClient.get(key, function (err, stocks) {
            //Stok yok ise 
            if (stocks == null || stocks == '[]') {
                mongoClient.find(function (err, doc) {
                    var data = JSON.stringify(doc);
                    redisClient.set(key, data, function (err, res) { });
                    redisClient.expire(key, 300); // expire süresi 5 dk
                    res.send(doc);
                })
            }
            else {
                var doc = JSON.parse(stocks)
                res.send(stocks);
            }
        });

     }
     else {
            mongoClient.find(function (err, doc) {
                res.send(doc);
            });
        } 
})

app.get("/stock/stockbycategory/:categoryid", function (req, res) {
    mongoClient = mongoose.model('stock', stockShema, 'stock');
    //categoryid Alınır 
    var id = req.params.categoryid;
    //Redis Bağlandı Kontrolü Yapılır 
    if (redisClient.connected) {
        var key = 'category:' + id;
        //Redisten stok kartı çekilir . 
        redisClient.get(key, function (err, stocks) {
            //Stok yok ise 
            if (stocks == null || stocks == '[]') {
                var query = { "category": id.toString() };
                //Mongodb üzerinden çekilir ve redise kaydedilir.
                mongoClient.find(query, function (err, doc) {
                    var data = JSON.stringify(doc);
                    redisClient.set(key, data, function (err, res) { });
                    redisClient.expire(key, 300); // expire süresi 5 dk
                    res.send(doc);
                })
            } else {
                var doc = JSON.parse(stocks)
                res.send(stocks);
            }
        });
    }
    else {
        var query = { "category": req.params.categoryid };
        mongoClient = mongoose.model('stock', stockShema, 'stock');
        mongoClient.find(query, function (err, doc) {
            res.send(doc);
        });
    }
})

app.get("/stock/:stockId", function (req, res) {
    mongoClient = mongoose.model('stock', stockShema, 'stock');
    //stockId Alınır 
    var stockId = req.params.stockId;
    //Redis Bağlandı Kontrolü Yapılır 
    if (redisClient.connected) {
        var stockKey = 'stock:' + stockId;
        //Redisten stok kartı çekilir . 
        redisClient.get(stockKey, function (err, stocks) {
            //Stok yok ise 
            if (stocks == null) {
                var query = { "stockCode": stockId.toString() };
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
        var query = { "stockCode": req.params.stockId };
        mongoClient = mongoose.model('stock', stockShema, 'stock');
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