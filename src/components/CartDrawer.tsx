import { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/format';
import { lineSubtotal } from '../utils/cart';
import { CheckoutForm } from './CheckoutForm';
import { CartIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon } from './ui/Icons';

export function CartDrawer() {
  const { lines, total, count, isOpen, view, close, setView, increment, decrement, remove, clear } =
    useCart();
  const { notify } = useToast();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  /* Accessibilité : Échap ferme, le focus entre dans le panneau puis revient
     sur l'élément qui l'a ouvert, et ne peut pas s'en échapper au clavier. */
  useEffect(() => {
    if (!isOpen) return;
    lastFocused.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      lastFocused.current?.focus();
    };
  }, [isOpen, close]);

  const empty = lines.length === 0;

  return (
    <>
      {/* Voile */}
      <div
        onClick={close}
        aria-hidden="true"
        className={[
          'fixed inset-0 z-[60] bg-forest-950/55 backdrop-blur-[2px] transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      />

      {/* Panneau : plein écran sur mobile, tiroir latéral à partir de sm */}
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        /* `inert` retire le panneau fermé de l'ordre de tabulation et de
           l'arbre d'accessibilité, tout en conservant l'animation de sortie. */
        inert={!isOpen}
        aria-label={view === 'panier' ? 'Votre panier' : 'Finaliser ma commande'}
        className={[
          'fixed inset-y-0 right-0 z-[65] flex w-full max-w-md flex-col bg-cream-50 shadow-panel transition-transform duration-300 ease-out focus:outline-none',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* En-tête */}
        <header className="flex items-center justify-between gap-3 border-b border-cream-300 bg-forest-900 px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] text-cream-50 sm:px-6">
          <div className="min-w-0">
            <h2 className="font-display text-xl leading-tight">
              {view === 'panier' ? 'Votre panier' : 'Finaliser ma commande'}
            </h2>
            <p className="mt-0.5 text-xs text-cream-200/70">
              {count === 0
                ? 'Aucun article'
                : `${count} article${count > 1 ? 's' : ''} · ${formatPrice(total)}`}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-cream-100/20 transition-colors hover:bg-forest-800"
            aria-label="Fermer le panier"
          >
            <CloseIcon className="size-5" />
          </button>
        </header>

        {/* Contenu */}
        {view === 'commande' && !empty ? (
          <CheckoutForm />
        ) : empty ? (
          <EmptyCart onClose={close} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <ul className="space-y-3">
                {lines.map((line) => (
                  <li
                    key={line.product.id}
                    className="rounded-2xl border border-cream-300 bg-white p-3.5 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-[1.05rem] leading-snug font-semibold text-forest-900">
                          {line.product.name}
                        </h3>
                        <p className="mt-0.5 text-sm text-forest-800/60">
                          {formatPrice(line.product.price)} l’unité
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          remove(line.product.id);
                          notify(`${line.product.name} retiré`);
                        }}
                        className="grid size-8 shrink-0 place-items-center rounded-full text-forest-800/40 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label={`Supprimer ${line.product.name} du panier`}
                      >
                        <TrashIcon className="size-[1.1rem]" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1 rounded-full border border-cream-300 bg-cream-50 p-1">
                        <button
                          type="button"
                          onClick={() => decrement(line.product.id)}
                          className="grid size-8 place-items-center rounded-full text-forest-800 transition-colors hover:bg-cream-200"
                          aria-label={`Diminuer la quantité de ${line.product.name}`}
                        >
                          <MinusIcon className="size-4" />
                        </button>
                        <span className="min-w-7 text-center text-sm font-bold text-forest-900 tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increment(line.product.id)}
                          className="grid size-8 place-items-center rounded-full bg-forest-800 text-cream-50 transition-colors hover:bg-forest-700"
                          aria-label={`Augmenter la quantité de ${line.product.name}`}
                        >
                          <PlusIcon className="size-4" />
                        </button>
                      </div>

                      <p className="text-right">
                        <span className="block text-[0.7rem] tracking-wide text-forest-800/45 uppercase">
                          Sous-total
                        </span>
                        <span className="font-semibold text-forest-900">
                          {formatPrice(lineSubtotal(line))}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  clear();
                  notify('Panier vidé');
                }}
                className="mt-5 w-full rounded-full py-2.5 text-sm font-medium text-forest-800/50 transition-colors hover:text-red-600"
              >
                Vider le panier
              </button>
            </div>

            {/* Pied : total + passage à la commande */}
            <div className="border-t border-cream-300 bg-cream-100/70 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-[0.95rem] font-medium text-forest-800/80">Total</span>
                <span className="font-display text-2xl font-semibold text-forest-900">
                  {formatPrice(total)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setView('commande')}
                className="w-full rounded-full bg-forest-800 px-6 py-4 text-[0.95rem] font-semibold text-cream-50 shadow-lift transition-colors hover:bg-forest-700"
              >
                Finaliser ma commande
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <span className="grid size-20 place-items-center rounded-full bg-cream-200 text-forest-800/40">
        <CartIcon className="size-9" />
      </span>
      <h3 className="mt-5 font-display text-xl text-forest-900">Votre panier est vide</h3>
      <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-forest-800/60">
        Parcourez la carte et ajoutez vos boissons et douceurs préférées.
      </p>
      <a
        href="#menu"
        onClick={onClose}
        className="mt-6 rounded-full bg-forest-800 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-700"
      >
        Voir le menu
      </a>
    </div>
  );
}
