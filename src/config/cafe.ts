/**
 * ============================================================================
 *  CONFIGURATION DU CAFÉ — le seul fichier à modifier pour les coordonnées
 * ============================================================================
 *
 *  Tout ce qui figure ci-dessous est repris automatiquement dans le site :
 *  en-tête, pied de page, section « Nous trouver », liens WhatsApp, SEO.
 *
 *  Les valeurs marquées `À_COMPLÉTER` sont des espaces réservés : elles
 *  s'affichent sur le site sous la forme « À compléter » et les liens
 *  correspondants sont automatiquement désactivés tant qu'elles ne sont
 *  pas renseignées. Aucune information n'a été inventée.
 */

/** Marqueur d'information manquante. Ne pas modifier cette constante. */
export const TODO = '__A_COMPLETER__';

/** Une valeur est-elle encore un espace réservé ? */
export const isTodo = (value: string | undefined | null): boolean => !value || value === TODO;

/**
 * ---------------------------------------------------------------------------
 *  NUMÉRO WHATSAPP QUI REÇOIT LES COMMANDES
 * ---------------------------------------------------------------------------
 *  Format international, chiffres uniquement, sans « + », sans espaces.
 *  Tunisie = indicatif 216.
 *
 *  Exemple pour le numéro +216 22 123 456  ->  '21622123456'
 *
 *  ⚠️ Tant que cette valeur reste `TODO`, le bouton « Envoyer sur WhatsApp »
 *     affiche un message d'avertissement au lieu d'ouvrir WhatsApp.
 */
export const WHATSAPP_NUMBER = TODO;

export const cafeConfig = {
  /* --- Identité --- */
  name: 'Caffè Del Mattino',
  tagline: 'Votre pause café, votre petit déjeuner, votre moment.',
  shortDescription:
    'Café, petit déjeuner, jus frais, pâtisseries et chicha dans une ambiance conviviale.',

  /* --- Contact --- */
  /** Téléphone affiché à l'écran (format libre, ex. '+216 22 123 456'). */
  phone: TODO,
  /** Numéro WhatsApp — voir WHATSAPP_NUMBER ci-dessus. */
  whatsapp: WHATSAPP_NUMBER,
  email: TODO,

  /* --- Adresse --- */
  address: {
    /** Ex. '12 avenue Habib Bourguiba' */
    street: TODO,
    /** Ex. 'La Marsa' */
    city: TODO,
    /** Ex. '2078' */
    postalCode: TODO,
    country: 'Tunisie',
  },

  /* --- Horaires ---
   * Renseigner une chaîne libre par jour, ex. '07:00 – 22:00'.
   * Mettre 'Fermé' pour un jour de fermeture.
   */
  hours: [
    { day: 'Lundi', value: TODO },
    { day: 'Mardi', value: TODO },
    { day: 'Mercredi', value: TODO },
    { day: 'Jeudi', value: TODO },
    { day: 'Vendredi', value: TODO },
    { day: 'Samedi', value: TODO },
    { day: 'Dimanche', value: TODO },
  ],

  /* --- Réseaux sociaux (URL complètes) --- */
  social: {
    instagram: TODO, // ex. 'https://instagram.com/caffedelmattino'
    facebook: TODO, // ex. 'https://facebook.com/caffedelmattino'
    tiktok: TODO,
  },

  /* --- Localisation ---
   * mapsUrl      : lien « Partager » de Google Maps (ouvre l'itinéraire).
   * mapsEmbedUrl : lien « Intégrer une carte » de Google Maps (iframe).
   *                Google Maps > Partager > Intégrer une carte > copier le
   *                contenu de l'attribut src="..." uniquement.
   */
  mapsUrl: TODO,
  mapsEmbedUrl: TODO,

  /* --- Options de commande proposées dans le formulaire --- */
  orderTypes: {
    dineIn: true, // Sur place (avec numéro de table)
    takeaway: true, // À emporter
  },

  /* --- Devise --- */
  currency: {
    code: 'TND',
    label: 'DT',
    /** Nombre de décimales affichées (millimes = 3 en Tunisie, 2 suffit ici). */
    decimals: 2,
  },

  /* --- SEO --- */
  seo: {
    title: 'Caffè Del Mattino — Café & Petit Déjeuner',
    description:
      'Découvrez Caffè Del Mattino : café, petit déjeuner, jus frais, pâtisseries et chicha. Consultez notre menu et passez votre commande.',
    /** URL publique du site une fois déployé, ex. 'https://caffe-del-mattino.vercel.app' */
    siteUrl: TODO,
  },
} as const;

export type CafeConfig = typeof cafeConfig;

/** Adresse formatée sur une ligne, ou `null` si elle n'est pas renseignée. */
export function formatAddress(): string | null {
  const { street, city, postalCode, country } = cafeConfig.address;
  const parts = [street, [postalCode, city].filter((p) => !isTodo(p)).join(' '), country].filter(
    (p) => p && !isTodo(p),
  );
  return parts.length > 1 ? parts.join(', ') : null;
}
