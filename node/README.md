# MonCash Demo — Node.js

![MonCash](../assets/moncash-logo.png)

Demo Express pour tester [`@zygrec/moncash`](https://www.npmjs.com/package/@zygrec/moncash) en **sandbox**.

## Prérequis

- Node.js 12+
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

1. Entre un montant HTG
2. Clique le bouton **Pay with MonCash**
3. Confirme sur la page sandbox (509 + PIN)
4. Vérifie le paiement avec **Capturer**

## Scripts CLI

```bash
npm run pay -- ORDER-123 100
npm run capture -- ORDER-123
```

## Fonctions testées

| SDK | Demo |
|-----|------|
| `payment.create()` | `POST /pay` |
| `payment.redirectUri()` | Redirection auto |
| `Moncash.getButtonPath()` | Bouton officiel PNG |
| `capture.getByOrderId()` | `GET /capture` |

## Sécurité

- Ne commite jamais `.env`
- Mode `sandbox` uniquement pour les tests
