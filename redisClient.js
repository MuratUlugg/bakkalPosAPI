//Redis 

var redis = require('redis');
const client = redis.createClient(); // Yeni cliet oluşturdum .

//Redis Connect 
client.on('connect', function () { console.log('Redis Bağlantısı Sağlandı.'); });
client.on('error', function (err) { console.log('Redis Client Üzerinde Hata Oluştu.' + err); });

module.exports = client;