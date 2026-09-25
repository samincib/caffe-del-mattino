/**
 * ============================================================================
 *  MENU — le seul fichier à modifier pour les produits et les prix
 * ============================================================================
 *
 *  Prix exprimés en dinars tunisiens (DT).
 *  Sur l'ardoise du café les prix sont affichés en millimes : 2000 = 2 DT.
 *
 *  Pour ajouter un produit : copiez une ligne, changez `id` (unique), `name`
 *  et `price`. Pour le retirer, supprimez la ligne. Rien d'autre à toucher.
 */
import type { Category, Product } from '../types';

export const categories: Category[] = [
  {
    id: 'petit-dejeuner',
    name: 'Petit déjeuner',
    emoji: '🍳',
    blurb: 'Des formules complètes pour bien commencer la journée.',
    image: 'cat-petit-dejeuner',
  },
  {
    id: 'cafe',
    name: 'Café',
    emoji: '☕',
    blurb: "L'essentiel de la maison, du plus serré au plus doux.",
    image: 'cat-cafe',
  },
  {
    id: 'the',
    name: 'Thé',
    emoji: '🍵',
    blurb: 'Thés parfumés, servis bien chauds.',
    image: 'cat-the',
  },
  {
    id: 'eau',
    name: 'Eau & boissons',
    emoji: '💧',
    blurb: 'De quoi accompagner votre commande.',
    image: null,
  },
  {
    id: 'jus',
    name: 'Jus',
    emoji: '🥤',
    blurb: 'Pressés et préparés à la commande.',
    image: 'cat-jus',
  },
  {
    id: 'patisserie',
    name: 'Pâtisserie',
    emoji: '🥐',
    blurb: 'Les douceurs qui accompagnent le café.',
    image: 'cat-patisserie',
  },
  {
    id: 'chicha',
    name: 'Chicha',
    emoji: '💨',
    blurb: 'À déguster tranquillement en terrasse.',
    image: null,
  },
];

export const products: Product[] = [
  /* ---------------------------- PETIT DÉJEUNER --------------------------- */
  {
    id: 'pdj-formule',
    name: 'Petit déjeuner',
    // ⚠️ À CONFIRMER : l'ardoise du café indique « 5d » pour cette formule.
    // La valeur ci-dessous (9 DT) est celle transmise par le gérant.
    // Corriger ici si le bon prix est 5.
    price: 9,
    categoryId: 'petit-dejeuner',
    description: 'Café au choix + jus citronnade + salé ou sucré + eau 0,5 L',
    popular: true,
    needsConfirmation: true,
  },
  {
    id: 'pdj-royal',
    name: 'Petit déjeuner Royal',
    price: 9,
    categoryId: 'petit-dejeuner',
    description: 'Café au choix + jus citronnade + salé ou sucré + eau 1,5 L + crêpes',
    popular: true,
  },

  /* --------------------------------- CAFÉ -------------------------------- */
  { id: 'cafe-express', name: 'Express', price: 2, categoryId: 'cafe', popular: true },
  { id: 'cafe-capucin', name: 'Capucin', price: 2.2, categoryId: 'cafe' },
  { id: 'cafe-direct', name: 'Direct', price: 2.3, categoryId: 'cafe' },
  { id: 'cafe-chocolat-lait', name: 'Chocolat au lait', price: 2, categoryId: 'cafe' },

  /* --------------------------------- THÉ --------------------------------- */
  { id: 'the-vert', name: 'Thé Vert', price: 1.5, categoryId: 'the' },
  { id: 'the-amande', name: 'Thé Amande', price: 2.7, categoryId: 'the', popular: true },
  { id: 'the-noisette', name: 'Thé Noisette', price: 2.7, categoryId: 'the' },
  { id: 'the-baklawa', name: 'Thé Baklawa', price: 5.5, categoryId: 'the' },

  /* ---------------------------- EAU & BOISSONS --------------------------- */
  { id: 'eau-50cl', name: 'Eau 0,5 L', price: 1, categoryId: 'eau' },
  { id: 'eau-1l', name: 'Eau 1 L', price: 2, categoryId: 'eau' },
  { id: 'canette', name: 'Canette', price: 2.5, categoryId: 'eau' },

  /* --------------------------------- JUS --------------------------------- */
  { id: 'jus-citronnade', name: 'Citronnade', price: 2.5, categoryId: 'jus', popular: true },
  { id: 'jus-citron-amande', name: 'Citron Amande', price: 3.5, categoryId: 'jus' },
  { id: 'jus-orange', name: 'Orange', price: 2, categoryId: 'jus' },
  { id: 'jus-fraise', name: 'Fraise', price: 4, categoryId: 'jus' },

  /* ------------------------------ PÂTISSERIE ----------------------------- */
  { id: 'pat-croissant', name: 'Croissant', price: 1.7, categoryId: 'patisserie', popular: true },
  { id: 'pat-cake', name: 'Cake', price: 2, categoryId: 'patisserie' },
  { id: 'pat-brownies', name: 'Brownies', price: 2, categoryId: 'patisserie' },
  { id: 'pat-cookies', name: 'Cookies', price: 1.5, categoryId: 'patisserie' },

  /* -------------------------------- CHICHA ------------------------------- */
  { id: 'chicha-au-choix', name: 'Chicha au choix', price: 6, categoryId: 'chicha' },
  { id: 'chicha-menthe', name: 'Chicha Menthe', price: 5, categoryId: 'chicha' },
];

/** Produits d'une catégorie, dans l'ordre de déclaration. */
export const productsByCategory = (id: Category['id']): Product[] =>
  products.filter((p) => p.categoryId === id);

/** Catégorie correspondant à un identifiant. */
export const getCategory = (id: Category['id']): Category | undefined =>
  categories.find((c) => c.id === id);
