# 21/04/2026

Lien vers les documents attendus : https://github.com/O-clock-Selkie/Projects-CDA/blob/main/.github/ISSUE_TEMPLATE/sp0-suivi-conception.md

Lien vers doc : https://docs.google.com/document/d/161kwln_3OMJMO9nypuGLovIfKgTjjiVDjY26nzi9Q1U/edit?tab=t.0

## Roles 
- Répartition des rôles :
  - Product Owner : Ludivine
  - Scrum master : Hervé
  - Lead Front : Alex
  - Lead Back : Ariel

## Technologies :
- **Front** : 
  - **React** : grande communauté , écosystème mature, réutilisabilité de composants, 
  - **NextJs** : routing intégré, SSR, SSG, SEO, optimisation image & font
  - **CSS** : à valider, SCSS ou SASS // Tailwind
  - **Typescript** : Autocomplétion, documentation implicite du code, typage statique, intégration native avec ' Prisma '
  - **SPA** : Expérience fluide, meilleure réactivité
  - **NodeJs** : cohérence stack front/back, écosystème npm, grande communauté, non bloquant
- **Back** : 
  - **API REST** : simplicité, cacheable
  - **Express** : minimaliste, flexible, middleware pipeline, écosystème Node riche
  - **Typescript** : Autocomplétion, documentation implicite du code, typage statique, intégration native avec ' Prisma '
  - **NodeJS** : cohérence stack front/back, écosystème npm, grande communauté, non bloquant
- **BDD** : 
  - **Prisma ORM** : typage fort, moderne, migrations versionnées, schema unique, types auto-générés
  - **Postgres** : données relationnelles, contraintes d'intégrités, transactions ACID
- **DevOps** :
  - **ESLint** : code harmonisé, détection des erreurs(promesses non gérées, variables inutilisées)
  - **Husky** : normalisation des commits, garantit que personne ne push de code cassé
  - **GitHub** Actions : automatise les tests et job configurable avant un merge,  CI/CD

## Arborescence : 
https://excalidraw.com/#room=e1b0c1ea6139535e5241,xw2OuwThgT_W-gXIn_3Czw


### Dictionnaire de routes : dossier conception
### User Stories : dossier conception

## Programme aujourd'hui :
- Schématisation de la BDD (Merise par ex)


# 22/04/2026

- Veille : Continuation de la conception : MCD MLD MPD
- Diagrammes de sequence + usecase


To do today :
- 13h30 Point avec PY de validation
- Wireframes + maquettes et DA

# 18/05/2026

- Validation des élément graphiques (+ 1 modif sur les user case)
- Initialisation du projet (base de l'architecture front & back avec next)
  - Configuration : Prettier ESlint & Husky + CommitLint, début de pipeline Github actions, 
- Création de la DB dockerisée avec Prisma

# 19/05/2026

- To do : Connexion & Inscription


# 20/05/2026

Alex : 
- Déconnexion :
  - Front : hook créé
  - Back : code créé


Ariel : 
- Front : à continuer
- Back : Route crée + route pour savoir qui est connecté


Hervé :
- Inscription :
- Front : formulaire créé, appel à tester et potentiellement fix
- back : Globalement OK, quelques fixes à faire (déplacer du code dans le controller)


Ludivine : 
- Back : Ajouter une activité + les récupérer donce + en récupérer une seule
- Front :  à continuer

Todo  :
- Faire une route front + back à c faire en commun 
- Terminer les tâches commencées


# 21/05/2026

- Refactorisation du code en commun : 
  - Middleware errorHandler (décorateur) + Accesstoken
- Merge côté back des différentes fonctions créées

- To do : 
  - Inscription et connexion côté front & back
- Elements graphiques (header / footer)...

# 22/05/2026

- Finition parcours inscription / connexion
- Layout front
- Accueil back office

  - To do : Merge + code revieww (objectif : parcours d'inscription connexion complet)
  - Passage présentation : Alex (13h30)

# 08/06/2026

- Merge des formulaires d'inscription et de connexion (+ JWT rempli après inscirption)
- Composant tableau des activités (PR à voir)

- To do : 
  - Merge des PR en cours
  - Git Project màj avec reste du mvp + répartition par tâches (front : Alex / Ludivine, back : Ariel, Hervé)

# 09/06/2026

- Pages not found, error, loading crées
- Merge : Footer, réservation (home),


# 10/06/2026

- Categories merged (update and delete + hooks)
- Back office : catégories (sanitization)
- Back office : user profile (hors booking)
- Ajout d'un context d'Auth (données du user loggé disponible sur tout le front)
- Refactor du sign-up (corrections scss, meilleures erreurs...)
- Activity front
  
# 11/06/2026

- Refactor fomulaires back office (utiliser les form inputs)
- Pages infos pratiques / légales confidentialité
- Back : profil utilisateur (hors booking, en réflexion)
- Profil front

- Payment Stripe : Début d'intégration (manque la gestion des Lines items de réservation, migration pour le stripe customer id en bdd)
