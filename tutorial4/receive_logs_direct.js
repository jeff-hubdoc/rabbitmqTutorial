const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`Usage: receive_logs_direct.js [info] [warning] [error]`);
  process.exit(1);
}

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((connErr, channel) => {
    if (connErr) throw connErr;

    const exchange = 'directLogs';

    channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    // allows server generated queue name
    channel.assertQueue('', {
      exclusive: true
    }, (queueErr, q) => {
      if (queueErr) throw queueErr;

      console.log(`Waiting for logs`);

      args.forEach((severity) => {
        channel.bindQueue(q.queue, exchange, severity);
      })

      channel.consume(q.queue, (msg) => {
        if (msg.content) console.log(`${msg.fields.routingKey}: ${msg.content.toString()}`);
      }, {
        noAck: true
      });
    })
  });
});