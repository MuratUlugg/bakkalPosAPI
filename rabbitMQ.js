var amqp = require('amqplib/callback_api');
const rabbitUrl = 'amqp://192.168.1.5';
const opt = { creadentials: require('amqplib').credentials.plain('murat', '123') }

function sendRabbitMq(queueName, data) {
    amqp.connect(rabbitUrl, opt, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = queueName;

            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(data));   // Data burda rabbitMQ ya gönderilir .
            console.log("[x] Send %s ", data);
        });
        setTimeout(function () {
            connection.close();
        }, 500);
    });
}