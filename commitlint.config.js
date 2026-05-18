// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Longueur max de la ligne d'en-tête (type + scope + sujet)
    'header-max-length': [2, 'always', 120],

    // Types autorisés
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nouvelle fonctionnalité
        'fix', // Correction de bug
        'docs', // Documentation uniquement
        'style', // Formatage, point-virgule, etc. (pas de logique)
        'refactor', // Refactorisation sans changement de comportement
        'perf', // Amélioration de performance
        'test', // Ajout/modification de tests
        'chore', // Tâches d'outillage, config, dépendances
        'ci', // Changements CI/CD
        'build', // Changements du système de build
        'revert', // Annulation d'un commit précédent
      ],
    ],

    // Le type doit être en minuscules
    'type-case': [2, 'always', 'lower-case'],

    // Le type est obligatoire
    'type-empty': [2, 'never'],

    // Le sujet (description) est obligatoire
    'subject-empty': [2, 'never'],

    // Pas de point à la fin du sujet
    'subject-full-stop': [2, 'never', '.'],

    // Le sujet en minuscule (pas de majuscule au début)
    'subject-case': [2, 'always', 'lower-case'],
  },
};

// git commit -m "..." --no-verify
