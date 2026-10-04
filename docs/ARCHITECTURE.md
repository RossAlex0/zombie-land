# Arborescence du code — ZombieLand

```
src/
├── app/
│   ├── (pages)/        Pages publiques et espace client
│   ├── admin/          Back-office, protégé par le proxy
│   ├── auth/           Connexion, inscription, réinitialisation
│   └── api/            Routes API, sans logique
│
├── components/
│   ├── ui/             Briques de base, préfixées zbl, sans métier
│   ├── block/          Assemblages réutilisables
│   └── layout/         Compositions de page
│
├── server/
│   ├── schemas/        Validation Zod des entrées
│   ├── controllers/    Enchaînement des opérations et réponse HTTP
│   └── services/       AbstractModel et les modèles typés par table
│
└── utils/
    ├── api/            Helpers, middlewares, client Prisma
    ├── context/        Providers React (auth, booking)
    ├── errors/         Hiérarchie HttpError
    ├── hooks/          Hooks personnalisés
    ├── lib/            Intégrations externes (Cloudinary, Google)
    ├── shared/         Fonctions pures partagées front et back
    ├── stripe/         Intégration du paiement
    ├── styles/         Variables SCSS et feuilles globales
    └── types/          Types partagés
```

À la racine du projet, `prisma/` porte le schéma et les migrations, `public/` les fichiers
statiques, et `docs/` la documentation de conception et de déploiement.
