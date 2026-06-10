'use strict';

const moncash = require('../lib/moncash');

async function main() {
  const receiver = process.argv[2];
  const amount = Number(process.argv[3] || 10);
  const desc = process.argv[4] || 'CLI payout';
  const reference = process.argv[5] || `CLI-TX-${Date.now()}`;

  if (!receiver) {
    console.error('Usage: npm run transfert -- 50912345678 10 "Description" TX-001');
    process.exit(1);
  }

  if ((process.env.MONCASH_MODE || 'sandbox') !== 'sandbox') {
    console.error('Refusé: ce script ne fonctionne qu\'en mode sandbox.');
    process.exit(1);
  }

  const result = await moncash.transfert.create({ receiver, amount, desc, reference });
  console.log(JSON.stringify(result, null, 2));
  console.log(`\nVérifie le statut: npm run prefunded-status -- ${reference}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
