/** Identifiant d'une catégorie du menu. */
export type CategoryId =
  | 'petit-dejeuner'
  | 'cafe'
  | 'the'
  | 'eau'
  | 'jus'
  | 'patisserie'
  | 'chicha';

export interface Category {
  id: CategoryId;
  /** Libellé affiché dans les onglets et les titres. */
  name: string;
  /** Emoji utilisé dans les onglets et le message WhatsApp. */
  emoji: string;
  /** Phrase courte affichée sous le titre de la catégorie. */
  blurb: string;
  /**
   * Nom de base de l'image de catégorie dans `public/images/`
   * (sans le suffixe de largeur ni l'extension). `null` = pas de photo,
   * une vignette graphique est affichée à la place.
   */
  image: string | null;
}

export interface Product {
  id: string;
  name: string;
  /** Prix unitaire en dinars tunisiens. */
  price: number;
  categoryId: CategoryId;
  /** Détail de la composition, affiché sous le nom. */
  description?: string;
  /** Met en avant le produit avec un badge « Populaire ». */
  popular?: boolean;
  /**
   * `true` lorsque l'information vient d'une photo difficile à lire et
   * doit être confirmée par le café. Affiche un astérisque discret.
   */
  needsConfirmation?: boolean;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export type OrderType = 'sur-place' | 'a-emporter';

export interface OrderDetails {
  name: string;
  phone: string;
  orderType: OrderType;
  tableNumber: string;
  comment: string;
}
