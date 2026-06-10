'use strict';

const moncash = require('../lib/moncash');

async function main() {
  const balance = await moncash.prefunded.getBalance();
  console.log(JSON.stringify(balance, null, 2));
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
