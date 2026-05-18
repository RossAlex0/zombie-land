## Analyse des risques

| Catégorie | Risque | Probabilité | Impact | Mesures de prévention |
|-----------|--------|-------------|--------|----------------------|
| **Projet** | Dérive du scope : trop de features MVP vs V1/V2/V3 traitées en parallèle | Élevée | Élevé | Respect strict du découpage par versions, validation PO à chaque sprint, gel du MVP avant d'attaquer V1 |
| **Projet** | Retard sur le planning (user stories sous-estimées) | Élevée | Moyen | Estimation en poker planning, sprints courts, points d'avancement hebdomadaires |
| **Projet** | Priorisation floue du backlog entre MVP et versions ultérieures | Moyenne | Élevé | Product Owner garant du backlog, refinement régulier, MoSCoW sur les US |
| **Technique** | Montée en compétence sur Next.js (App Router, Server Components) | Moyenne | Moyen | Formation en amont, pair programming, POC avant d'attaquer les US complexes |
| **Technique** | Couplage fort front/back via monolithe Next.js (difficulté si app mobile future) | Faible | Faible | API Routes bien structurées et documentées, séparation logique métier / UI |
| **Technique** | Gestion de la concurrence sur les réservations (survente à une date) | Moyenne | Élevé | Transactions Prisma, row-locking Postgres, contrainte unique sur les slots |
| **Technique** | Bugs sur l'intégration Stripe (paiement V1) | Moyenne | Élevé | Utilisation du mode test Stripe, webhooks testés, tests e2e sur le flux complet |
| **Technique** | Problèmes de config Docker entre les environnements des devs | Moyenne | Moyen | docker-compose versionné, README de setup clair, variables d'env templatisées (.env.example) |
| **Technique** | Désynchronisation entre schema Prisma et base de données | Faible | Moyen | Migrations systématiques, revue des `prisma migrate` en PR, seed reproductible |
| **Sécurité** | Failles sur l'authentification et la gestion des rôles (visitor / customer / admin) | Moyenne | Élevé | Middleware de vérification de rôle, tests sur les routes protégées, revue de code systématique |
| **Sécurité** | Non-conformité RGPD (données personnelles, mineurs de 16 ans) | Moyenne | Élevé | Politique de confidentialité claire, consentement explicite, chiffrement des mots de passe (bcrypt/argon2) |
| **Sécurité** | Fuite de secrets (clés API, credentials BDD) dans le repo Git | Moyenne | Critique | .env jamais commit, .gitignore strict, secrets dans GitHub Secrets, revue PR |
| **Sécurité** | Injection SQL, XSS ou CSRF sur les formulaires publics | Faible | Élevé | Utilisation de Prisma (requêtes paramétrées), validation des inputs (Zod), protection CSRF Next |
| **Équipe** | Indisponibilité d'un lead (Front ou Back) sur une période critique | Moyenne | Élevé | Documentation à jour, pas de silos de connaissance, pair programming |
| **Équipe** | Mauvaise communication entre Lead Front et Lead Back sur les contrats d'API | Moyenne | Moyen | Types TypeScript partagés, documentation API, daily meetings |
| **Équipe** | Non-respect des conventions de code (styles différents selon les devs) | Élevée | Faible | ESLint + Husky bloquants, Prettier, revue de PR systématique |
| **Fonctionnel** | Parcours de réservation mal compris par les visiteurs | Moyenne | Élevé | Maquettes Figma validées en amont, tests utilisateurs, itérations |
| **Fonctionnel** | Back-office trop complexe pour le gérant (non technique) | Moyenne | Moyen | Interface simple et intuitive, formation/documentation utilisateur, retours gérant |
| **Qualité** | Bugs en production non détectés (manque de tests) | Moyenne | Élevé | Tests unitaires sur la logique métier, tests e2e sur les parcours critiques, CI/CD |
| **Qualité** | Dette technique qui s'accumule sur les versions (V1, V2, V3) | Élevée | Moyen | Refactoring régulier, sprint "dette" tous les 3-4 sprints, revue de code exigeante |
| **Infra** | Performance dégradée sur les pages publiques (SEO impacté) | Faible | Moyen | SSR/SSG Next.js, optimisation images, monitoring Lighthouse |
| **Infra** | Perte de données en cas de panne (réservations, paiements) | Faible | Critique | Backups automatiques Postgres, réplication si possible, plan de restauration testé |
| **Légal** | Absence ou non-conformité des mentions légales et CGV | Faible | Élevé | Revue des mentions légales, modèles validés, vérification avant mise en prod |
| **Externe** | Indisponibilité d'un service tiers (Stripe, hébergeur) | Faible | Élevé | Pages de statut, fallback gracieux, messages d'erreur clairs pour l'utilisateur |