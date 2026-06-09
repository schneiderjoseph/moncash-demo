'use strict';

const moncash = require('../lib/moncash');

async function main() {
  const orderId = process.argv[2];

  if (!orderId) {
    console.error('Usage: npm run capture -- ORDER-001');
    process.exit(1);
  }

  const capture = await moncash.capture.getByOrderId(orderId);
  console.log(JSON.stringify(capture, null, 2));
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
