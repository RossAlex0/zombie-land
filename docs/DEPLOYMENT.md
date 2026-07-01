# Documentation de déploiement — Zombie Land

Cette documentation décrit la mise en production de l'application : hébergement de la
base de données sur **Supabase** et déploiement de l'application **Next.js sur Vercel**.
Elle présente l'architecture retenue, les **choix techniques** et leur justification, puis
la procédure complète.

---

## 1. Objectif et contexte

L'application est une plateforme de réservation pour un parc d'attractions. La mise en
production devait répondre à trois contraintes :

- **Coût nul** (projet étudiant) → solutions gratuites.
- **Simplicité d'exploitation** → services managés, pas de serveur à administrer.
- **Continuité avec la stack existante** → PostgreSQL + Prisma, sans réécriture.

Deux services managés ont été retenus : **Supabase** pour la base de données et **Vercel**
pour l'application.

---

## 2. Architecture de déploiement

```
   Navigateur
       │  HTTPS
       ▼
┌──────────────────────┐         ┌─────────────────────────────┐
│   Vercel             │  SQL/TLS │   Supabase                  │
│   (Next.js, API      │─────────▶│   PostgreSQL managé         │
│    routes serverless)│  pooler  │   (pooler Supavisor)        │
└──────────────────────┘  :6543   └─────────────────────────────┘
       │
       │  API externes (HTTPS)
       ├────────────▶  Stripe      (paiement)
       └────────────▶  Cloudinary  (médias)
```

- L'application (front + API routes) est hébergée et exécutée sur **Vercel** en
  environnement **serverless**.
- La persistance est assurée par un **PostgreSQL managé Supabase**, atteint via **Prisma**
  et son adaptateur `@prisma/adapter-pg`.
- Les paiements (Stripe) et les médias (Cloudinary) restent délégués à leurs services
  respectifs.

> À noter : de Supabase, seul le **moteur PostgreSQL** est utilisé. Les modules Auth,
> Storage, Realtime et Data API ne sont **pas** employés — l'authentification (JWT + argon2)
> et l'upload (Cloudinary) sont déjà gérés par l'application.

---

## 3. Choix techniques et justifications

| Décision | Justification |
|---|---|
| **Supabase** pour la base | PostgreSQL managé gratuit, compatible directement avec la stack Prisma existante (aucune migration de code). |
| **Vercel** pour l'app | Hébergement Next.js natif, gratuit, déploiement continu à chaque push, `prisma generate` exécuté automatiquement au build. |
| **Connexion via le pooler** (et non la connexion directe) | En serverless, chaque invocation ouvre une connexion ; le pooler évite la saturation. Le pooler est aussi compatible IPv4 (la connexion directe Supabase est en IPv6). |
| **Deux connexions distinctes** (5432 / 6543) | Le **6543** (mode transaction) est adapté au serverless de l'app ; le **5432** (mode session) est requis pour les migrations Prisma, incompatibles avec le mode transaction. |
| **Stripe en mode test** | Aucun paiement réel n'est encaissé dans le cadre du projet ; les clés de test permettent une démonstration complète du parcours de paiement. |

---

## 4. Base de données — Supabase

### 4.1 Création du projet

1. Créer un compte sur [supabase.com](https://supabase.com).
2. **New project** :
   - **Name** : `zombieland`
   - **Database Password** : mot de passe **sans caractères spéciaux** (évite l'encodage dans l'URL). À conserver : il n'est pas récupérable ensuite.
   - **Region** : la plus proche (ex. `West EU (eu-west-1)`).
   - **Plan** : Free.
3. L'option **Data API** peut être désactivée : l'application n'utilise pas l'API REST/GraphQL publique de Supabase, uniquement la connexion PostgreSQL directe.

### 4.2 Connexions disponibles

Le bouton **Connect** du dashboard fournit les chaînes de connexion. Deux sont utilisées :

| Usage | Type | Port |
|---|---|---|
| Migrations & seed (poste local) | Session pooler | `5432` |
| Application en production (Vercel) | Transaction pooler | `6543` |

---

## 5. Initialisation de la base (poste local)

Les migrations et le jeu de données initial sont appliqués **depuis le poste de
développement**, via la connexion session (5432) :

```bash
DATABASE_URL="postgresql://postgres.<ref>:<MDP>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"
```

### 5.1 Schéma

```bash
npm install
npx prisma migrate deploy
```

Les migrations sont appliquées par le **moteur Prisma**.

### 5.2 Données initiales

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx prisma/seed.ts
```

Le seed crée les données **indispensables** au fonctionnement (rôles, catégories de
tickets, configuration) ainsi qu'un jeu de démonstration (activités, utilisateurs,
réservations). Compte administrateur généré : `admin@zombieland.fr`.

> **Note technique — TLS.** Le seed et l'application utilisent le driver `pg`, dont les
> versions récentes appliquent une vérification stricte du certificat que le certificat
> Supabase ne satisfait pas par défaut. Pour cette opération locale et ponctuelle, la
> vérification est relâchée via `NODE_TLS_REJECT_UNAUTHORIZED=0` — **la connexion reste
> chiffrée (TLS)**, seule la validation de l'autorité de certification est désactivée.
> Une vérification complète est possible en fournissant le certificat racine de Supabase
> via `NODE_EXTRA_CA_CERTS`.

> Le seed n'est exécuté **qu'une fois** sur une base vierge (insertions non idempotentes).

---

## 6. Déploiement de l'application — Vercel

1. Importer le dépôt GitHub dans Vercel (**Add New → Project**). Le framework Next.js est
   détecté automatiquement, et **`prisma generate` est exécuté automatiquement au build**.
2. Renseigner les **variables d'environnement** (§7).
3. Lancer le déploiement, puis renseigner `FRONT_URL` avec l'URL Vercel obtenue et
   redéployer.

Pour l'application (serverless), la connexion utilise le **pooler transaction (6543)** :

```
postgresql://postgres.<ref>:<MDP>@aws-0-<region>.pooler.supabase.com:6543/postgres?sslmode=no-verify&pgbouncer=true
```

- `6543` : pooler transaction, adapté au serverless.
- `sslmode=no-verify` : connexion chiffrée sans vérification stricte du certificat (contourne la limite du driver `pg`).
- `pgbouncer=true` : compatibilité mode transaction.

---

## 7. Paiement — Stripe (mode test)

En production, le webhook Stripe remplace l'outil de développement `stripe listen` :

1. Dashboard Stripe (mode **Test**) → **Developers → Webhooks → Add endpoint**.
2. URL : `https://<projet>.vercel.app/api/webhook/stripe`
3. Événement : `checkout.session.completed`.
4. Renseigner le *signing secret* (`whsec_...`) obtenu dans la variable
   `STRIPE_WEBHOOK_SECRET`, puis redéployer.

Le webhook est le mécanisme qui fait passer une réservation de `pending` à `confirmed`
après paiement.

---

## 8. Variables d'environnement (Vercel)

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Connexion PostgreSQL (pooler transaction 6543) |
| `JWT_SECRET` | Signature des jetons d'authentification |
| `FRONT_URL` | URL publique de l'application (redirections Stripe) |
| `STRIPE_SECRET_KEY` | Clé serveur Stripe (test) |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Clé publique Stripe (test) |
| `STRIPE_WEBHOOK_SECRET` | Vérification de la signature du webhook |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Accès Cloudinary |

