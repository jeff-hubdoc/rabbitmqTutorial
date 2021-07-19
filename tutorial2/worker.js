const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((connErr, channel) => {
    if (connErr) throw connErr;

    const queue = 'taskQueue';

    channel.assertQueue(queue, {
      durable: true
    });

    // only keeps one message in the queue
    channel.prefetch(1);

    console.log(` [*] Waiting for messges in ${queue}.`);

    channel.consume(queue, (msg) => {
      const secs = msg.content.toString().split('.').length - 1;

      console.log(` Received ${msg.content.toString()}`);

      setTimeout(() => console.log('Done'), secs * 1000);
    }, {
      noAck: false
    });
  });
});