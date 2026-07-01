# Vercel — Hébergement de l'application

Cette page explique **ce qui a été mis en place sur Vercel** pour héberger l'application
Next.js, et **comment un autre développeur peut déployer sa propre instance**.

> Voir aussi la vue d'ensemble : [`../DEPLOYMENT.md`](../DEPLOYMENT.md)
> et la base de données : [`../supabase/SUPABASE.md`](../supabase/SUPABASE.md).

---

## 1. Ce qui a été fait

- Import du dépôt GitHub dans Vercel : l'application Next.js (front + API routes) est
  exécutée en **serverless**.
- Configuration des **variables d'environnement** (base Supabase, Stripe, Cloudinary, JWT).
- **Déploiement continu** : chaque `git push` sur la branche connectée déclenche un
  nouveau déploiement.
- `prisma generate` est **exécuté automatiquement** par Vercel au build (détection de
  Prisma) → aucune modification du script `build` n'a été nécessaire.

---

## 2. Prérequis : accès au dépôt

L'application est déployée depuis un dépôt GitHub. Si le dépôt appartient à une
**organisation** (ex. l'école) et que le développeur n'en est pas administrateur, deux
options :

- **Fork / dépôt personnel** (le plus simple) : créer un dépôt vide sur son compte, l'ajouter
  comme remote et pousser, puis importer **ce** dépôt dans Vercel.
  ```bash
  git remote add perso git@github.com:<user>/projet-zombie-land.git
  git push perso main
  ```
- **Autorisation de l'organisation** : un *owner* installe la GitHub App Vercel sur l'org
  (ou sur le dépôt ciblé).

Un dépôt **privé** ne pose aucun problème à Vercel (plan gratuit inclus) ; c'est
uniquement l'accès à l'organisation qui peut nécessiter une autorisation.

---

## 3. Déployer

1. [vercel.com](https://vercel.com) → **Add New → Project** → importer le dépôt.
   Next.js est détecté automatiquement (aucune config de build à ajouter).
2. Ouvrir **Environment Variables** et renseigner toutes les variables (§4).
3. **Deploy**.
4. Récupérer l'URL générée (`https://<projet>.vercel.app`), la reporter dans `FRONT_URL`,
   puis **redéployer** (nécessaire pour les redirections Stripe).

---

## 4. Variables d'environnement

À renseigner dans **Settings → Environment Variables** :

| Variable | Valeur / source |
|---|---|
| `DATABASE_URL` | Connexion Supabase **pooler transaction (6543)** — voir §5 |
| `JWT_SECRET` | Secret de signature des jetons (≥ 32 caractères) |
| `FRONT_URL` | `https://<projet>.vercel.app` (après le 1er déploiement) |
| `STRIPE_SECRET_KEY` | Clé serveur Stripe (`sk_test_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Clé publique Stripe (`pk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` du webhook prod (voir §6) |
| `CLOUDINARY_CLOUD_NAME` | Compte Cloudinary |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary |

> Les migrations se lançant depuis le poste local, `DIRECT_URL` **n'est pas nécessaire**
> sur Vercel.

---

## 5. `DATABASE_URL` sur Vercel (serverless)

En serverless, l'application utilise le **pooler transaction (6543)** :

```
postgresql://postgres.<ref>:<MDP>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=no-verify&pgbouncer=true
```

- `6543` : pooler transaction, adapté à la multiplication des connexions serverless.
- `sslmode=no-verify` : connexion chiffrée sans vérification stricte du certificat
  (le driver `pg` échoue sinon sur le certificat Supabase).
- `pgbouncer=true` : compatibilité avec le mode transaction.

> Différence avec le local : les migrations utilisent le **5432** (session), l'app utilise
> le **6543** (transaction).

---

## 6. Webhook Stripe (après déploiement)

En production, le webhook remplace l'outil de dev `stripe listen`. En **mode Test** :

1. Dashboard Stripe → **Developers → Webhooks → Add endpoint**.
2. URL : `https://<projet>.vercel.app/api/webhook/stripe`
3. Événement : `checkout.session.completed`.
4. Copier le *signing secret* (`whsec_...`) → le mettre dans `STRIPE_WEBHOOK_SECRET` sur
   Vercel → **redéployer**.

Ce webhook fait passer une réservation de `pending` à `confirmed` après paiement. Sans lui,
le paiement réussit mais la réservation reste en attente.

---

## 7. Cycle de vie & vérifications

- **Déploiement continu** : chaque push sur la branche connectée redéploie automatiquement.
- **Variables d'environnement** : appliquées **au build suivant** uniquement → redéployer
  après toute modification.
- **Vérifier après déploiement** : la page d'accueil et `/activity` affichent-elles bien les
  données (elles proviennent de Supabase) ? La connexion admin fonctionne-t-elle
  (`admin@zombieland.fr`) ? Si une page reste vide ou renvoie une erreur de certificat,
  contrôler le `DATABASE_URL` (§5).
- **Logs** : onglet **Deployments → (un déploiement) → Functions / Logs** pour diagnostiquer
  les erreurs runtime.

---

## 8. Points de vigilance

- `prisma generate` est automatique sur Vercel → ne pas s'inquiéter de l'absence de client Prisma généré dans le dépôt.
- Ne pas committer de secrets : les valeurs vivent dans les **Environment Variables** de Vercel (et le `.env` local, ignoré par git).
- Après changement d'une variable, **redéployer**.
- Le mode Test de Stripe suffit pour la démonstration (aucun paiement réel).
