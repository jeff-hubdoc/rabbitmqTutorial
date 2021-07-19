// const { promisify } = require('util');
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) throw err;

  connection.createChannel((connectErr, channel) => {
    if (connectErr) throw connectErr;

    const queue = 'taskQueue';

    // takes everything after argument then joins it together as a single string with space in between
    const msg = process.argv.slice(2).join(' ') || 'Hello world!';

    // asserts that queue exists / creates the queue if it does not exist
    // durable makes sure that it persists past restarts
    channel.assertQueue(queue, {
      durable: true
    });

    // marks our messages as persistent
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });

    console.log(`Sent ${msg}`);

    setTimeout(function() {
      connection.close();
      process.exit(0)
      }, 500);
  });
});