const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`Usage: receive_logs_topic.js <facility>.<severity>`);
  process.exit(1);
}

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((connErr, channel) => {
    if (connErr) throw connErr;

    const exchange = 'topicLogs';

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    // allows server generated queue name
    channel.assertQueue('', {
      exclusive: true
    }, (queueErr, q) => {
      if (queueErr) throw queueErr;

      console.log(`Waiting for logs`);

      args.forEach((key) => {
        channel.bindQueue(q.queue, exchange, key);
      })

      channel.consume(q.queue, (msg) => {
        if (msg.content) console.log(`${msg.fields.routingKey}: ${msg.content.toString()}`);
      }, {
        noAck: true
      });
    })
  });
});