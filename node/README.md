# MonCash Demo — Node.js

![MonCash](../assets/moncash-logo.png)

Demo Express pour tester [`@zygrec/moncash`](https://www.npmjs.com/package/@zygrec/moncash) en **sandbox**.

## Prérequis

- Node.js 12+
- `@zygrec/moncash` >= 1.1.0
- Identifiants sandbox ([dashboard MonCash](https://sandbox.moncashbutton.digicelgroup.com/Moncash-business/Login))

## Installation

```bash
cp .env.example .env
# Remplis MONCASH_CLIENT_ID et MONCASH_CLIENT_SECRET
npm install
```

## Serveur web

```bash
npm start
```

Ouvre http://localhost:3000

| Section | SDK | Route |
|---------|-----|-------|
| Paiement | `payment.create` + `redirectUri` | `POST /pay` |
| Capture order | `capture.getByOrderId` | `GET /capture` |
| Capture transaction | `capture.getByTransactionId` | `GET /capture/transaction` |
| Customer | `customer.getStatus` | `GET /customer` |
| Solde préfinancé | `prefunded.getBalance` | `GET /prefunded/balance` |
| Statut virement | `prefunded.getTransactionStatus` | `GET /prefunded/status` |
| Transfert | `transfert.create` | `POST /transfert` |

> `transfert`, `prefunded` et `customer` : **compte business MonCash requis** (ou demander à Digicel l'activation sur sandbox).

## Scripts CLI

```bash
npm run pay -- ORDER-123 100
npm run capture -- ORDER-123
npm run capture-tx -- 12874820
npm run customer -- 50912345678
npm run prefunded-balance
npm run prefunded-status -- TX-001
npm run transfert -- 50912345678 10 "Demo payout" TX-001
```

## Sécurité

- Ne commite jamais `.env`
- Mode `sandbox` uniquement pour les tests
