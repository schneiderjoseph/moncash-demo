'use strict';

require('dotenv').config();
const moncash = require('../lib/moncash');

async function run(name, fn) {
  try {
    const result = await fn();
    console.log(`[OK] ${name}:`, JSON.stringify(result));
  } catch (err) {
    console.log(`[ERR] ${name}:`, err.type, '|', err.message, '| http:', err.httpCode || 'n/a');
  }
}

async function main() {
  await run('customer.getStatus', () => moncash.customer.getStatus('50931537384'));
  await run('prefunded.getBalance', () => moncash.prefunded.getBalance());
  await run('prefunded.getTransactionStatus', () => moncash.prefunded.getTransactionStatus('TX-002039232395'));
  await run('transfert.create', () => moncash.transfert.create({
    receiver: '50931537384',
    amount: 10,
    desc: 'Debug test',
    reference: `TX-DBG-${Date.now()}`
  }));
}

main();
