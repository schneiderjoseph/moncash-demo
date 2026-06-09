'use strict';

const moncash = require('../lib/moncash');

async function main() {
  const orderId = process.argv[2] || `CLI-${Date.now()}`;
  const amount = Number(process.argv[3] || 50);

  const payment = await moncash.payment.create({ amount, orderId });
  const url = moncash.payment.redirectUri(payment);

  console.log('Payment created:');
  console.log(JSON.stringify(payment, null, 2));
  console.log('\nRedirect URL:');
  console.log(url);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
