'use strict';

const moncash = require('../lib/moncash');

async function main() {
  const reference = process.argv[2];

  if (!reference) {
    console.error('Usage: npm run prefunded-status -- TX-001');
    process.exit(1);
  }

  const status = await moncash.prefunded.getTransactionStatus(reference);
  console.log(JSON.stringify(status, null, 2));
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
