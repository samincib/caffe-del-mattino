import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartLine, Product } from '../types';
import {
  addLine,
  cartCount,
  cartTotal,
  loadCart,
  removeLine,
  saveCart,
  setLineQuantity,
} from '../utils/cart';
import { useToast } from './ToastContext';

/** Étape affichée dans le panneau latéral. */
export type CartView = 'panier' | 'commande';

interface CartApi {
  lines: CartLine[];
  count: number;
  total: number;
  isOpen: boolean;
  view: CartView;
  add: (product: Product) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  open: (view?: CartView) => void;
  close: () => void;
  setView: (view: CartView) => void;
}

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Lecture synchrone du stockage : évite le clignotement « panier vide »
  // au premier rendu quand le client revient sur le site.
  const [lines, setLines] = useState<CartLine[]>(() => loadCart());
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<CartView>('panier');
  const { notify } = useToast();

  useEffect(() => {
    saveCart(lines);
  }, [lines]);

  // Le corps de page ne défile plus derrière le panneau ouvert.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const add = useCallback(
    (product: Product) => {
      setLines((current) => addLine(current, product));
      notify(`${product.name} ajouté au panier`);
    },
    [notify],
  );

  const increment = useCallback((productId: string) => {
    setLines((current) => {
      const line = current.find((l) => l.product.id === productId);
      return line ? setLineQuantity(current, productId, line.quantity + 1) : current;
    });
  }, []);

  const decrement = useCallback((productId: string) => {
    setLines((current) => {
      const line = current.find((l) => l.product.id === productId);
      // À 1, décrémenter revient à retirer la ligne.
      return line ? setLineQuantity(current, productId, line.quantity - 1) : current;
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((current) => removeLine(current, productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const open = useCallback((next: CartView = 'panier') => {
    setView(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartApi>(
    () => ({
      lines,
      count: cartCount(lines),
      total: cartTotal(lines),
      isOpen,
      view,
      add,
      increment,
      decrement,
      remove,
      clear,
      open,
      close,
      setView,
    }),
    [lines, isOpen, view, add, increment, decrement, remove, clear, open, close],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans un <CartProvider>');
  return ctx;
}
