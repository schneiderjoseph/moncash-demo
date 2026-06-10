'use strict';

const express = require('express');
const Moncash = require('@zygrec/moncash');
const moncash = require('./lib/moncash');

const app = express();
const PORT = process.env.PORT || 3000;

function isSandbox() {
  return (process.env.MONCASH_MODE || 'sandbox') === 'sandbox';
}

function sandboxOnly(res) {
  if (isSandbox()) return false;
  res.status(403).send('<h1>Sandbox only</h1><p>Cette route est désactivée en mode live.</p><a href="/">Retour</a>');
  return true;
}

function normalizeOrderId(raw) {
  const id = String(raw || '').trim();
  if (!id) return id;
  if (/^ORDER-/i.test(id)) return id;
  if (/^\d+$/.test(id)) return `ORDER-${id}`;
  return id;
}

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${title} — MonCash Demo</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
    section { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
    h2 { margin-top: 0; font-size: 1.1rem; }
    label { display: block; margin: 0.5rem 0; }
    input, button { font-size: 1rem; padding: 0.4rem 0.6rem; }
    pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; }
    .warn { color: #b45309; font-size: 0.9rem; }
    .back { margin-top: 1.5rem; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${body}
  <p class="back"><a href="/">← Accueil</a></p>
</body>
</html>`;
}

function resultPage(title, data, note) {
  return page(title, `
    <pre>${JSON.stringify(data, null, 2)}</pre>
    ${note ? `<p class="warn"><em>${note}</em></p>` : ''}
  `);
}

function errorPage(title, err) {
  return page(title, `<pre>${err.message}</pre>`);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/moncash-button.png', (req, res) => {
  res.sendFile(Moncash.getButtonPath());
});

app.get('/', (req, res) => {
  const orderId = `ORDER-${Date.now()}`;
  const refId = `TX-${Date.now()}`;

  res.send(page('MonCash SDK Demo', `
    <p>Testez toutes les APIs du SDK <code>@zygrec/moncash</code> en <strong>${process.env.MONCASH_MODE || 'sandbox'}</strong>.</p>

    <section>
      <h2>Paiement entrant — <code>payment.create</code></h2>
      <form method="POST" action="/pay">
        <label>Montant (HTG) <input name="amount" type="number" min="1" value="50" required></label>
        <input type="hidden" name="orderId" value="${orderId}">
        <button type="submit" style="background:none;border:none;padding:0;cursor:pointer;margin-top:0.5rem">
          <img src="/moncash-button.png" alt="Pay with MonCash" height="48">
        </button>
      </form>
    </section>

    <section>
      <h2>Capture — <code>capture.getByOrderId</code></h2>
      <form method="GET" action="/capture">
        <label>Order ID <input name="orderId" placeholder="ORDER-1781043309838" required></label>
        <button type="submit">Capturer par Order ID</button>
      </form>
    </section>

    <section>
      <h2>Capture — <code>capture.getByTransactionId</code></h2>
      <form method="GET" action="/capture/transaction">
        <label>Transaction ID <input name="transactionId" placeholder="12874820" required></label>
        <button type="submit">Capturer par Transaction ID</button>
      </form>
    </section>

    <section>
      <h2>Customer — <code>customer.getStatus</code></h2>
      <form method="GET" action="/customer">
        <label>Compte (509...) <input name="account" placeholder="50912345678" required></label>
        <button type="submit">Vérifier le compte</button>
      </form>
      <p class="warn">Backend-only en production (risque d'énumération de comptes).</p>
    </section>

    <section>
      <h2>Prefunded — <code>prefunded.getBalance</code></h2>
      <form method="GET" action="/prefunded/balance">
        <button type="submit">Lire le solde préfinancé</button>
      </form>
      <p class="warn">Donnée sensible — backend only en production.</p>
    </section>

    <section>
      <h2>Prefunded — <code>prefunded.getTransactionStatus</code></h2>
      <form method="GET" action="/prefunded/status">
        <label>Reference <input name="reference" placeholder="TX-001" required></label>
        <button type="submit">Statut du virement</button>
      </form>
    </section>

    <section>
      <h2>Transfert — <code>transfert.create</code> ${isSandbox() ? '' : '(désactivé hors sandbox)'}</h2>
      ${isSandbox() ? `
      <form method="POST" action="/transfert">
        <label>Receiver (509...) <input name="receiver" placeholder="50912345678" required></label>
        <label>Montant (HTG) <input name="amount" type="number" min="1" value="10" required></label>
        <label>Description <input name="desc" value="Demo payout" required></label>
        <label>Reference <input name="reference" value="${refId}" required></label>
        <button type="submit" onclick="return confirm('Envoyer un virement sandbox ?')">Envoyer le transfert</button>
      </form>
      <p class="warn">Payout irréversible — sandbox uniquement. Vérifie le numéro receiver avant d'envoyer.</p>
      ` : '<p class="warn">Route désactivée en mode live.</p>'}
    </section>
  `));
});

app.post('/pay', async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    const orderId = String(req.body.orderId).trim();
    const payment = await moncash.payment.create({ amount, orderId });
    res.redirect(moncash.payment.redirectUri(payment));
  } catch (err) {
    res.status(400).send(errorPage('Erreur paiement', err));
  }
});

app.get('/capture', async (req, res) => {
  try {
    const orderId = normalizeOrderId(req.query.orderId);
    const capture = await moncash.capture.getByOrderId(orderId);
    res.send(resultPage(`Capture — ${orderId}`, capture));
  } catch (err) {
    const tried = normalizeOrderId(req.query.orderId);
    res.status(400).send(page('Erreur capture', `
      <pre>${err.message}</pre>
      <p>Order ID recherché : <code>${tried}</code></p>
    `));
  }
});

app.get('/capture/transaction', async (req, res) => {
  try {
    const transactionId = String(req.query.transactionId || '').trim();
    const capture = await moncash.capture.getByTransactionId(transactionId);
    res.send(resultPage(`Capture — TX ${transactionId}`, capture));
  } catch (err) {
    res.status(400).send(errorPage('Erreur capture transaction', err));
  }
});

app.get('/customer', async (req, res) => {
  if (sandboxOnly(res)) return;

  try {
    const account = String(req.query.account || '').trim();
    if (!account) {
      return res.status(400).send(errorPage('Paramètre manquant', new Error('Utilise ?account=50912345678')));
    }
    const status = await moncash.customer.getStatus(account);
    res.send(resultPage(`Customer — ${account}`, status, 'Backend-only en production.'));
  } catch (err) {
    res.status(400).send(errorPage('Erreur customer', err));
  }
});

app.get('/prefunded/balance', async (req, res) => {
  if (sandboxOnly(res)) return;

  try {
    const balance = await moncash.prefunded.getBalance();
    res.send(resultPage('Solde préfinancé', balance, 'Donnée sensible — backend only en production.'));
  } catch (err) {
    res.status(400).send(errorPage('Erreur prefunded balance', err));
  }
});

app.get('/prefunded/status', async (req, res) => {
  if (sandboxOnly(res)) return;

  try {
    const reference = String(req.query.reference || '').trim();
    if (!reference) {
      return res.status(400).send(errorPage('Paramètre manquant', new Error('Utilise ?reference=TX-001')));
    }
    const status = await moncash.prefunded.getTransactionStatus(reference);
    res.send(resultPage(`Prefunded — ${reference}`, status));
  } catch (err) {
    res.status(400).send(errorPage('Erreur prefunded status', err));
  }
});

app.post('/transfert', async (req, res) => {
  if (sandboxOnly(res)) return;

  try {
    const receiver = String(req.body.receiver || '').trim();
    const amount = Number(req.body.amount);
    const desc = String(req.body.desc || '').trim();
    const reference = String(req.body.reference || '').trim();

    const result = await moncash.transfert.create({ receiver, amount, desc, reference });
    res.send(resultPage(`Transfert — ${reference}`, result, 'Vérifie le statut avec prefunded.getTransactionStatus.'));
  } catch (err) {
    res.status(400).send(errorPage('Erreur transfert', err));
  }
});

app.listen(PORT, () => {
  console.log(`Demo MonCash: http://localhost:${PORT}`);
  console.log(`Mode: ${process.env.MONCASH_MODE || 'sandbox'}`);
  console.log('APIs: payment, capture, customer, prefunded, transfert');
});
