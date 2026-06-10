# MonCash Demo — Node.js

![MonCash](../assets/moncash-logo.png)

Demo Express pour tester **toutes** les APIs de [`@zygrec/moncash`](https://www.npmjs.com/package/@zygrec/moncash) en **sandbox**.

## Prérequis

- Node.js 12+
- `@zygrec/moncash` >= 1.1.0
- Identifiants sandbox ([dashboard MonCash](https://sandbox.moncashbutton.digicelgroup.com/Moncash-business/Login))
- Compte préfinancé activé (pour transfert / prefunded)

## Installation

```bash
cp .env.example .env
# Remplis MONCASH_CLIENT_ID et MONCASH_CLIENT_SECRET
npm install
```

Si 1.1.0 n'est pas encore sur npm, lie le SDK local :

```bash
npm install ../../MONCASH
```

## Serveur web

```bash
npm start
```

Ouvre http://localhost:3000 — le tableau de bord couvre toutes les APIs :

| Section | SDK | Route |
|---------|-----|-------|
| Paiement | `payment.create` + `redirectUri` | `POST /pay` |
| Capture order | `capture.getByOrderId` | `GET /capture` |
| Capture transaction | `capture.getByTransactionId` | `GET /capture/transaction` |
| Customer | `customer.getStatus` | `GET /customer` |
| Solde préfinancé | `prefunded.getBalance` | `GET /prefunded/balance` |
| Statut virement | `prefunded.getTransactionStatus` | `GET /prefunded/status` |
| Transfert | `transfert.create` | `POST /transfert` (sandbox only) |

## Scripts CLI

```bash
# Paiement entrant
npm run pay -- ORDER-123 100

# Capture
npm run capture -- ORDER-123
npm run capture-tx -- 12874820

# Customer & prefunded
npm run customer -- 50912345678
npm run prefunded-balance
npm run prefunded-status -- TX-001

# Payout (sandbox only)
npm run transfert -- 50912345678 10 "Demo payout" TX-001
```

## Flux de test recommandé

1. **Paiement** — crée un paiement via le bouton MonCash, confirme sur la sandbox
2. **Capture** — récupère le statut avec l'Order ID ou Transaction ID
3. **Customer** — vérifie si un numéro 509... est actif MonCash
4. **Prefunded balance** — lit le solde du compte marchand
5. **Transfert** — envoie des HTG vers un wallet (sandbox, avec `reference` unique)
6. **Prefunded status** — suit le virement avec la même `reference`

## Sécurité

- Ne commite jamais `.env`
- Mode `sandbox` uniquement pour les tests
- `customer`, `prefunded` et `transfert` sont désactivés en mode `live` dans cette demo
- En production : ces APIs doivent rester côté serveur, jamais exposées au navigateur client
