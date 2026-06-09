'use strict';

const express = require('express');
const Moncash = require('@zygrec/moncash');
const moncash = require('./lib/moncash');

const app = express();
const PORT = process.env.PORT || 3000;

function normalizeOrderId(raw) {
  const id = String(raw || '').trim();
  if (!id) return id;
  if (/^ORDER-/i.test(id)) return id;
  if (/^\d+$/.test(id)) return `ORDER-${id}`;
  return id;
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/moncash-button.png', (req, res) => {
  res.sendFile(Moncash.getButtonPath());
});

app.get('/', (req, res) => {
  const orderId = `ORDER-${Date.now()}`;
  res.send(`
    <h1>MonCash SDK Demo (sandbox)</h1>
    <p>Testez un paiement MonCash avec le SDK <code>@zygrec/moncash</code>.</p>
    <form method="POST" action="/pay">
      <label>Montant (HTG) <input name="amount" type="number" min="1" value="50" required></label><br><br>
      <input type="hidden" name="orderId" value="${orderId}">
      <button type="submit" style="background:none;border:none;padding:0;cursor:pointer">
        <img src="/moncash-button.png" alt="Pay with MonCash" height="48">
      </button>
    </form>
    <hr>
    <p>Ou vérifiez un paiement existant :</p>
    <form method="GET" action="/capture">
      <label>Order ID <input name="orderId" placeholder="ORDER-1781043309838" required></label>
      <button type="submit">Capturer</button>
    </form>
  `);
});

app.post('/pay', async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const orderId = String(req.body.orderId).trim();

    const payment = await moncash.payment.create({ amount, orderId });
    const redirectUrl = moncash.payment.redirectUri(payment);

    res.redirect(redirectUrl);
  } catch (err) {
    res.status(400).send(`<h1>Erreur paiement</h1><pre>${err.message}</pre><a href="/">Retour</a>`);
  }
});

app.get('/capture', async (req, res) => {
  try {
    const orderId = normalizeOrderId(req.query.orderId);
    const capture = await moncash.capture.getByOrderId(orderId);

    res.send(`
      <h1>Capture — ${orderId}</h1>
      <pre>${JSON.stringify(capture, null, 2)}</pre>
      <a href="/">Retour</a>
    `);
  } catch (err) {
    const tried = normalizeOrderId(req.query.orderId);
    res.status(400).send(`<h1>Erreur capture</h1><pre>${err.message}</pre><p>Order ID recherché : <code>${tried}</code></p><p>Utilise l'ID complet, ex. <code>ORDER-1781043309838</code></p><a href="/">Retour</a>`);
  }
});

app.listen(PORT, () => {
  console.log(`Demo MonCash: http://localhost:${PORT}`);
  console.log(`Mode: ${process.env.MONCASH_MODE || 'sandbox'}`);
});
