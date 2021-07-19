// const { promisify } = require('util');
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, connection) {
  if (err) {
    throw err;
  }

  connection.createChannel(function(connectErr, channel) {
    if (connectErr) {
      throw connectErr;
    }

    const queue = 'hello';
    const msg = 'wow this is cool';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(` [x] Sent ${msg}`);

    setTimeout(function() {
      connection.close();
      process.exit(0)
      }, 500);
  })
});