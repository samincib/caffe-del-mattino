import type { CartLine, Product } from '../types';
import { products } from '../data/menu';
import { round } from './format';

const STORAGE_KEY = 'cdm-panier-v1';

/** Forme minimale stockée dans le navigateur : on ne persiste pas les prix. */
interface StoredLine {
  id: string;
  quantity: number;
}

/**
 * Relit le panier depuis `localStorage`.
 *
 * Seuls l'identifiant et la quantité sont stockés : le prix et le nom sont
 * toujours relus depuis `data/menu.ts`. Ainsi un changement de tarif
 * s'applique immédiatement, même pour un client dont le panier date d'hier.
 * Les produits qui n'existent plus au menu sont silencieusement écartés.
 */
export function loadCart(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((entry): CartLine | null => {
        const line = entry as Partial<StoredLine>;
        const product = products.find((p) => p.id === line.id);
        const quantity = Number(line.quantity);
        if (!product || !Number.isFinite(quantity) || quantity < 1) return null;
        return { product, quantity: Math.min(Math.floor(quantity), 99) };
      })
      .filter((line): line is CartLine => line !== null);
  } catch {
    // localStorage indisponible (navigation privée, quota, JSON corrompu…) :
    // on repart simplement d'un panier vide.
    return [];
  }
}

/** Enregistre le panier. Échoue silencieusement si le stockage est bloqué. */
export function saveCart(lines: CartLine[]): void {
  if (typeof window === 'undefined') return;
  try {
    const stored: StoredLine[] = lines.map((l) => ({ id: l.product.id, quantity: l.quantity }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* rien à faire : le panier reste valable pour la session en cours */
  }
}

export function cartTotal(lines: CartLine[]): number {
  return round(lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0));
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function lineSubtotal(line: CartLine): number {
  return round(line.product.price * line.quantity);
}

/** Ajoute un produit (ou incrémente la ligne existante). */
export function addLine(lines: CartLine[], product: Product, quantity = 1): CartLine[] {
  const existing = lines.find((l) => l.product.id === product.id);
  if (existing) {
    return lines.map((l) =>
      l.product.id === product.id ? { ...l, quantity: Math.min(l.quantity + quantity, 99) } : l,
    );
  }
  return [...lines, { product, quantity }];
}

/** Change la quantité d'une ligne ; une quantité <= 0 la supprime. */
export function setLineQuantity(lines: CartLine[], productId: string, quantity: number): CartLine[] {
  if (quantity <= 0) return lines.filter((l) => l.product.id !== productId);
  return lines.map((l) =>
    l.product.id === productId ? { ...l, quantity: Math.min(quantity, 99) } : l,
  );
}

export function removeLine(lines: CartLine[], productId: string): CartLine[] {
  return lines.filter((l) => l.product.id !== productId);
}
