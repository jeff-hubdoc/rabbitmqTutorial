// const { promisify } = require('util');
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((connectErr, channel) => {
    if (connectErr) throw connectErr;

    const exchange = 'logs';

    // takes everything after argument then joins it together as a single string with space in between
    const msg = process.argv.slice(2).join(' ') || 'Hello world!';

    // asserts that exchange exists / creates the exchange if it does not exist
    // durable makes sure that it persists past restarts
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });

    channel.publish(exchange, '', Buffer.from(msg));

    console.log(`Sent ${msg}`);

    setTimeout(function() {
      connection.close();
      process.exit(0)
      }, 500);
  });
});