'use strict';

const moncash = require('../lib/moncash');

async function main() {
  const transactionId = process.argv[2];

  if (!transactionId) {
    console.error('Usage: npm run capture-tx -- 12874820');
    process.exit(1);
  }

  const capture = await moncash.capture.getByTransactionId(transactionId);
  console.log(JSON.stringify(capture, null, 2));
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
