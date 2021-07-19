const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((connErr, channel) => {
    if (connErr) throw connErr;

    const queue = 'hello';

    channel.assertQueue(queue, {
      durable: false
    });

    console.log(` [*] Waiting for messges in ${queue}.`);

    channel.consume(queue, (msg) => {
      console.log(` [x] Received ${msg.content.toString()}`);
    }, { noAck: true});
  });
});