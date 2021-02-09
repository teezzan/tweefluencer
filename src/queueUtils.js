var amqp = require('amqplib/callback_api');
const CONN_URL = process.env.CONN_URL

let channel = null;

amqp.connect(CONN_URL, function (error1, conn) {
    if (error1) {
        throw error1;
    }
    console.log("Connected to queue Successfully")
    conn.createChannel(function (err, ch) {
        if (err)
            throw err;

        channel = ch;
    });
});


exports.publishToQueue = async (queueName, data) => {
    channel.assertQueue(queueName, {
        durable: true
    });

    channel.sendToQueue(queueName, Buffer.from(data));
}


process.on('exit', (code) => {
    channel.close();
    console.log(`Closing rabbitmq Channel`);
});