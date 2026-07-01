# Supabase — Base de données

Cette page explique **ce qui a été mis en place sur Supabase** pour le projet, et **comment
un autre développeur peut le reproduire** (nouveau projet) ou **se connecter au projet
existant**.

> Voir aussi la vue d'ensemble : [`../DEPLOYMENT.md`](../DEPLOYMENT.md).

---

## 1. Ce qui a été fait

- Création d'un projet **PostgreSQL managé** sur Supabase (plan gratuit).
- **Data API désactivée** : l'application n'utilise pas l'API REST/GraphQL publique de
  Supabase, uniquement la connexion PostgreSQL directe via **Prisma** (`@prisma/adapter-pg`).
- Application du **schéma** (`prisma migrate deploy`) et du **jeu de données initial**
  (`prisma/seed.ts`) depuis un poste local.
- Deux connexions utilisées selon le contexte : **5432** (migrations) et **6543** (application).

De Supabase, **seul le moteur PostgreSQL est utilisé**. Auth, Storage et Realtime ne sont
pas employés (auth JWT/argon2 et upload Cloudinary gérés par l'application).

---

## 2. Reproduire : créer un nouveau projet Supabase

1. Compte sur [supabase.com](https://supabase.com) (connexion via GitHub possible).
2. **New project** :
   - **Name** : `zombieland`
   - **Database Password** : choisir un mot de passe **sans caractères spéciaux**
     (`@ : / ? # %` obligeraient à les encoder dans l'URL). **Le conserver** : il n'est
     pas récupérable ensuite (seul un *reset* est possible).
   - **Region** : la plus proche (ex. `West EU (eu-west-1)`).
   - **Plan** : Free.
3. À la création, **désactiver `Enable Data API`** (non utilisée). Cela n'empêche ni la
   connexion PostgreSQL, ni le SQL/Table Editor du dashboard.
4. Attendre ~2 min le provisionnement.

> Mot de passe oublié : **Project Settings → Database → Reset database password**.

---

## 3. Récupérer les chaînes de connexion

Bouton **Connect** (en haut du dashboard). Deux connexions sont utilisées :

| Usage | Type | Port | Notes |
|---|---|---|---|
| Migrations & seed (local) | Session pooler | `5432` | Mode session, requis par les migrations Prisma. |
| Application (Vercel, serverless) | Transaction pooler | `6543` | Mode transaction, adapté au serverless. |

Format (session pooler) :

```
postgresql://postgres.<ref>:<MDP>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

> ⚠️ Ne pas utiliser la **Direct connection** (`db.<ref>.supabase.co`) : elle est en IPv6 et
> échoue souvent selon le réseau. Toujours passer par le **pooler** (`...pooler.supabase.com`).

---

## 4. Initialiser la base (migrations + seed)

Dans `.env`, renseigner la connexion **session (5432)** :

```bash
DATABASE_URL="postgresql://postgres.<ref>:<MDP>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require"
```

> ⚠️ Une seule ligne `DATABASE_URL=` doit exister dans `.env` (`dotenv` retient la première).

### 4.1 Schéma

```bash
npm install
npx prisma migrate deploy
```

Le moteur Prisma accepte `sslmode=require` sans réglage supplémentaire.

### 4.2 Données initiales

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx prisma/seed.ts
```

Le seed crée les données **indispensables** (rôles, catégories de tickets, configuration)
et un jeu de démonstration (activités, utilisateurs, réservations).
Compte admin : `admin@zombieland.fr`.

> Le seed n'est lancé **qu'une fois** sur une base vierge (insertions non idempotentes →
> doublons si relancé).

### 4.3 Pourquoi `NODE_TLS_REJECT_UNAUTHORIZED=0` ?

Le seed (et l'application) utilisent le driver `pg`. Ses versions récentes traitent
`sslmode=require` comme une vérification TLS **stricte** que le certificat Supabase ne
satisfait pas par défaut → erreur `self-signed certificate in certificate chain`.

Ce flag relâche la validation **pour cette opération locale et ponctuelle**. La connexion
**reste chiffrée (TLS)** ; seule l'authentification du certificat est désactivée. Pour une
vérification complète, fournir le certificat racine Supabase via `NODE_EXTRA_CA_CERTS`
(voir §6).

---

## 5. Se connecter au projet existant (autre dev)

Deux cas :

- **Base partagée** (même projet Supabase) : récupérer les identifiants auprès de l'équipe
  et renseigner `DATABASE_URL` (5432 pour migrer, 6543 pour l'app). Le schéma et les
  données sont déjà en place → **ne pas relancer le seed**.
- **Base personnelle** (nouveau projet) : suivre les §2 → §4.

Vérification rapide de la connexion et du contenu :

```bash
npx prisma studio        # explore la base via une UI locale
```

Ou dans Supabase → **Table Editor** (rafraîchir la page si les tables semblent vides ;
vérifier que le schéma affiché est bien `public`).

---

## 6. Option sécurisée (vérification complète du certificat)

Pour éviter `NODE_TLS_REJECT_UNAUTHORIZED=0` et vérifier réellement l'identité du serveur :

1. **Project Settings → Database → SSL Configuration → Download certificate**
   (fichier `prod-ca-*.crt`, public, commitable dans `certs/`).
2. Lancer les commandes avec le certificat comme autorité de confiance :

```bash
NODE_EXTRA_CA_CERTS=./certs/supabase-ca.crt npx prisma migrate deploy
NODE_EXTRA_CA_CERTS=./certs/supabase-ca.crt npx tsx prisma/seed.ts
```

La connexion est alors **chiffrée et vérifiée**, sans désactiver aucune validation.

---

## 7. Points de vigilance

- **Ports** : `5432` pour migrer, `6543` pour l'app. Ne pas migrer sur le `6543` (mode transaction incompatible avec les migrations).
- **Mot de passe** : sans caractères spéciaux, sinon l'encoder dans l'URL.
- **Une seule `DATABASE_URL`** dans `.env`.
- **Plan gratuit** : le projet se met en pause après une période d'inactivité → le réactiver depuis le dashboard.
- **Seed** : une seule exécution sur base vierge.
