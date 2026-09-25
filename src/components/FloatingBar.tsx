import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { buildContactUrl, isWhatsAppConfigured } from '../utils/whatsapp';
import { ArrowUpIcon, CartIcon, WhatsAppIcon } from './ui/Icons';

/**
 * Éléments flottants : panier (mobile), contact WhatsApp et retour en haut.
 * Ils s'effacent quand le panneau panier est ouvert pour ne pas se superposer.
 */
export function FloatingBar() {
  const { count, total, open, isOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const hidden = isOpen;

  return (
    <>
      {/* Barre panier — mobile et tablette uniquement : sur grand écran le
          panier reste accessible depuis le header. */}
      <div
        /* Masquée visuellement : on la retire aussi du clavier et des
           lecteurs d'écran, sans quoi un bouton invisible resterait annoncé. */
        inert={count === 0 || hidden}
        className={[
          'fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300 lg:hidden',
          count > 0 && !hidden ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={() => open('panier')}
          className="flex w-full items-center justify-between gap-3 rounded-full bg-forest-800 py-3.5 pr-5 pl-4 text-cream-50 shadow-lift transition-colors hover:bg-forest-700"
          aria-label={`Ouvrir le panier : ${count} article${count > 1 ? 's' : ''}, total ${formatPrice(total)}`}
        >
          <span className="flex items-center gap-3">
            <span className="relative grid size-9 place-items-center rounded-full bg-forest-700">
              <CartIcon className="size-5" />
              <span
                key={count}
                className="animate-bump absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-gold-500 text-[0.7rem] font-bold text-forest-950"
              >
                {count}
              </span>
            </span>
            <span className="text-[0.95rem] font-semibold">Voir le panier</span>
          </span>
          <span className="font-display text-lg font-semibold">{formatPrice(total)}</span>
        </button>
      </div>

      {/* Boutons ronds : WhatsApp et retour en haut */}
      <div
        inert={hidden}
        className={[
          'fixed right-4 z-40 flex flex-col gap-2.5 transition-all duration-300 sm:right-6',
          hidden ? 'pointer-events-none opacity-0' : 'opacity-100',
          // Se décale au-dessus de la barre panier quand celle-ci est visible.
          count > 0 ? 'bottom-[5.5rem] lg:bottom-6' : 'bottom-6',
        ].join(' ')}
      >
        <button
          type="button"
          inert={!scrolled}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={[
            'grid size-11 place-items-center rounded-full border border-cream-300 bg-cream-50 text-forest-800 shadow-lift transition-all hover:bg-white',
            scrolled ? 'scale-100 opacity-100' : 'pointer-events-none scale-75 opacity-0',
          ].join(' ')}
          aria-label="Revenir en haut de la page"
        >
          <ArrowUpIcon className="size-5" />
        </button>

        {isWhatsAppConfigured() && (
          <a
            href={buildContactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-13 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105"
            aria-label="Contacter le café sur WhatsApp"
          >
            <WhatsAppIcon className="size-7" />
          </a>
        )}
      </div>
    </>
  );
}
