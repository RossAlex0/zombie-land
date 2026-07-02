import { OAuth2Client } from 'google-auth-library';

/**
 * Construit un client OAuth Google à partir des variables d'environnement.
 * Sert à générer l'URL de consentement, échanger le code d'autorisation
 * et vérifier cryptographiquement le id_token (signature + audience).
 */
export const buildGoogleClient = () =>
  new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  });
