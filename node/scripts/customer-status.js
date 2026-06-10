'use strict';

const moncash = require('../lib/moncash');

async function main() {
  const account = process.argv[2];

  if (!account) {
    console.error('Usage: npm run customer -- 50912345678');
    process.exit(1);
  }

  const status = await moncash.customer.getStatus(account);
  console.log(JSON.stringify(status, null, 2));
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
