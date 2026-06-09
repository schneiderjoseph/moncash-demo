'use strict';

require('dotenv').config();
const Moncash = require('@zygrec/moncash');

const clientId = process.env.MONCASH_CLIENT_ID;
const clientSecret = process.env.MONCASH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error(
    'Missing MONCASH_CLIENT_ID or MONCASH_CLIENT_SECRET. Copy .env.example to .env'
  );
}

const moncash = new Moncash({
  clientId,
  clientSecret,
  mode: process.env.MONCASH_MODE || 'sandbox'
});

module.exports = moncash;
