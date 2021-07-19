const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((connErr, channel) => {
    if (connErr) throw connErr;

    const exchange = 'logs';

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });

    // allows server generated queue name
    channel.assertQueue('', {
      exclusive: true
    }, (queueErr, q) => {
      if (queueErr) throw queueErr;

      console.log(`Waiting for messages in ${q.queue}`);

      // binds queue to an exchange
      channel.bindQueue(q.queue, exchange, '');

      channel.consume(q.queue, (msg) => {
        if (msg.content) console.log(`${msg.content.toString()}`);
      }, {
        noAck: true
      });
    })
  });
});